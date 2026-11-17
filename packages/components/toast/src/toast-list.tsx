import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { toastProviderContextId } from './toast-context';

export type ToastListProps = PropsOf<'ol'>;

/**
 * 通知の一覧（`<ol>`）です。`useToaster().toasts` を map して `Toast.Root` を並べます。
 */
export const ToastList = component$<ToastListProps>((props) => {
  const context = useContext(toastProviderContextId);

  return (
    <ol
      {...props}
      data-leve-toast-list=""
      data-placement={context.placement.value}
      data-expanded={dataAttr(context.hovered.value || context.focused.value)}
    >
      <Slot />
    </ol>
  );
});
