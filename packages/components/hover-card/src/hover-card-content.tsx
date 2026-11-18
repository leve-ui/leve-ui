import {
  $,
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
  getElementByIdInContainer,
  openPopoverElement,
} from '@leve-ui/utils';
import { hoverCardContextId } from './hover-card-context';

export type HoverCardContentProps = PropsOf<'span'> & {
  /**
   * The side of the Trigger to place the card on. It flips when there is no room.
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
   * Whether to flip and shift the card to keep it in the viewport.
   * @default true
   */
  avoidCollisions?: boolean;
  /**
   * The padding from the viewport edges when avoiding collisions, in px.
   * @default 0
   */
  collisionPadding?: number;
  /**
   * The padding between the arrow and the corners of the card, in px.
   * @default 0
   */
  arrowPadding?: number;
};

/**
 * ホバーカード本体（リンク先のプレビュー）です。文中（`<p>` の中）にも置けるよう `<span>` を描画します。
 * `popover="manual"` で最前面（top layer）に出します。
 *
 * - 補足のプレビューなので `role` は付けず、Trigger とも ARIA で関連付けません。フォーカスも移しません。
 *   Content にしかない情報や操作を置かず、リンク先でも同じ情報を得られるようにしてください。
 * - ポインタが Content の上にある間は閉じません（WCAG 1.4.13）。中のリンクはクリックできます。
 *   Escape で閉じます。
 * - Floating UI で Trigger の隣に置き（`adr/0030`）、反転後の `data-side` / `data-align` と CSS 変数
 *   （`--leve-hover-card-anchor-width` など）を出力します。位置のインラインスタイルは機能上必要なため出力します。
 */
export const HoverCardContent = component$<HoverCardContentProps>(
  ({
    side,
    align,
    sideOffset,
    alignOffset,
    avoidCollisions,
    collisionPadding,
    arrowPadding,
    onPointerEnter$,
    onPointerLeave$,
    ...props
  }) => {
    const context = useContext(hoverCardContextId);
    const ref = useSignal<HTMLElement>();
    const always = useComputed$(() => true);
    const floating = useComputed$(() => ({
      side: side ?? 'bottom',
      align: align ?? 'center',
      sideOffset: sideOffset ?? 0,
      alignOffset: alignOffset ?? 0,
      avoidCollisions: avoidCollisions ?? true,
      collisionPadding: collisionPadding ?? 0,
      arrowPadding: arrowPadding ?? 0,
    }));

    // biome-ignore lint/correctness/noQwikUseVisibleTask: showPopover() and positioning need the DOM; it must also run for a card open on load (adr/0029, adr/0030)
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
            trigger: getElementByIdInContainer(element, context.ids.trigger),
            floating: {
              ...options,
              cssVarPrefix: '--leve-hover-card',
              arrowSelector: '[data-leve-hover-card-arrow]',
            },
            moveFocus: false,
            closeOnEscape: always,
            closeOnOutsideClick: always,
          }),
        );
      },
      { strategy: 'document-ready' },
    );

    // Keeps the card open while the pointer is on it (WCAG 1.4.13)
    const enter$ = $(() => {
      context.pointerOnContent.value = true;
      context.cancel$();
    });
    const leave$ = $(() => {
      context.pointerOnContent.value = false;
      context.hide$(false);
    });

    return (
      <span
        {...props}
        ref={ref}
        id={context.ids.content}
        popover="manual"
        onPointerEnter$={[enter$, onPointerEnter$]}
        onPointerLeave$={[leave$, onPointerLeave$]}
        data-leve-hover-card-content=""
        data-state={context.open.value ? 'open' : 'closed'}
      >
        <Slot />
      </span>
    );
  },
);
