import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Field } from '@leve-ui/field';
import { FileUpload, type FileUploadFile } from '@leve-ui/file-upload';
import { LuFile, LuTrash2, LuUpload } from '@qwikest/icons/lucide';
import styles from './with-field.css?inline';

export default component$(() => {
  useStyles$(styles);
  const files = useSignal<FileUploadFile[]>([]);

  return (
    <Field.Root hasDescription required class="file-upload-with-field-field">
      <Field.Label class="file-upload-with-field-label">Resume</Field.Label>
      <FileUpload.Root bind:files={files} accept=".pdf" class="file-upload-with-field-root">
        <FileUpload.Dropzone class="file-upload-with-field-dropzone">
          <LuUpload class="file-upload-with-field-upload-icon" aria-hidden="true" />
          <p class="file-upload-with-field-text">Drop your PDF resume here</p>
          <FileUpload.Trigger class="file-upload-with-field-trigger">
            Browse files
          </FileUpload.Trigger>
        </FileUpload.Dropzone>
        <FileUpload.HiddenInput />
        {files.value.length > 0 && (
          <FileUpload.ItemGroup class="file-upload-with-field-list">
            {files.value.map((file) => (
              <FileUpload.Item key={file.id} file={file} class="file-upload-with-field-item">
                <LuFile class="file-upload-with-field-file-icon" aria-hidden="true" />
                <div class="file-upload-with-field-item-meta">
                  <FileUpload.ItemName class="file-upload-with-field-item-name" />
                  <FileUpload.ItemSize class="file-upload-with-field-item-size" />
                </div>
                <FileUpload.ItemDeleteTrigger class="file-upload-with-field-delete">
                  <LuTrash2 class="file-upload-with-field-delete-icon" aria-hidden="true" />
                </FileUpload.ItemDeleteTrigger>
              </FileUpload.Item>
            ))}
          </FileUpload.ItemGroup>
        )}
      </FileUpload.Root>
      <Field.Description class="file-upload-with-field-description">
        Accepted format: PDF.
      </Field.Description>
    </Field.Root>
  );
});
