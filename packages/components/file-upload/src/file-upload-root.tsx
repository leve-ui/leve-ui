import {
  $,
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useComputed$,
  useContextProvider,
  useId,
  useSignal,
} from '@builder.io/qwik';
import {
  announce,
  dataAttr,
  useControllableState,
  useFieldContext,
  useFieldControl,
} from '@leve-ui/utils';
import {
  type FileRejection,
  type FileUploadFile,
  type FileUploadIds,
  fileUploadContextId,
} from './file-upload-context';
import { syncInputFiles, validateFiles } from './file-upload-utils';

export type FileUploadRootProps = PropsOf<'div'> & {
  /** Overrides the element IDs of the parts. Inside a Field, `input` and `label` IDs are inherited from the Field. */
  ids?: Partial<FileUploadIds>;
  /**
   * The initial list of files (uncontrolled).
   * @default []
   */
  defaultFiles?: FileUploadFile[];
  /** A signal holding the list of accepted files (controlled). */
  'bind:files'?: Signal<FileUploadFile[]>;
  /** Called when the accepted file list changes. */
  onFilesChange$?: QRL<(files: FileUploadFile[]) => void>;
  /** Called when one or more files fail validation. */
  onFileReject$?: QRL<(rejections: FileRejection[]) => void>;
  /** Comma-separated list of accepted file types (MIME types, wildcards like `image/*`, or extensions like `.png`). */
  accept?: string;
  /**
   * Whether multiple files can be selected at once.
   * @default false
   */
  multiple?: boolean;
  /**
   * Maximum number of accepted files. Defaults to `1` unless `multiple` is `true`.
   * Setting `maxFiles` greater than `1` also enables `multiple` on the underlying `<input>`.
   */
  maxFiles?: number;
  /** Maximum allowed file size in bytes. */
  maxFileSize?: number;
  /** Minimum allowed file size in bytes. */
  minFileSize?: number;
  /**
   * Disables the file upload control. Inside a Field or Fieldset, the inherited `disabled` also applies.
   * @default false
   */
  disabled?: boolean;
  /**
   * Marks the file upload control as read-only. Inside a Field, the inherited `readOnly` also applies.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Marks the file upload control as required. Inside a Field, the Field's `required` also applies.
   * @default false
   */
  required?: boolean;
  /**
   * Marks the file upload control as invalid. Inside a Field, the Field's `invalid` also applies.
   * @default false
   */
  invalid?: boolean;
};

/**
 * Root container for the File Upload component.
 *
 * Uses native HTML `<input type="file">`, `<label>`, and `<button type="button">` semantics
 * for accessible file selection, drag-and-drop, validation, and form integration.
 */
export const FileUploadRoot = component$<FileUploadRootProps>((props) => {
  const {
    ids: propIds,
    defaultFiles = [],
    'bind:files': bindFiles,
    onFilesChange$,
    onFileReject$,
    accept: _accept,
    multiple: _multiple,
    maxFiles: _maxFiles,
    maxFileSize: _maxFileSize,
    minFileSize: _minFileSize,
    disabled: _disabled,
    readOnly: _readOnly,
    required: _required,
    invalid: _invalid,
    ...restProps
  } = props;

  const [files, setFiles$, resetFiles$] = useControllableState<FileUploadFile[]>({
    value: bindFiles,
    defaultValue: defaultFiles,
    onChange$: onFilesChange$,
  });

  const field = useFieldContext();
  const controlState = useFieldControl({
    id: propIds?.input,
    disabled: props.disabled,
    readOnly: props.readOnly,
    required: props.required,
    invalid: props.invalid,
    'aria-describedby': props['aria-describedby'],
  });

  const base = useId();
  const ids: FileUploadIds = {
    input: controlState.value.id,
    label: field ? field.ids.label : (propIds?.label ?? `${base}-label`),
    dropzone: propIds?.dropzone ?? `${base}-dropzone`,
    trigger: propIds?.trigger ?? `${base}-trigger`,
  };

  const inputRef = useSignal<HTMLInputElement>();

  const accept = useComputed$(() => props.accept);
  const isMultiple = useComputed$(
    () => Boolean(props.multiple) || (props.maxFiles !== undefined && props.maxFiles > 1),
  );
  const maxFiles = useComputed$(() => {
    if (props.maxFiles !== undefined) {
      return props.maxFiles;
    }
    return props.multiple ? Number.POSITIVE_INFINITY : 1;
  });
  const maxFileSize = useComputed$(() => props.maxFileSize);
  const minFileSize = useComputed$(() => props.minFileSize);
  const disabled = useComputed$(() => controlState.value.disabled);
  const readOnly = useComputed$(() => controlState.value.readOnly);
  const required = useComputed$(() => controlState.value.required);
  const invalid = useComputed$(() => controlState.value.invalid);
  const describedBy = useComputed$(() => controlState.value.describedBy);

  const addFiles$ = $(async (incoming: File[]) => {
    if (disabled.value || readOnly.value || incoming.length === 0) {
      return;
    }

    const result = validateFiles({
      currentFiles: files.value,
      incomingFiles: incoming,
      accept: accept.value,
      isMultiple: isMultiple.value,
      maxFiles: maxFiles.value,
      minFileSize: minFileSize.value,
      maxFileSize: maxFileSize.value,
    });

    if (result.accepted.length > 0) {
      await setFiles$(result.nextFiles);
      syncInputFiles(inputRef.value, result.nextFiles);

      if (result.accepted.length === 1) {
        announce(`Added ${result.accepted[0].name}`);
      } else {
        announce(`Added ${result.accepted.length} files`);
      }
    } else {
      syncInputFiles(inputRef.value, files.value);
    }

    if (result.rejected.length > 0) {
      await onFileReject$?.(result.rejected);
      if (result.rejected.length === 1) {
        announce(`Rejected ${result.rejected[0].file.name}`);
      } else {
        announce(`Rejected ${result.rejected.length} files`);
      }
    }
  });

  const removeFile$ = $(async (id: string) => {
    if (disabled.value || readOnly.value) {
      return;
    }

    const target = files.value.find((item) => item.id === id);
    if (!target) {
      return;
    }

    const nextFiles = files.value.filter((item) => item.id !== id);
    await setFiles$(nextFiles);
    syncInputFiles(inputRef.value, nextFiles);
    announce(`Removed ${target.name}`);
  });

  const reset$ = $(async () => {
    await resetFiles$();
    syncInputFiles(inputRef.value, files.value);
  });

  const openFilePicker$ = $(() => {
    if (disabled.value || readOnly.value) {
      return;
    }
    inputRef.value?.click();
  });

  useContextProvider(fileUploadContextId, {
    ids,
    files,
    inputRef,
    accept,
    isMultiple,
    maxFiles,
    maxFileSize,
    minFileSize,
    disabled,
    readOnly,
    required,
    invalid,
    describedBy,
    addFiles$,
    removeFile$,
    reset$,
    openFilePicker$,
  });

  return (
    <div
      {...restProps}
      data-leve-file-upload=""
      data-disabled={dataAttr(disabled.value)}
      data-readonly={dataAttr(readOnly.value)}
      data-invalid={dataAttr(invalid.value)}
    >
      <Slot />
    </div>
  );
});
