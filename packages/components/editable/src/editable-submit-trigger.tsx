import { $, component$, type PropsOf, Slot, sync$, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { editableContextId } from './editable-context';

export type EditableSubmitTriggerProps = PropsOf<'button'>;

/**
 * Button that commits the draft value, exits edit mode, and restores focus.
 */
export const EditableSubmitTrigger = component$<EditableSubmitTriggerProps>((props) => {
  const context = useContext(editableContextId);
  const isDisabled = context.disabled.value || context.readOnly.value;

  const preventBlurSync$ = sync$((event: MouseEvent) => {
    event.preventDefault();
  });

  const handleClick$ = $(async () => {
    if (isDisabled) return;
    await context.commit$(true);
  });

  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      hidden={!context.isEditing.value}
      disabled={isDisabled}
      onMouseDown$={[preventBlurSync$, props.onMouseDown$]}
      onClick$={[handleClick$, props.onClick$]}
      data-leve-editable-submit-trigger=""
      data-state={context.isEditing.value ? 'edit' : 'preview'}
      data-disabled={dataAttr(isDisabled)}
    >
      <Slot />
    </button>
  );
});
