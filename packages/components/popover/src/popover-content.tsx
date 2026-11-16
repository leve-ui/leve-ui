import {
  component$,
  type PropsOf,
  Slot,
  useComputed$,
  useContext,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import { type FloatingAlign, type FloatingSide, openPopoverElement } from '@leve-ui/utils';
import { popoverContextId } from './popover-context';

export type PopoverContentProps = PropsOf<'div'> & {
  /**
   * The side of the Trigger (or Anchor) to place the popover on. It flips when there is no room.
   * @default 'bottom'
   */
  side?: FloatingSide;
  /**
   * The alignment along that side.
   * @default 'center'
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
   * Whether to flip and shift the popover to keep it in the viewport.
   * @default true
   */
  avoidCollisions?: boolean;
  /**
   * The padding from the viewport edges when avoiding collisions, in px.
   * @default 0
   */
  collisionPadding?: number;
  /**
   * The padding between the arrow and the corners of the popover, in px.
   * @default 0
   */
  arrowPadding?: number;
  /**
   * Whether Escape closes the popover.
   * @default true
   */
  closeOnEscape?: boolean;
  /**
   * Whether a pointer down outside the popover closes it.
   * @default true
   */
  closeOnOutsideClick?: boolean;
};

/**
 * ポップオーバー本体です。`role="dialog"` と `popover="manual"` を出力します。
 *
 * - 開くと最初のフォーカス可能な要素（なければ Content 自身）にフォーカスします。
 * - Escape、外側のクリック、外側へのフォーカス移動（Tab など）で閉じます。Escape や Close で閉じたときは
 *   Trigger にフォーカスを戻します。
 * - Floating UI で Trigger（または Anchor）の隣に置き（`adr/0030`）、反転後の `data-side` / `data-align` と
 *   CSS 変数（`--leve-popover-anchor-width`、`--leve-popover-available-height` など）を出力します。
 *   位置のインラインスタイル（`position` / `top` / `left`）は機能上必要なため出力します。
 * - アクセシブルネームは `Popover.Title`、なければ `aria-label` で付けてください。
 */
export const PopoverContent = component$<PopoverContentProps>(
  ({
    side,
    align,
    sideOffset,
    alignOffset,
    avoidCollisions,
    collisionPadding,
    arrowPadding,
    closeOnEscape,
    closeOnOutsideClick,
    ...props
  }) => {
    const context = useContext(popoverContextId);
    const ref = useSignal<HTMLElement>();
    const closeOnEscapeSignal = useComputed$(() => closeOnEscape ?? true);
    const closeOnOutsideClickSignal = useComputed$(() => closeOnOutsideClick ?? true);
    const floating = useComputed$(() => ({
      side: side ?? 'bottom',
      align: align ?? 'center',
      sideOffset: sideOffset ?? 0,
      alignOffset: alignOffset ?? 0,
      avoidCollisions: avoidCollisions ?? true,
      collisionPadding: collisionPadding ?? 0,
      arrowPadding: arrowPadding ?? 0,
    }));

    // biome-ignore lint/correctness/noQwikUseVisibleTask: showPopover(), positioning and focus need the DOM; it must also run for a popover open on load (adr/0029, adr/0030)
    useVisibleTask$(
      ({ track, cleanup }) => {
        const open = track(() => context.open.value);
        const options = track(() => floating.value);
        const element = ref.value;
        if (!element || !open) return;
        cleanup(
          openPopoverElement(element, {
            open: context.open,
            setOpen$: context.setOpen$,
            trigger: element.ownerDocument.getElementById(context.ids.trigger),
            anchor: context.anchor.value,
            floating: {
              ...options,
              cssVarPrefix: '--leve-popover',
              arrowSelector: '[data-leve-popover-arrow]',
            },
            moveFocus: true,
            closeOnEscape: closeOnEscapeSignal,
            closeOnOutsideClick: closeOnOutsideClickSignal,
          }),
        );
      },
      { strategy: 'document-ready' },
    );

    return (
      <div
        tabIndex={-1}
        {...props}
        ref={ref}
        id={context.ids.content}
        role="dialog"
        popover="manual"
        aria-labelledby={
          props['aria-labelledby'] ?? (props['aria-label'] ? undefined : context.ids.title)
        }
        aria-describedby={context.ids.description}
        data-leve-popover-content=""
        data-state={context.open.value ? 'open' : 'closed'}
      >
        <Slot />
      </div>
    );
  },
);
