import { $, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { menuSubContextId } from './menu-context';

export type MenuSubTriggerProps = PropsOf<'div'> & {
  /**
   * Disables the item: it cannot open the submenu and arrow keys skip it.
   * @default false
   */
  disabled?: boolean;
  /** The text used by typeahead, when the item's text content is not suitable. */
  textValue?: string;
};

/**
 * サブメニューを開く項目です。`<div role="menuitem" aria-haspopup="menu">` を描画します。
 *
 * →、Enter、Space で開いて最初の項目にフォーカスします。ポインタを載せると、フォーカスはそのままで開きます。
 */
export const MenuSubTrigger = component$<MenuSubTriggerProps>(
  ({ disabled, textValue, onClick$, onKeyDown$, onPointerMove$, ...props }) => {
    const sub = useContext(menuSubContextId);

    const openWithKeyboard$ = $(() => {
      if (disabled) return;
      sub.focusOnOpen.value = true;
      return sub.setOpen$(true);
    });
    const keyDown$ = $((event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
        return openWithKeyboard$();
      }
    });
    const click$ = $(() => {
      if (disabled) return;
      sub.focusOnOpen.value = false;
      return sub.setOpen$(true);
    });
    // Focuses the item and opens the submenu with the pointer, keeping focus here
    const pointerMove$ = $((event: PointerEvent, item: HTMLElement) => {
      if (event.pointerType === 'touch' || disabled) return;
      if (item.ownerDocument.activeElement !== item) item.focus();
      if (!sub.open.value) {
        sub.focusOnOpen.value = false;
        return sub.setOpen$(true);
      }
    });

    return (
      <div
        {...props}
        id={sub.ids.trigger}
        role="menuitem"
        tabIndex={-1}
        aria-haspopup="menu"
        aria-expanded={sub.open.value ? 'true' : 'false'}
        aria-controls={sub.ids.content}
        aria-disabled={disabled ? 'true' : undefined}
        onClick$={[click$, onClick$]}
        onKeyDown$={[keyDown$, onKeyDown$]}
        onPointerMove$={[pointerMove$, onPointerMove$]}
        data-leve-menu-sub-trigger=""
        data-state={sub.open.value ? 'open' : 'closed'}
        data-disabled={dataAttr(disabled)}
        data-text-value={textValue}
      >
        <Slot />
      </div>
    );
  },
);
