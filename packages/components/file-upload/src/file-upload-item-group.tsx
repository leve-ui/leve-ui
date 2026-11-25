import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { fileUploadContextId } from './file-upload-context';

export type FileUploadItemGroupProps = PropsOf<'ul'>;

/**
 * List container (`<ul>`) for uploaded file items.
 */
export const FileUploadItemGroup = component$<FileUploadItemGroupProps>((props) => {
  const context = useContext(fileUploadContextId);

  return (
    <ul
      {...props}
      data-leve-file-upload-item-group=""
      data-disabled={dataAttr(context.disabled.value)}
      data-readonly={dataAttr(context.readOnly.value)}
      data-invalid={dataAttr(context.invalid.value)}
    >
      <Slot />
    </ul>
  );
});
