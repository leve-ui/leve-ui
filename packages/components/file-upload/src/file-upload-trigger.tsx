import { $, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { fileUploadContextId } from './file-upload-context';

export type FileUploadTriggerProps = PropsOf<'button'>;

/**
 * Button that opens the native file picker dialog.
 */
export const FileUploadTrigger = component$<FileUploadTriggerProps>((props) => {
  const context = useContext(fileUploadContextId);
  const isDisabled = context.disabled.value || context.readOnly.value || Boolean(props.disabled);

  const handleClick$ = $(async () => {
    if (context.disabled.value || context.readOnly.value) {
      return;
    }
    await context.openFilePicker$();
  });

  return (
    <button
      {...props}
      type="button"
      id={context.ids.trigger}
      disabled={isDisabled}
      aria-describedby={context.describedBy.value}
      aria-invalid={context.invalid.value ? 'true' : undefined}
      data-leve-file-upload-trigger=""
      data-disabled={dataAttr(isDisabled)}
      data-readonly={dataAttr(context.readOnly.value)}
      data-invalid={dataAttr(context.invalid.value)}
      onClick$={[handleClick$, props.onClick$]}
    >
      <Slot />
    </button>
  );
});
