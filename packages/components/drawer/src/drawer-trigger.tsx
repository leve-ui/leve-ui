import { $, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { drawerContextId } from './drawer-context';

export type DrawerTriggerProps = PropsOf<'button'>;

/**
 * ドロワーを開閉するボタンです。
 *
 * `aria-haspopup="dialog"`、`aria-expanded`、`aria-controls`（Content の ID）を出力します。
 * 非モーダルのドロワーは開いている間もこのボタンを押せるので、押すたびに開閉を切り替えます。
 */
export const DrawerTrigger = component$<DrawerTriggerProps>(({ onClick$, ...props }) => {
  const context = useContext(drawerContextId);
  const toggle$ = $(() => context.setOpen$(!context.open.value));

  return (
    <button
      {...props}
      type="button"
      id={context.ids.trigger}
      aria-haspopup="dialog"
      aria-expanded={context.open.value ? 'true' : 'false'}
      aria-controls={context.ids.content}
      onClick$={[toggle$, onClick$]}
      data-leve-drawer-trigger=""
      data-state={context.open.value ? 'open' : 'closed'}
    >
      <Slot />
    </button>
  );
});
