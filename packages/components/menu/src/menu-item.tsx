import {
  $,
  type Component,
  component$,
  type PropsOf,
  type QRL,
  Slot,
  sync$,
  useContext,
} from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { menuContextId } from './menu-context';

export type MenuItemProps = PropsOf<'div'> & {
  /**
   * The element or component to render instead of `<div>`. A component must spread the props it receives onto one element.
   * @default 'div'
   */
  // biome-ignore lint/suspicious/noExplicitAny: Component props are contravariant, so only any accepts every component (adr/0038)
  as?: keyof HTMLElementTagNameMap | Component<any>;
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
  [key: string]: unknown;
};

/**
 * メニューの項目です。既定では `<div role="menuitem" tabindex="-1">` を描画します。
 *
 * クリック、Enter、Space で選び（`onSelect$`）、メニューを閉じて Trigger にフォーカスを戻します。
 * ポインタを載せるとフォーカスします。無効な項目は `aria-disabled` と `data-disabled` を出力し、
 * 選べず、矢印キーでは飛ばします。`as` で `<a>` や Qwik City の `<Link>` に差し替えられます。
 */
export const MenuItem = component$<MenuItemProps>(
  ({
    as: Component = 'div',
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
    const Element = Component as 'div';

    const select$ = $(async () => {
      if (disabled) return;
      await onSelect$?.();
      if (closeOnSelect !== false) await context.setOpen$(false);
    });
    const preventDefault$ = sync$((event: Event, item: HTMLElement) => {
      if (item.hasAttribute('data-disabled')) {
        event.preventDefault();
        return;
      }
      if (
        event.type === 'keydown' &&
        item.tagName === 'A' &&
        ((event as KeyboardEvent).key === 'Enter' || (event as KeyboardEvent).key === ' ')
      ) {
        event.preventDefault();
      }
    });
    const keyDown$ = $((event: KeyboardEvent, item: HTMLElement) => {
      if (disabled) return;
      if (event.key === 'Enter' || event.key === ' ') {
        if (item.tagName === 'A') {
          item.click();
          return;
        }
        return select$();
      }
    });
    // Moves focus with the pointer, like the native menus of operating systems
    const pointerMove$ = $((event: PointerEvent, item: HTMLElement) => {
      if (event.pointerType === 'touch' || disabled) return;
      if (item.ownerDocument.activeElement !== item) item.focus();
    });

    return (
      <Element
        {...props}
        role="menuitem"
        tabIndex={-1}
        aria-disabled={disabled ? 'true' : undefined}
        onClick$={[preventDefault$, select$, onClick$]}
        onKeyDown$={[preventDefault$, keyDown$, onKeyDown$]}
        onPointerMove$={[pointerMove$, onPointerMove$]}
        data-leve-menu-item=""
        data-disabled={dataAttr(disabled)}
        data-text-value={textValue}
      >
        <Slot />
      </Element>
    );
  },
);
