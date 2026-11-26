import { $, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { editableContextId } from './editable-context';

export type EditableEditTriggerProps = PropsOf<'button'>;

/**
 * Button that enters edit mode and focuses `Editable.Input`.
 */
export const EditableEditTrigger = component$<EditableEditTriggerProps>((props) => {
  const context = useContext(editableContextId);
  const isDisabled = context.disabled.value || context.readOnly.value;

  const handleClick$ = $(async () => {
    if (isDisabled) return;
    await context.startEdit$();
  });

  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      hidden={context.isEditing.value}
      disabled={isDisabled}
      onClick$={[handleClick$, props.onClick$]}
      data-leve-editable-edit-trigger=""
      data-state={context.isEditing.value ? 'edit' : 'preview'}
      data-disabled={dataAttr(isDisabled)}
    >
      <Slot />
    </button>
  );
});
