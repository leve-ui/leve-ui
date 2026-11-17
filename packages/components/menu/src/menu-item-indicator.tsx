import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { menuItemIndicatorContextId } from './menu-context';

export type MenuItemIndicatorProps = PropsOf<'span'>;

/**
 * `Menu.CheckboxItem` / `Menu.RadioItem` のチェックの印です。チェックされていない間は `hidden` で隠します。
 * 状態は項目の `aria-checked` で伝わるので、`aria-hidden="true"` を出力します。
 */
export const MenuItemIndicator = component$<MenuItemIndicatorProps>((props) => {
  const item = useContext(menuItemIndicatorContextId);

  return (
    <span
      {...props}
      hidden={!item.checked.value}
      aria-hidden="true"
      data-leve-menu-item-indicator=""
      data-state={item.checked.value ? 'checked' : 'unchecked'}
    >
      <Slot />
    </span>
  );
});
