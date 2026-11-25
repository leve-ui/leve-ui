import {
  createContextId,
  type NoSerialize,
  type QRL,
  type ReadonlySignal,
  type Signal,
} from '@builder.io/qwik';

/**
 * Serializable representation of a file managed by `FileUpload`.
 *
 * Raw DOM `File` objects cannot be serialized by Qwik 1.x, so the native `File`
 * is wrapped with `noSerialize()` in the browser.
 */
export interface FileUploadFile {
  /** Unique identifier for this file entry. */
  id: string;
  /** File name. */
  name: string;
  /** File size in bytes. */
  size: number;
  /** MIME type of the file. */
  type: string;
  /** Non-serialized native DOM `File` reference (browser only). */
  file?: NoSerialize<File>;
}

/**
 * Reason why a file was rejected during validation.
 */
export type FileRejectionReason =
  | 'FILE_INVALID_TYPE'
  | 'FILE_TOO_LARGE'
  | 'FILE_TOO_SMALL'
  | 'TOO_MANY_FILES';

/**
 * Details for a rejected file and the validation errors it triggered.
 */
export interface FileRejection {
  /** Serializable metadata of the rejected file. */
  file: FileUploadFile;
  /** Validation error codes for this file. */
  errors: FileRejectionReason[];
}

/**
 * Element IDs for the `FileUpload` parts.
 */
export interface FileUploadIds {
  /** ID of the hidden `<input type="file">` element. */
  input: string;
  /** ID of the `<label>` element. */
  label: string;
  /** ID of the dropzone element. */
  dropzone: string;
  /** ID of the trigger button element. */
  trigger: string;
}

/**
 * Shared context for `FileUpload` parts.
 */
export interface FileUploadContext {
  ids: FileUploadIds;
  files: ReadonlySignal<FileUploadFile[]>;
  inputRef: Signal<HTMLInputElement | undefined>;
  accept: ReadonlySignal<string | undefined>;
  isMultiple: ReadonlySignal<boolean>;
  maxFiles: ReadonlySignal<number>;
  maxFileSize: ReadonlySignal<number | undefined>;
  minFileSize: ReadonlySignal<number | undefined>;
  disabled: ReadonlySignal<boolean>;
  readOnly: ReadonlySignal<boolean>;
  required: ReadonlySignal<boolean>;
  invalid: ReadonlySignal<boolean>;
  describedBy: ReadonlySignal<string | undefined>;
  addFiles$: QRL<(incoming: File[]) => Promise<void>>;
  removeFile$: QRL<(id: string) => Promise<void>>;
  reset$: QRL<() => Promise<void>>;
  openFilePicker$: QRL<() => void>;
}

export const fileUploadContextId = createContextId<FileUploadContext>('leve-ui.file-upload');

/**
 * Context for an individual `FileUpload.Item`.
 */
export interface FileUploadItemContext {
  file: ReadonlySignal<FileUploadFile>;
}

export const fileUploadItemContextId = createContextId<FileUploadItemContext>(
  'leve-ui.file-upload.item',
);
