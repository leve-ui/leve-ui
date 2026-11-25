import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { FileUpload, type FileUploadFile } from '@leve-ui/file-upload';
import { LuFile, LuTrash2, LuUpload } from '@qwikest/icons/lucide';
import styles from './multiple.css?inline';

export default component$(() => {
  useStyles$(styles);
  const files = useSignal<FileUploadFile[]>([]);

  return (
    <FileUpload.Root bind:files={files} multiple class="file-upload-multiple">
      <FileUpload.Label class="file-upload-multiple-label">Project documents</FileUpload.Label>
      <FileUpload.Dropzone class="file-upload-multiple-dropzone">
        <LuUpload class="file-upload-multiple-upload-icon" aria-hidden="true" />
        <p class="file-upload-multiple-text">Drag and drop multiple files here</p>
        <FileUpload.Trigger class="file-upload-multiple-trigger">Choose files</FileUpload.Trigger>
      </FileUpload.Dropzone>
      <FileUpload.HiddenInput />
      {files.value.length > 0 && (
        <FileUpload.ItemGroup class="file-upload-multiple-list">
          {files.value.map((file) => (
            <FileUpload.Item key={file.id} file={file} class="file-upload-multiple-item">
              <LuFile class="file-upload-multiple-file-icon" aria-hidden="true" />
              <div class="file-upload-multiple-item-meta">
                <FileUpload.ItemName class="file-upload-multiple-item-name" />
                <FileUpload.ItemSize class="file-upload-multiple-item-size" />
              </div>
              <FileUpload.ItemDeleteTrigger class="file-upload-multiple-delete">
                <LuTrash2 class="file-upload-multiple-delete-icon" aria-hidden="true" />
              </FileUpload.ItemDeleteTrigger>
            </FileUpload.Item>
          ))}
        </FileUpload.ItemGroup>
      )}
    </FileUpload.Root>
  );
});
