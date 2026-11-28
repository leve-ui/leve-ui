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
  getCollectionItems,
  getElementByIdInContainer,
  openPopoverElement,
} from '@leve-ui/utils';
import { getSelectTrigger, ITEM_SELECTOR, selectContextId } from './select-context';

export type SelectContentProps = PropsOf<'div'> & {
  /**
   * The side of the Trigger to place the listbox on. It flips when there is no room.
   * @default 'bottom'
   */
  side?: FloatingSide;
  /**
   * The alignment along that side.
   * @default 'start'
   */
  align?: FloatingAlign;
  /**
   * The distance from the Trigger in px.
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
 * Top-layer popup (`popover="manual"`) that contains `Select.List` and positions it next to `Select.Trigger`.
 *
 * Exposes `--leve-select-anchor-width`, `--leve-select-anchor-height`,
 * `--leve-select-available-width`, `--leve-select-available-height`, and `data-side` / `data-align`.
 * Keeps focus on `Trigger` and scrolls the highlighted option into view.
 */
export const SelectContent = component$<SelectContentProps>(
  ({ side, align, sideOffset, alignOffset, avoidCollisions, collisionPadding, ...props }) => {
    const context = useContext(selectContextId);
    const ref = useSignal<HTMLElement>();
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
        const trigger = getSelectTrigger(element, context.ids.trigger);
        cleanup(
          openPopoverElement(element, {
            open: context.open,
            setOpen$: context.setOpen$,
            trigger,
            floating: { ...options, cssVarPrefix: '--leve-select' },
            moveFocus: false,
            closeOnEscape: always,
            closeOnOutsideClick: always,
          }),
        );
      },
      { strategy: 'document-ready' },
    );

    // biome-ignore lint/correctness/noQwikUseVisibleTask: scrolling the highlighted option into view needs the DOM
    useVisibleTask$(({ track }) => {
      const open = track(() => context.open.value);
      const highlighted = track(() => context.highlighted.value);
      const list = ref.value && getElementByIdInContainer(ref.value, context.ids.list);
      if (!list || !open) return;
      const items = getCollectionItems(list, ITEM_SELECTOR);
      const item = items.find((element) => element.getAttribute('data-value') === highlighted);
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
        tabIndex={props.tabIndex ?? -1}
        data-leve-select-content=""
        data-state={context.open.value ? 'open' : 'closed'}
      >
        <Slot />
      </div>
    );
  },
);
