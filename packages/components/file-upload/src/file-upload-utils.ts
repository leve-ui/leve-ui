import { noSerialize } from '@builder.io/qwik';
import { isBrowser } from '@leve-ui/utils';
import type { FileRejection, FileRejectionReason, FileUploadFile } from './file-upload-context';

let fileIdCounter = 0;

/**
 * Formats a byte count into a human-readable string (e.g., `"0 B"`, `"1.5 KB"`, `"2 MB"`).
 */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), units.length - 1);
  if (index === 0) {
    return `${Math.round(bytes)} B`;
  }
  const value = bytes / k ** index;
  return `${Number(value.toFixed(1))} ${units[index]}`;
}

/**
 * Checks whether a native `File` matches an HTML `accept` attribute string.
 */
export function isFileTypeAccepted(file: File, accept?: string): boolean {
  if (!accept || accept.trim() === '') {
    return true;
  }

  const tokens = accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);

  if (tokens.length === 0) {
    return true;
  }

  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();

  for (const token of tokens) {
    if (token === '*/*') {
      return true;
    }
    if (token.startsWith('.')) {
      if (fileName.endsWith(token)) {
        return true;
      }
      continue;
    }
    if (token.endsWith('/*')) {
      const prefix = token.slice(0, -1);
      if (mimeType.startsWith(prefix)) {
        return true;
      }
      continue;
    }
    if (mimeType === token) {
      return true;
    }
  }

  return false;
}

/**
 * Converts a native DOM `File` into a serializable `FileUploadFile`.
 */
export function toFileUploadFile(file: File): FileUploadFile {
  fileIdCounter += 1;
  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${fileIdCounter}`,
    name: file.name,
    size: file.size,
    type: file.type,
    file: noSerialize(file),
  };
}

export interface ValidateFilesOptions {
  currentFiles: FileUploadFile[];
  incomingFiles: File[];
  accept?: string;
  isMultiple: boolean;
  maxFiles: number;
  minFileSize?: number;
  maxFileSize?: number;
}

export interface ValidateFilesResult {
  nextFiles: FileUploadFile[];
  accepted: FileUploadFile[];
  rejected: FileRejection[];
}

/**
 * Validates incoming `File` objects against `accept`, size limits, and `maxFiles`.
 */
export function validateFiles(options: ValidateFilesOptions): ValidateFilesResult {
  const { currentFiles, incomingFiles, accept, isMultiple, maxFiles, minFileSize, maxFileSize } =
    options;

  const accepted: FileUploadFile[] = [];
  const rejected: FileRejection[] = [];

  for (const nativeFile of incomingFiles) {
    const errors: FileRejectionReason[] = [];

    if (!isFileTypeAccepted(nativeFile, accept)) {
      errors.push('FILE_INVALID_TYPE');
    }
    if (minFileSize !== undefined && nativeFile.size < minFileSize) {
      errors.push('FILE_TOO_SMALL');
    }
    if (maxFileSize !== undefined && nativeFile.size > maxFileSize) {
      errors.push('FILE_TOO_LARGE');
    }

    const totalCount = isMultiple ? currentFiles.length + accepted.length : accepted.length;
    if (totalCount >= maxFiles) {
      errors.push('TOO_MANY_FILES');
    }

    const entry = toFileUploadFile(nativeFile);
    if (errors.length > 0) {
      rejected.push({ file: entry, errors });
    } else {
      accepted.push(entry);
    }
  }

  const nextFiles = isMultiple
    ? [...currentFiles, ...accepted]
    : accepted.length > 0
      ? accepted
      : currentFiles;

  return { nextFiles, accepted, rejected };
}

/**
 * Synchronizes the native `<input type="file">.files` FileList using `DataTransfer`
 * so native form submission (`new FormData(form)`) includes the accepted files.
 */
export function syncInputFiles(input: HTMLInputElement | undefined, files: FileUploadFile[]): void {
  if (!isBrowser || !input || typeof DataTransfer === 'undefined') {
    return;
  }

  const dt = new DataTransfer();
  for (const item of files) {
    if (item.file) {
      dt.items.add(item.file);
    }
  }
  input.files = dt.files;
}
