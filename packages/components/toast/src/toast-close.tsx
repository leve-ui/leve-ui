import { $, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { toastContextId, toastProviderContextId } from './toast-context';

export type ToastCloseProps = PropsOf<'button'>;

/**
 * 通知を閉じるボタンです。アイコンだけのときは `aria-label` を付けてください。
 */
export const ToastClose = component$<ToastCloseProps>(({ onClick$, ...props }) => {
  const provider = useContext(toastProviderContextId);
  const toast = useContext(toastContextId);

  const close$ = $(() => provider.dismiss$(toast.id));

  return (
    <button {...props} type="button" onClick$={[onClick$, close$]} data-leve-toast-close="">
      <Slot />
    </button>
  );
});
