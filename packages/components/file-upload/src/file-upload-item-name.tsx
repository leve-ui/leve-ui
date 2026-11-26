import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { fileUploadItemContextId } from './file-upload-context';

export type FileUploadItemNameProps = PropsOf<'span'>;

/**
 * Displays the file name of the enclosing `FileUpload.Item`.
 */
export const FileUploadItemName = component$<FileUploadItemNameProps>((props) => {
  const itemContext = useContext(fileUploadItemContextId);

  return (
    <span {...props} data-leve-file-upload-item-name="">
      {itemContext.file.value.name}
      <Slot />
    </span>
  );
});
