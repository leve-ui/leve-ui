import { $, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { drawerContextId } from './drawer-context';

export type DrawerCloseProps = PropsOf<'button'>;

/**
 * ドロワーを閉じるボタンです。アイコンだけのボタンには `aria-label` を付けてください。
 */
export const DrawerClose = component$<DrawerCloseProps>(({ onClick$, ...props }) => {
  const context = useContext(drawerContextId);
  const close$ = $(() => context.setOpen$(false));

  return (
    <button
      {...props}
      type="button"
      onClick$={[close$, onClick$]}
      data-leve-drawer-close=""
      data-state={context.open.value ? 'open' : 'closed'}
    >
      <Slot />
    </button>
  );
});
