import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { editableContextId } from './editable-context';

export type EditableLabelProps = PropsOf<'label'>;

/**
 * Accessible `<label>` associated with `Editable.Input`.
 */
export const EditableLabel = component$<EditableLabelProps>((props) => {
  const context = useContext(editableContextId);

  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: `for` associates this label with `Editable.Input`.
    <label
      {...props}
      id={props.id ?? context.ids.label}
      for={context.ids.input}
      data-leve-editable-label=""
      data-state={context.isEditing.value ? 'edit' : 'preview'}
      data-disabled={dataAttr(context.disabled.value)}
      data-readonly={dataAttr(context.readOnly.value)}
      data-invalid={dataAttr(context.invalid.value)}
    >
      <Slot />
    </label>
  );
});
