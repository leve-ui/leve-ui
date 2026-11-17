import { $, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { toastContextId, toastProviderContextId } from './toast-context';

export type ToastActionProps = PropsOf<'button'>;

/**
 * 通知の操作（「元に戻す」など）のボタンです。押すと `onClick$` の後に通知を閉じます。
 *
 * Action を含む通知は自動では閉じません。通知が消えた後も同じ操作ができるよう、ページの別の場所にも
 * 同じ操作を用意してください。
 */
export const ToastAction = component$<ToastActionProps>(({ onClick$, ...props }) => {
  const provider = useContext(toastProviderContextId);
  const toast = useContext(toastContextId);

  const close$ = $(() => provider.dismiss$(toast.id));

  return (
    <button {...props} type="button" onClick$={[onClick$, close$]} data-leve-toast-action="">
      <Slot />
    </button>
  );
});
