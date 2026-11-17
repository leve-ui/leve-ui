import {
  $,
  component$,
  type PropsOf,
  Slot,
  sync$,
  useComputed$,
  useContext,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import {
  type FloatingAlign,
  type FloatingSide,
  getEdgeMenuItem,
  moveMenuFocus,
  openPopoverElement,
} from '@leve-ui/utils';
import { menuContextId } from './menu-context';

export type MenuContentProps = PropsOf<'div'> & {
  /**
   * The side of the Trigger to place the menu on. It flips when there is no room.
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
   * Whether to flip and shift the menu to keep it in the viewport.
   * @default true
   */
  avoidCollisions?: boolean;
  /**
   * The padding from the viewport edges when avoiding collisions, in px.
   * @default 0
   */
  collisionPadding?: number;
  /**
   * The padding between the arrow and the corners of the menu, in px.
   * @default 0
   */
  arrowPadding?: number;
};

/**
 * メニュー本体です。`role="menu"` と `popover="manual"` を出力します。
 *
 * - 開くと最初（↑ で開いたときは最後）の有効な項目にフォーカスします。
 * - ↑ / ↓、Home / End、文字キー（タイプアヘッド）で項目を移動します。無効な項目は飛ばします。
 * - Escape で閉じて Trigger にフォーカスを戻します。外側のクリックや Tab でも閉じます。
 * - Floating UI で Trigger の隣に置き（`adr/0030`）、反転後の `data-side` / `data-align` と CSS 変数
 *   （`--leve-menu-anchor-width` など）を出力します。位置のインラインスタイルは機能上必要なため出力します。
 */
export const MenuContent = component$<MenuContentProps>(
  ({
    side,
    align,
    sideOffset,
    alignOffset,
    avoidCollisions,
    collisionPadding,
    arrowPadding,
    onKeyDown$,
    ...props
  }) => {
    const context = useContext(menuContextId);
    const ref = useSignal<HTMLElement>();
    const always = useComputed$(() => true);
    const floating = useComputed$(() => ({
      side: side ?? 'bottom',
      align: align ?? 'start',
      sideOffset: sideOffset ?? 0,
      alignOffset: alignOffset ?? 0,
      avoidCollisions: avoidCollisions ?? true,
      collisionPadding: collisionPadding ?? 0,
      arrowPadding: arrowPadding ?? 0,
    }));

    // biome-ignore lint/correctness/noQwikUseVisibleTask: showPopover(), positioning and focus need the DOM; it must also run for a menu open on load (adr/0029, adr/0030)
    useVisibleTask$(
      ({ track, cleanup }) => {
        const open = track(() => context.open.value);
        const options = track(() => floating.value);
        const element = ref.value;
        if (!element || !open) return;
        const edge = context.initialFocus.value;
        cleanup(
          openPopoverElement(element, {
            open: context.open,
            setOpen$: context.setOpen$,
            trigger: element.ownerDocument.getElementById(context.ids.trigger),
            floating: {
              ...options,
              cssVarPrefix: '--leve-menu',
              arrowSelector: '[data-leve-menu-arrow]',
            },
            moveFocus: true,
            initialFocus: () => getEdgeMenuItem(element, edge),
            closeOnEscape: always,
            closeOnOutsideClick: always,
          }),
        );
      },
      { strategy: 'document-ready' },
    );

    // Arrow keys, Home / End and Space would scroll the page
    const preventScroll$ = sync$((event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'Home', 'End', ' '].includes(event.key)) event.preventDefault();
    });
    const move$ = $((event: KeyboardEvent, menu: HTMLElement) => {
      // Tab leaves the menu: close it, submenus included (APG)
      if (event.key === 'Tab') return context.setOpen$(false);
      // Keys in a submenu bubble up here; the submenu handles them
      if ((event.target as Element).closest('[role="menu"]') !== menu) return;
      moveMenuFocus(event, menu, { loop: context.loop.value });
    });

    return (
      <div
        {...props}
        ref={ref}
        id={context.ids.content}
        role="menu"
        popover="manual"
        tabIndex={-1}
        aria-labelledby={props['aria-label'] ? undefined : context.ids.trigger}
        onKeyDown$={[preventScroll$, move$, onKeyDown$]}
        data-leve-menu-content=""
        data-state={context.open.value ? 'open' : 'closed'}
      >
        <Slot />
      </div>
    );
  },
);
