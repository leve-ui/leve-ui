import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { fileUploadContextId } from './file-upload-context';

export type FileUploadLabelProps = PropsOf<'label'>;

/**
 * Label element for the File Upload hidden input.
 */
export const FileUploadLabel = component$<FileUploadLabelProps>((props) => {
  const context = useContext(fileUploadContextId);

  return (
    <label
      {...props}
      id={context.ids.label}
      for={context.ids.input}
      data-leve-file-upload-label=""
      data-disabled={dataAttr(context.disabled.value)}
      data-readonly={dataAttr(context.readOnly.value)}
      data-invalid={dataAttr(context.invalid.value)}
    >
      <Slot />
    </label>
  );
});
