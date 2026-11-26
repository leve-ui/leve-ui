import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { fileUploadItemContextId } from './file-upload-context';
import { formatFileSize } from './file-upload-utils';

export type FileUploadItemSizeProps = PropsOf<'span'>;

/**
 * Displays the formatted file size of the enclosing `FileUpload.Item`.
 */
export const FileUploadItemSize = component$<FileUploadItemSizeProps>((props) => {
  const itemContext = useContext(fileUploadItemContextId);

  return (
    <span {...props} data-leve-file-upload-item-size="">
      {formatFileSize(itemContext.file.value.size)}
      <Slot />
    </span>
  );
});
