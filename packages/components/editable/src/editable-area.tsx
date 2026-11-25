import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { editableContextId } from './editable-context';

export type EditableAreaProps = PropsOf<'div'>;

/**
 * Container wrapping `Editable.Preview` and `Editable.Input`.
 */
export const EditableArea = component$<EditableAreaProps>((props) => {
  const context = useContext(editableContextId);
  const isEmpty = context.value.value.length === 0;
  const isPlaceholderShown = isEmpty && Boolean(context.placeholder.value);

  return (
    <div
      {...props}
      data-leve-editable-area=""
      data-state={context.isEditing.value ? 'edit' : 'preview'}
      data-empty={dataAttr(isEmpty)}
      data-placeholder-shown={dataAttr(isPlaceholderShown)}
      data-disabled={dataAttr(context.disabled.value)}
      data-readonly={dataAttr(context.readOnly.value)}
      data-invalid={dataAttr(context.invalid.value)}
    >
      <Slot />
    </div>
  );
});
