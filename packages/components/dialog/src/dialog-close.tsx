import { $, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dialogContextId } from './dialog-context';

export type DialogCloseProps = PropsOf<'button'>;

/**
 * ダイアログを閉じるボタンです。アイコンだけのボタンには `aria-label` を付けてください。
 */
export const DialogClose = component$<DialogCloseProps>(({ onClick$, ...props }) => {
  const context = useContext(dialogContextId);
  const close$ = $(() => context.setOpen$(false));

  return (
    <button
      {...props}
      type="button"
      onClick$={[close$, onClick$]}
      data-leve-dialog-close=""
      data-state={context.open.value ? 'open' : 'closed'}
    >
      <Slot />
    </button>
  );
});
