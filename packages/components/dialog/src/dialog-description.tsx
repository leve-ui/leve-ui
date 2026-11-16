import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dialogContextId } from './dialog-context';

export type DialogDescriptionProps = PropsOf<'p'>;

/** ダイアログの説明文です。Content の `aria-describedby` がこの要素を指します。 */
export const DialogDescription = component$<DialogDescriptionProps>((props) => {
  const context = useContext(dialogContextId);

  return (
    <p {...props} id={context.ids.description} data-leve-dialog-description="">
      <Slot />
    </p>
  );
});
