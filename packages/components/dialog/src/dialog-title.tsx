import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dialogContextId } from './dialog-context';

export type DialogTitleProps = PropsOf<'h2'>;

/** ダイアログの見出しです。Content の `aria-labelledby` がこの要素を指します。 */
export const DialogTitle = component$<DialogTitleProps>((props) => {
  const context = useContext(dialogContextId);

  return (
    <h2 {...props} id={context.ids.title} data-leve-dialog-title="">
      <Slot />
    </h2>
  );
});
