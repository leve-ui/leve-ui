import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { editableContextId } from './editable-context';

export type EditableControlProps = PropsOf<'div'>;

/**
 * Container for action triggers (`EditTrigger`, `SubmitTrigger`, `CancelTrigger`).
 */
export const EditableControl = component$<EditableControlProps>((props) => {
  const context = useContext(editableContextId);

  return (
    <div
      {...props}
      data-leve-editable-control=""
      data-state={context.isEditing.value ? 'edit' : 'preview'}
      data-disabled={dataAttr(context.disabled.value)}
      data-readonly={dataAttr(context.readOnly.value)}
    >
      <Slot />
    </div>
  );
});
