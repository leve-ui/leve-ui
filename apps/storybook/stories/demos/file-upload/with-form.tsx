import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { FileUpload, type FileUploadFile } from '@leve-ui/file-upload';
import { LuFile, LuTrash2, LuUpload } from '@qwikest/icons/lucide';
import styles from './with-form.css?inline';

export default component$(() => {
  useStyles$(styles);
  const files = useSignal<FileUploadFile[]>([]);
  const submittedData = useSignal('');

  const handleSubmit$ = $((_event: unknown, form: HTMLFormElement) => {
    const formData = new FormData(form);
    const uploaded = formData
      .getAll('documents')
      .filter((entry): entry is File => entry instanceof File && entry.name !== '')
      .map((entry) => entry.name);
    submittedData.value = JSON.stringify({ documents: uploaded });
  });

  const handleReset$ = $(() => {
    files.value = [];
  });

  return (
    <div class="file-upload-with-form-wrapper">
      <form
        class="file-upload-with-form-form"
        preventdefault:submit
        onSubmit$={handleSubmit$}
        onReset$={handleReset$}
      >
        <FileUpload.Root bind:files={files} multiple class="file-upload-with-form-root">
          <FileUpload.Label class="file-upload-with-form-label">Documents</FileUpload.Label>
          <FileUpload.Dropzone class="file-upload-with-form-dropzone">
            <LuUpload class="file-upload-with-form-upload-icon" aria-hidden="true" />
            <p class="file-upload-with-form-text">Drop files or click to select</p>
            <FileUpload.Trigger class="file-upload-with-form-trigger">
              Choose files
            </FileUpload.Trigger>
          </FileUpload.Dropzone>
          <FileUpload.HiddenInput name="documents" />
          {files.value.length > 0 && (
            <FileUpload.ItemGroup class="file-upload-with-form-list">
              {files.value.map((file) => (
                <FileUpload.Item key={file.id} file={file} class="file-upload-with-form-item">
                  <LuFile class="file-upload-with-form-file-icon" aria-hidden="true" />
                  <div class="file-upload-with-form-item-meta">
                    <FileUpload.ItemName class="file-upload-with-form-item-name" />
                    <FileUpload.ItemSize class="file-upload-with-form-item-size" />
                  </div>
                  <FileUpload.ItemDeleteTrigger class="file-upload-with-form-delete">
                    <LuTrash2 class="file-upload-with-form-delete-icon" aria-hidden="true" />
                  </FileUpload.ItemDeleteTrigger>
                </FileUpload.Item>
              ))}
            </FileUpload.ItemGroup>
          )}
        </FileUpload.Root>
        <div class="file-upload-with-form-actions">
          <button type="submit" class="file-upload-with-form-submit">
            Submit
          </button>
          <button type="reset" class="file-upload-with-form-reset">
            Reset
          </button>
        </div>
      </form>
      <output class="file-upload-with-form-output">{submittedData.value}</output>
    </div>
  );
});
