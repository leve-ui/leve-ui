import { component$, useStyles$ } from '@builder.io/qwik';
import { FileUpload } from '@leve-ui/file-upload';
import { LuUpload } from '@qwikest/icons/lucide';
import styles from './disabled.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <FileUpload.Root disabled class="file-upload-disabled">
      <FileUpload.Label class="file-upload-disabled-label">Attachment</FileUpload.Label>
      <FileUpload.Dropzone class="file-upload-disabled-dropzone">
        <LuUpload class="file-upload-disabled-upload-icon" aria-hidden="true" />
        <p class="file-upload-disabled-text">File upload is disabled</p>
        <FileUpload.Trigger class="file-upload-disabled-trigger">Choose file</FileUpload.Trigger>
      </FileUpload.Dropzone>
      <FileUpload.HiddenInput />
    </FileUpload.Root>
  );
});
