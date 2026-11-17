import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { toastContextId } from './toast-context';

export type ToastDescriptionProps = PropsOf<'div'>;

/**
 * 通知の説明です。追加されたときに読み上げる文に使います。
 */
export const ToastDescription = component$<ToastDescriptionProps>((props) => {
  useContext(toastContextId);

  return (
    <div {...props} data-leve-toast-description="">
      <Slot />
    </div>
  );
});
