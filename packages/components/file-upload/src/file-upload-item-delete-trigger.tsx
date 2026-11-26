import { $, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { fileUploadContextId, fileUploadItemContextId } from './file-upload-context';

export type FileUploadItemDeleteTriggerProps = PropsOf<'button'>;

/**
 * Button that removes the enclosing `FileUpload.Item` from the file list.
 */
export const FileUploadItemDeleteTrigger = component$<FileUploadItemDeleteTriggerProps>((props) => {
  const context = useContext(fileUploadContextId);
  const itemContext = useContext(fileUploadItemContextId);
  const isDisabled = context.disabled.value || context.readOnly.value || Boolean(props.disabled);

  const handleClick$ = $(async () => {
    if (isDisabled) {
      return;
    }
    await context.removeFile$(itemContext.file.value.id);
  });

  return (
    <button
      {...props}
      type="button"
      disabled={isDisabled}
      aria-label={props['aria-label'] ?? `Remove ${itemContext.file.value.name}`}
      data-leve-file-upload-item-delete-trigger=""
      data-disabled={dataAttr(isDisabled)}
      onClick$={[handleClick$, props.onClick$]}
    >
      <Slot />
    </button>
  );
});
