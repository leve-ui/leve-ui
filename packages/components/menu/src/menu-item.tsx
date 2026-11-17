import { $, component$, type PropsOf, type QRL, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { menuContextId } from './menu-context';

export type MenuItemProps = PropsOf<'div'> & {
  /**
   * Disables the item: it cannot be selected and arrow keys skip it.
   * @default false
   */
  disabled?: boolean;
  /** Called when the item is selected with a click, Enter or Space. */
  onSelect$?: QRL<() => void>;
  /**
   * Whether selecting the item closes the menu.
   * @default true
   */
  closeOnSelect?: boolean;
  /** The text used by typeahead, when the item's text content is not suitable. */
  textValue?: string;
};

/**
 * メニューの項目です。`<div role="menuitem" tabindex="-1">` を描画します。
 *
 * クリック、Enter、Space で選び（`onSelect$`）、メニューを閉じて Trigger にフォーカスを戻します。
 * ポインタを載せるとフォーカスします。無効な項目は `aria-disabled` と `data-disabled` を出力し、
 * 選べず、矢印キーでは飛ばします。項目をリンクにする方法（asChild）は #153 で検討しています。
 */
export const MenuItem = component$<MenuItemProps>(
  ({
    disabled,
    onSelect$,
    closeOnSelect,
    textValue,
    onClick$,
    onKeyDown$,
    onPointerMove$,
    ...props
  }) => {
    const context = useContext(menuContextId);

    const select$ = $(async () => {
      if (disabled) return;
      await onSelect$?.();
      if (closeOnSelect !== false) await context.setOpen$(false);
    });
    const keyDown$ = $((event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') return select$();
    });
    // Moves focus with the pointer, like the native menus of operating systems
    const pointerMove$ = $((event: PointerEvent, item: HTMLElement) => {
      if (event.pointerType === 'touch' || disabled) return;
      if (item.ownerDocument.activeElement !== item) item.focus();
    });

    return (
      <div
        {...props}
        role="menuitem"
        tabIndex={-1}
        aria-disabled={disabled ? 'true' : undefined}
        onClick$={[select$, onClick$]}
        onKeyDown$={[keyDown$, onKeyDown$]}
        onPointerMove$={[pointerMove$, onPointerMove$]}
        data-leve-menu-item=""
        data-disabled={dataAttr(disabled)}
        data-text-value={textValue}
      >
        <Slot />
      </div>
    );
  },
);
