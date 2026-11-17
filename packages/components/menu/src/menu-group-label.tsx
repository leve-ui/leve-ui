import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { menuGroupContextId } from './menu-context';

export type MenuGroupLabelProps = PropsOf<'div'>;

/** `Menu.Group` の名前です。項目ではないので、フォーカスもタイプアヘッドの対象にもなりません。 */
export const MenuGroupLabel = component$<MenuGroupLabelProps>((props) => {
  const group = useContext(menuGroupContextId);

  return (
    <div {...props} id={group.labelId} data-leve-menu-group-label="">
      <Slot />
    </div>
  );
});
