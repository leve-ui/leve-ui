import {
  component$,
  type PropsOf,
  Slot,
  useComputed$,
  useContext,
  useContextProvider,
} from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import {
  type FileUploadFile,
  fileUploadContextId,
  fileUploadItemContextId,
} from './file-upload-context';

export type FileUploadItemProps = PropsOf<'li'> & {
  /** The file entry represented by this item. */
  file: FileUploadFile;
};

/**
 * Individual file item (`<li>`) inside `FileUpload.ItemGroup`.
 */
export const FileUploadItem = component$<FileUploadItemProps>((props) => {
  const { file: _file, ...restProps } = props;
  const context = useContext(fileUploadContextId);
  const file = useComputed$(() => props.file);

  useContextProvider(fileUploadItemContextId, { file });

  return (
    <li
      {...restProps}
      data-leve-file-upload-item=""
      data-disabled={dataAttr(context.disabled.value)}
      data-readonly={dataAttr(context.readOnly.value)}
      data-invalid={dataAttr(context.invalid.value)}
    >
      <Slot />
    </li>
  );
});
