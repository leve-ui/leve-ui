import { $, component$, type PropsOf, Slot, sync$, useContext, useSignal } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { menuContextId } from './menu-context';

export type MenuContextTriggerProps = PropsOf<'div'> & {
  /**
   * Whether the area does not open the menu. The browser's own context menu is shown instead.
   * @default false
   */
  disabled?: boolean;
};

/** How long a touch must be held to open the menu, in ms */
const LONG_PRESS_DELAY = 700;
/** How far a touch may move before the long press is cancelled, in px */
const LONG_PRESS_TOLERANCE = 10;

/** Events from a menu rendered inside the area are not the area's */
function isInMenu(target: EventTarget | null) {
  return Boolean((target as Element | null)?.closest?.('[role="menu"]'));
}

/**
 * コンテキストメニューを開く領域です。`Menu.Trigger` の代わりに `Menu.Root` の中に置きます。
 *
 * - 右クリック（macOS の Control + クリックを含む）で、ポインタの位置にメニューを開きます。
 *   開いているときに領域の中をもう一度右クリックすると、その位置に開き直します。
 * - 領域の中でフォーカスしている要素で Shift+F10 か ContextMenu キーを押すと、その要素の左下に開きます。
 *   閉じるとその要素にフォーカスを戻します。領域そのものはフォーカス可能にしません。
 * - タッチでは長押し（700ms、10px 以上動かすと取り消し）で開きます。
 *
 * 領域は利用者の内容そのものなので、`role` は付けません。開くとメニューの最初の項目にフォーカスします。
 */
export const MenuContextTrigger = component$<MenuContextTriggerProps>(
  ({
    disabled,
    onContextMenu$,
    onKeyDown$,
    onPointerDown$,
    onPointerMove$,
    onPointerUp$,
    onPointerCancel$,
    ...props
  }) => {
    const context = useContext(menuContextId);
    const longPress = useSignal<{ timer: number; x: number; y: number } | null>(null);
    const longPressed = useSignal(false);

    const openAt$ = $((x: number, y: number, keyboard: boolean) => {
      context.initialFocus.value = 'first';
      context.point.value = { x, y, keyboard };
      return context.setOpen$(true);
    });

    // Keeps the browser's menu (and the keyboard shortcuts' default action) from showing
    const preventDefault$ = sync$((event: Event, element: HTMLElement) => {
      if (element.hasAttribute('data-disabled')) return;
      if ((event.target as Element | null)?.closest?.('[role="menu"]')) return;
      if (event.type === 'contextmenu') event.preventDefault();
      const key = (event as KeyboardEvent).key;
      if (key === 'ContextMenu' || (key === 'F10' && (event as KeyboardEvent).shiftKey)) {
        event.preventDefault();
      }
    });

    const contextMenu$ = $((event: MouseEvent) => {
      if (disabled) return;
      if (isInMenu(event.target)) return;
      // A long press already opened it (Android also fires contextmenu for it)
      if (longPressed.value) return;
      // The contextmenu event some browsers fire after Shift+F10, which already opened the menu
      if (context.open.value && context.point.value?.keyboard && event.button !== 2) return;
      return openAt$(event.clientX, event.clientY, false);
    });

    const keyDown$ = $((event: KeyboardEvent) => {
      if (disabled) return;
      if (event.key !== 'ContextMenu' && !(event.key === 'F10' && event.shiftKey)) return;
      const target = event.target as Element | null;
      if (!target?.getBoundingClientRect || isInMenu(target)) return;
      const rect = target.getBoundingClientRect();
      return openAt$(rect.left, rect.bottom, true);
    });

    const cancelLongPress$ = $(() => {
      if (longPress.value) clearTimeout(longPress.value.timer);
      longPress.value = null;
    });

    const pointerDown$ = $((event: PointerEvent) => {
      longPressed.value = false;
      if (disabled || event.pointerType !== 'touch') return;
      if (isInMenu(event.target)) return;
      const { clientX: x, clientY: y } = event;
      const timer = window.setTimeout(() => {
        longPress.value = null;
        longPressed.value = true;
        openAt$(x, y, false);
      }, LONG_PRESS_DELAY);
      longPress.value = { timer, x, y };
    });

    const pointerMove$ = $((event: PointerEvent) => {
      const start = longPress.value;
      if (!start) return;
      const distance = Math.hypot(event.clientX - start.x, event.clientY - start.y);
      if (distance > LONG_PRESS_TOLERANCE) return cancelLongPress$();
    });

    return (
      <div
        {...props}
        onContextMenu$={[preventDefault$, contextMenu$, onContextMenu$]}
        onKeyDown$={[preventDefault$, keyDown$, onKeyDown$]}
        onPointerDown$={[pointerDown$, onPointerDown$]}
        onPointerMove$={[pointerMove$, onPointerMove$]}
        onPointerUp$={[cancelLongPress$, onPointerUp$]}
        onPointerCancel$={[cancelLongPress$, onPointerCancel$]}
        data-leve-menu-context-trigger=""
        data-state={context.open.value ? 'open' : 'closed'}
        data-disabled={dataAttr(disabled)}
      >
        <Slot />
      </div>
    );
  },
);
