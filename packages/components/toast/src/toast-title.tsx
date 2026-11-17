import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { toastContextId } from './toast-context';

export type ToastTitleProps = PropsOf<'div'>;

/**
 * 通知のタイトルです。追加されたときに読み上げる文に使います。
 */
export const ToastTitle = component$<ToastTitleProps>((props) => {
  useContext(toastContextId);

  return (
    <div {...props} data-leve-toast-title="">
      <Slot />
    </div>
  );
});
