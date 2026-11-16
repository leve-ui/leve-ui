import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { drawerContextId } from './drawer-context';

export type DrawerDescriptionProps = PropsOf<'p'>;

/** ドロワーの説明文です。Content の `aria-describedby` がこの要素を指します。 */
export const DrawerDescription = component$<DrawerDescriptionProps>((props) => {
  const context = useContext(drawerContextId);

  return (
    <p {...props} id={context.ids.description} data-leve-drawer-description="">
      <Slot />
    </p>
  );
});
