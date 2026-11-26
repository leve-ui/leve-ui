import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { type FileRejection, FileUpload, type FileUploadFile } from '@leve-ui/file-upload';
import { LuFile, LuTrash2, LuUpload } from '@qwikest/icons/lucide';
import styles from './validation.css?inline';

export default component$(() => {
  useStyles$(styles);
  const files = useSignal<FileUploadFile[]>([]);
  const rejections = useSignal<FileRejection[]>([]);

  const handleReject$ = $((rejected: FileRejection[]) => {
    rejections.value = rejected;
  });

  const handleFilesChange$ = $((nextFiles: FileUploadFile[]) => {
    if (nextFiles.length > files.value.length) {
      rejections.value = [];
    }
  });

  return (
    <FileUpload.Root
      bind:files={files}
      accept="image/*"
      maxFiles={2}
      maxFileSize={1024 * 1024}
      invalid={rejections.value.length > 0}
      onFilesChange$={handleFilesChange$}
      onFileReject$={handleReject$}
      class="file-upload-validation"
    >
      <FileUpload.Label class="file-upload-validation-label">
        Images (max 2 files, 1 MB each)
      </FileUpload.Label>
      <FileUpload.Dropzone class="file-upload-validation-dropzone">
        <LuUpload class="file-upload-validation-upload-icon" aria-hidden="true" />
        <p class="file-upload-validation-text">Drop up to 2 image files (max 1 MB)</p>
        <FileUpload.Trigger class="file-upload-validation-trigger">
          Select images
        </FileUpload.Trigger>
      </FileUpload.Dropzone>
      <FileUpload.HiddenInput />
      {files.value.length > 0 && (
        <FileUpload.ItemGroup class="file-upload-validation-list">
          {files.value.map((file) => (
            <FileUpload.Item key={file.id} file={file} class="file-upload-validation-item">
              <LuFile class="file-upload-validation-file-icon" aria-hidden="true" />
              <div class="file-upload-validation-item-meta">
                <FileUpload.ItemName class="file-upload-validation-item-name" />
                <FileUpload.ItemSize class="file-upload-validation-item-size" />
              </div>
              <FileUpload.ItemDeleteTrigger class="file-upload-validation-delete">
                <LuTrash2 class="file-upload-validation-delete-icon" aria-hidden="true" />
              </FileUpload.ItemDeleteTrigger>
            </FileUpload.Item>
          ))}
        </FileUpload.ItemGroup>
      )}
      {rejections.value.length > 0 && (
        <ul class="file-upload-validation-errors" aria-label="Rejected files">
          {rejections.value.map((rejection) => (
            <li key={rejection.file.id} class="file-upload-validation-error-item">
              {rejection.file.name}: {rejection.errors.join(', ')}
            </li>
          ))}
        </ul>
      )}
    </FileUpload.Root>
  );
});
