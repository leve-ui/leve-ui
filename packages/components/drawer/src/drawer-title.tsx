import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { drawerContextId } from './drawer-context';

export type DrawerTitleProps = PropsOf<'h2'>;

/** ドロワーの見出しです。Content の `aria-labelledby` がこの要素を指します。 */
export const DrawerTitle = component$<DrawerTitleProps>((props) => {
  const context = useContext(drawerContextId);

  return (
    <h2 {...props} id={context.ids.title} data-leve-drawer-title="">
      <Slot />
    </h2>
  );
});
