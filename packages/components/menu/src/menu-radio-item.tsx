import {
  $,
  component$,
  type PropsOf,
  Slot,
  useComputed$,
  useContext,
  useContextProvider,
} from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { menuContextId, menuItemIndicatorContextId, menuRadioGroupContextId } from './menu-context';

export type MenuRadioItemProps = PropsOf<'div'> & {
  /** The value of this item. */
  value: string;
  /**
   * Disables the item: it cannot be selected and arrow keys skip it.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether a click or Enter closes the menu. Space never closes it (APG).
   * @default true
   */
  closeOnSelect?: boolean;
  /** The text used by typeahead, when the item's text content is not suitable. */
  textValue?: string;
};

/**
 * `Menu.RadioGroup` の中で 1 つだけ選べる項目です。`<div role="menuitemradio" aria-checked>` を描画します。
 *
 * クリックと Enter で選んでメニューを閉じ、Space では閉じずに選びます（APG Menu）。
 * 状態の表示には `Menu.ItemIndicator` を中に置きます。
 */
export const MenuRadioItem = component$<MenuRadioItemProps>(
  ({
    value,
    disabled,
    closeOnSelect,
    textValue,
    onClick$,
    onKeyDown$,
    onPointerMove$,
    ...props
  }) => {
    const context = useContext(menuContextId);
    const group = useContext(menuRadioGroupContextId);
    const checked = useComputed$(() => group.value.value === value);
    useContextProvider(menuItemIndicatorContextId, { checked });

    const select$ = $(async (close: boolean) => {
      if (disabled) return;
      await group.setValue$(value);
      if (close && closeOnSelect !== false) await context.setOpen$(false);
    });
    const click$ = $(() => select$(true));
    const keyDown$ = $((event: KeyboardEvent) => {
      if (event.key === 'Enter') return select$(true);
      if (event.key === ' ') return select$(false);
    });
    const pointerMove$ = $((event: PointerEvent, item: HTMLElement) => {
      if (event.pointerType === 'touch' || disabled) return;
      if (item.ownerDocument.activeElement !== item) item.focus();
    });

    return (
      <div
        {...props}
        role="menuitemradio"
        tabIndex={-1}
        aria-checked={checked.value ? 'true' : 'false'}
        aria-disabled={disabled ? 'true' : undefined}
        onClick$={[click$, onClick$]}
        onKeyDown$={[keyDown$, onKeyDown$]}
        onPointerMove$={[pointerMove$, onPointerMove$]}
        data-leve-menu-radio-item=""
        data-state={checked.value ? 'checked' : 'unchecked'}
        data-disabled={dataAttr(disabled)}
        data-text-value={textValue}
      >
        <Slot />
      </div>
    );
  },
);
