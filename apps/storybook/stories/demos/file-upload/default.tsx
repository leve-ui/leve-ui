import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { FileUpload, type FileUploadFile } from '@leve-ui/file-upload';
import { LuFile, LuTrash2, LuUpload } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);
  const files = useSignal<FileUploadFile[]>([]);

  return (
    <FileUpload.Root bind:files={files} class="file-upload-default">
      <FileUpload.Label class="file-upload-default-label">Attachment</FileUpload.Label>
      <FileUpload.Dropzone class="file-upload-default-dropzone">
        <LuUpload class="file-upload-default-upload-icon" aria-hidden="true" />
        <p class="file-upload-default-text">Drag and drop a file here, or</p>
        <FileUpload.Trigger class="file-upload-default-trigger">Choose file</FileUpload.Trigger>
      </FileUpload.Dropzone>
      <FileUpload.HiddenInput />
      {files.value.length > 0 && (
        <FileUpload.ItemGroup class="file-upload-default-list">
          {files.value.map((file) => (
            <FileUpload.Item key={file.id} file={file} class="file-upload-default-item">
              <LuFile class="file-upload-default-file-icon" aria-hidden="true" />
              <div class="file-upload-default-item-meta">
                <FileUpload.ItemName class="file-upload-default-item-name" />
                <FileUpload.ItemSize class="file-upload-default-item-size" />
              </div>
              <FileUpload.ItemDeleteTrigger class="file-upload-default-delete">
                <LuTrash2 class="file-upload-default-delete-icon" aria-hidden="true" />
              </FileUpload.ItemDeleteTrigger>
            </FileUpload.Item>
          ))}
        </FileUpload.ItemGroup>
      )}
    </FileUpload.Root>
  );
});
