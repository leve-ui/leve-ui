import {
  $,
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useContext,
  useContextProvider,
} from '@builder.io/qwik';
import { dataAttr, useControllableState } from '@leve-ui/utils';
import { menuContextId, menuItemIndicatorContextId } from './menu-context';

export type MenuCheckboxItemProps = PropsOf<'div'> & {
  /**
   * Whether the item is checked initially (uncontrolled).
   * @default false
   */
  defaultChecked?: boolean;
  /** A signal with the checked state (controlled). */
  'bind:checked'?: Signal<boolean>;
  /** Called when the user checks or unchecks the item. */
  onCheckedChange$?: QRL<(checked: boolean) => void>;
  /**
   * Disables the item: it cannot be changed and arrow keys skip it.
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
 * オン / オフを切り替えるメニューの項目です。`<div role="menuitemcheckbox" aria-checked>` を描画します。
 *
 * クリックと Enter で切り替えてメニューを閉じ、Space では閉じずに切り替えます（APG Menu）。
 * 状態の表示には `Menu.ItemIndicator` を中に置きます。
 */
export const MenuCheckboxItem = component$<MenuCheckboxItemProps>(
  ({
    defaultChecked = false,
    'bind:checked': bindChecked,
    onCheckedChange$,
    disabled,
    closeOnSelect,
    textValue,
    onClick$,
    onKeyDown$,
    onPointerMove$,
    ...props
  }) => {
    const context = useContext(menuContextId);
    const [checked, setChecked$] = useControllableState({
      value: bindChecked,
      defaultValue: defaultChecked ?? false,
      onChange$: onCheckedChange$,
    });
    useContextProvider(menuItemIndicatorContextId, { checked });

    const toggle$ = $(async (close: boolean) => {
      if (disabled) return;
      await setChecked$(!checked.value);
      if (close && closeOnSelect !== false) await context.setOpen$(false);
    });
    const click$ = $(() => toggle$(true));
    const keyDown$ = $((event: KeyboardEvent) => {
      if (event.key === 'Enter') return toggle$(true);
      if (event.key === ' ') return toggle$(false);
    });
    const pointerMove$ = $((event: PointerEvent, item: HTMLElement) => {
      if (event.pointerType === 'touch' || disabled) return;
      if (item.ownerDocument.activeElement !== item) item.focus();
    });

    return (
      <div
        {...props}
        role="menuitemcheckbox"
        tabIndex={-1}
        aria-checked={checked.value ? 'true' : 'false'}
        aria-disabled={disabled ? 'true' : undefined}
        onClick$={[click$, onClick$]}
        onKeyDown$={[keyDown$, onKeyDown$]}
        onPointerMove$={[pointerMove$, onPointerMove$]}
        data-leve-menu-checkbox-item=""
        data-state={checked.value ? 'checked' : 'unchecked'}
        data-disabled={dataAttr(disabled)}
        data-text-value={textValue}
      >
        <Slot />
      </div>
    );
  },
);
