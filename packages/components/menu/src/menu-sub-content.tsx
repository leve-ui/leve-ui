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
  getElementByIdInContainer,
  moveMenuFocus,
  openPopoverElement,
} from '@leve-ui/utils';
import { menuContextId, menuSubContextId } from './menu-context';

export type MenuSubContentProps = PropsOf<'div'> & {
  /**
   * The side of the SubTrigger to place the submenu on. It flips when there is no room.
   * @default 'right'
   */
  side?: FloatingSide;
  /**
   * The alignment along that side.
   * @default 'start'
   */
  align?: FloatingAlign;
  /**
   * The distance from the SubTrigger in px.
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
 * サブメニュー本体です。`role="menu"` と `popover="manual"` を出力し、SubTrigger の横に置きます。
 *
 * - キー操作は親のメニューと同じです（↑ / ↓、Home / End、文字キー）。
 * - ← と Escape でサブメニューだけを閉じ、SubTrigger にフォーカスを戻します。
 * - 項目を選ぶと、親のメニューごと閉じます。サブメニューと親のメニューの外を押すと、両方とも閉じます。
 */
export const MenuSubContent = component$<MenuSubContentProps>(
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
    const sub = useContext(menuSubContextId);
    const ref = useSignal<HTMLElement>();
    const always = useComputed$(() => true);
    const floating = useComputed$(() => ({
      side: side ?? 'right',
      align: align ?? 'start',
      sideOffset: sideOffset ?? 0,
      alignOffset: alignOffset ?? 0,
      avoidCollisions: avoidCollisions ?? true,
      collisionPadding: collisionPadding ?? 0,
      arrowPadding: arrowPadding ?? 0,
    }));

    // biome-ignore lint/correctness/noQwikUseVisibleTask: showPopover(), positioning and focus need the DOM; it must also run for a submenu open on load (adr/0029, adr/0030)
    useVisibleTask$(
      ({ track, cleanup }) => {
        const open = track(() => sub.open.value);
        const options = track(() => floating.value);
        const element = ref.value;
        if (!element || !open) return;
        const focusOnOpen = sub.focusOnOpen.value;
        cleanup(
          openPopoverElement(element, {
            open: sub.open,
            setOpen$: sub.setOpen$,
            trigger: getElementByIdInContainer(element, sub.ids.trigger),
            floating: {
              ...options,
              cssVarPrefix: '--leve-menu-sub',
              arrowSelector: '[data-leve-menu-arrow]',
            },
            moveFocus: true,
            initialFocus: focusOnOpen ? () => getEdgeMenuItem(element, 'first') : false,
            // Pressing outside both menus closes the whole menu
            onOutsidePointerDown: (target) => {
              const parent = getElementByIdInContainer(element, context.ids.content);
              if (!(target instanceof Node) || !parent?.contains(target)) context.setOpen$(false);
            },
            closeOnEscape: always,
            closeOnOutsideClick: always,
          }),
        );
      },
      { strategy: 'document-ready' },
    );

    // Arrow keys, Home / End and Space would scroll the page; Enter on <a> or keys on disabled items are handled by the item
    const preventScroll$ = sync$((event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'Home', 'End', ' '].includes(event.key)) {
        event.preventDefault();
        return;
      }
      const item = (event.target as Element | null)?.closest?.('[data-leve-menu-item]');
      if (
        item &&
        (item.hasAttribute('data-disabled') || (event.key === 'Enter' && item.tagName === 'A'))
      ) {
        event.preventDefault();
      }
    });
    const move$ = $((event: KeyboardEvent, menu: HTMLElement) => {
      // Keys in a nested submenu bubble up here; that submenu handles them
      if ((event.target as Element).closest('[role="menu"]') !== menu) return;
      if (event.key === 'ArrowLeft') return sub.setOpen$(false);
      moveMenuFocus(event, menu, { loop: context.loop.value });
    });

    return (
      <div
        {...props}
        ref={ref}
        id={sub.ids.content}
        role="menu"
        popover="manual"
        tabIndex={-1}
        aria-labelledby={props['aria-label'] ? undefined : sub.ids.trigger}
        onKeyDown$={[preventScroll$, move$, onKeyDown$]}
        data-leve-menu-sub-content=""
        data-state={sub.open.value ? 'open' : 'closed'}
      >
        <Slot />
      </div>
    );
  },
);
