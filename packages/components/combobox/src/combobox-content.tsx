import {
  component$,
  type PropsOf,
  Slot,
  useComputed$,
  useContext,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import {
  type FloatingAlign,
  type FloatingSide,
  getAdjacentItem,
  getCollectionItems,
  getElementByIdInContainer,
  openPopoverElement,
} from '@leve-ui/utils';
import { comboboxContextId, getComboboxInput, ITEM_SELECTOR } from './combobox-context';

export type ComboboxContentProps = PropsOf<'div'> & {
  /**
   * The side of the Control to place the listbox on. It flips when there is no room.
   * @default 'bottom'
   */
  side?: FloatingSide;
  /**
   * The alignment along that side.
   * @default 'start'
   */
  align?: FloatingAlign;
  /**
   * The distance from the Control in px.
   * @default 0
   */
  sideOffset?: number;
  /**
   * The offset along the side in px.
   * @default 0
   */
  alignOffset?: number;
  /**
   * Whether to flip and shift the listbox to keep it in the viewport.
   * @default true
   */
  avoidCollisions?: boolean;
  /**
   * The padding from the viewport edges when avoiding collisions, in px.
   * @default 0
   */
  collisionPadding?: number;
};

/**
 * 候補の一覧を包むポップアップ（`popover="manual"`）です。中に `List` と `Empty` を置きます。
 *
 * - Control（なければ Input）の下に置き、`--leve-combobox-anchor-width` などの CSS 変数と、反転後の
 *   `data-side` / `data-align` を出力します。位置のインラインスタイルは機能上必要なため出力します。
 * - フォーカスは Input に残します。外側を押すと閉じます。
 * - 強調中の項目を見える位置までスクロールし、項目が消えたら強調を外します。`autoHighlight` のときは、
 *   入力のたびに最初の項目を強調します。
 */
export const ComboboxContent = component$<ComboboxContentProps>(
  ({ side, align, sideOffset, alignOffset, avoidCollisions, collisionPadding, ...props }) => {
    const context = useContext(comboboxContextId);
    const ref = useSignal<HTMLElement>();
    const never = useComputed$(() => false);
    const always = useComputed$(() => true);
    const floating = useComputed$(() => ({
      side: side ?? 'bottom',
      align: align ?? 'start',
      sideOffset: sideOffset ?? 0,
      alignOffset: alignOffset ?? 0,
      avoidCollisions: avoidCollisions ?? true,
      collisionPadding: collisionPadding ?? 0,
    }));

    // biome-ignore lint/correctness/noQwikUseVisibleTask: showPopover() and positioning need the DOM; it must also run for a listbox open on load (adr/0029, adr/0030)
    useVisibleTask$(
      ({ track, cleanup }) => {
        const open = track(() => context.open.value);
        const options = track(() => floating.value);
        const element = ref.value;
        if (!element || !open) return;
        const control = getElementByIdInContainer(element, context.ids.control);
        cleanup(
          openPopoverElement(element, {
            open: context.open,
            setOpen$: context.setOpen$,
            // Pressing the Control (the input or the Trigger) is not outside
            trigger: control ?? getComboboxInput(element, context.ids.input),
            floating: { ...options, cssVarPrefix: '--leve-combobox' },
            moveFocus: false,
            // The input handles Escape: it closes, or clears when closed
            closeOnEscape: never,
            closeOnOutsideClick: always,
          }),
        );
      },
      { strategy: 'document-ready' },
    );

    // biome-ignore lint/correctness/noQwikUseVisibleTask: the highlight follows the items in the DOM after they are filtered
    useVisibleTask$(({ track }) => {
      track(() => context.inputValue.value);
      const open = track(() => context.open.value);
      const highlighted = track(() => context.highlighted.value);
      const list = ref.value && getElementByIdInContainer(ref.value, context.ids.list);
      if (!list || !open) return;
      const items = getCollectionItems(list, ITEM_SELECTOR);
      const item = items.find((element) => element.getAttribute('data-value') === highlighted);
      if (context.autoHighlight.value && context.inputValue.value !== '' && !item) {
        context.highlighted.value =
          getAdjacentItem(items, null, 'first')?.getAttribute('data-value') ?? null;
        return;
      }
      if (highlighted !== null && !item) {
        context.highlighted.value = null;
        return;
      }
      item?.scrollIntoView?.({ block: 'nearest' });
    });

    return (
      <div
        {...props}
        ref={ref}
        popover="manual"
        data-leve-combobox-content=""
        data-state={context.open.value ? 'open' : 'closed'}
      >
        <Slot />
      </div>
    );
  },
);
