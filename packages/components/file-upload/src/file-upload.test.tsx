import { $, component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { Field } from '@leve-ui/field';
import { describe, expect, it } from 'vitest';
import { isFileTypeAccepted, validateFiles } from './file-upload-utils';
import { FileUpload, type FileUploadFile, formatFileSize } from './index';

const sampleFile: FileUploadFile = {
  id: 'file-1',
  name: 'report.pdf',
  size: 1536,
  type: 'application/pdf',
};

const secondFile: FileUploadFile = {
  id: 'file-2',
  name: 'avatar.png',
  size: 2048,
  type: 'image/png',
};

describe('FileUpload', () => {
  it('renders all parts with expected elements, data attributes, and label-input association', async () => {
    const { screen, render } = await createDOM();
    await render(
      <FileUpload.Root defaultFiles={[sampleFile]}>
        <FileUpload.Label>Upload file</FileUpload.Label>
        <FileUpload.Dropzone>
          <FileUpload.Trigger>Choose file</FileUpload.Trigger>
        </FileUpload.Dropzone>
        <FileUpload.HiddenInput name="attachment" />
        <FileUpload.ItemGroup>
          <FileUpload.Item file={sampleFile}>
            <FileUpload.ItemName />
            <FileUpload.ItemSize />
            <FileUpload.ItemDeleteTrigger>Remove</FileUpload.ItemDeleteTrigger>
          </FileUpload.Item>
        </FileUpload.ItemGroup>
      </FileUpload.Root>,
    );

    const root = screen.querySelector('[data-leve-file-upload]');
    const label = screen.querySelector('[data-leve-file-upload-label]');
    const dropzone = screen.querySelector('[data-leve-file-upload-dropzone]');
    const trigger = screen.querySelector('[data-leve-file-upload-trigger]');
    const input = screen.querySelector('[data-leve-file-upload-hidden-input]');
    const itemGroup = screen.querySelector('[data-leve-file-upload-item-group]');
    const item = screen.querySelector('[data-leve-file-upload-item]');
    const itemName = screen.querySelector('[data-leve-file-upload-item-name]');
    const itemSize = screen.querySelector('[data-leve-file-upload-item-size]');
    const deleteTrigger = screen.querySelector('[data-leve-file-upload-item-delete-trigger]');

    expect(root?.tagName).toBe('DIV');
    expect(label?.tagName).toBe('LABEL');
    expect(dropzone?.tagName).toBe('DIV');
    expect(dropzone?.getAttribute('data-state')).toBe('idle');
    expect(trigger?.tagName).toBe('BUTTON');
    expect(trigger?.getAttribute('type')).toBe('button');
    expect(input?.tagName).toBe('INPUT');
    expect(input?.getAttribute('type')).toBe('file');
    expect(input?.getAttribute('tabindex')).toBe('-1');
    expect(input?.getAttribute('aria-hidden')).toBe('true');
    expect(input?.getAttribute('name')).toBe('attachment');
    expect(label?.getAttribute('for')).toBe(input?.getAttribute('id'));
    expect(itemGroup?.tagName).toBe('UL');
    expect(item?.tagName).toBe('LI');
    expect(itemName?.tagName).toBe('SPAN');
    expect(itemName?.textContent).toBe('report.pdf');
    expect(itemSize?.tagName).toBe('SPAN');
    expect(itemSize?.textContent).toBe('1.5 KB');
    expect(deleteTrigger?.tagName).toBe('BUTTON');
    expect(deleteTrigger?.getAttribute('type')).toBe('button');
    expect(deleteTrigger?.getAttribute('aria-label')).toBe('Remove report.pdf');
  });

  it('removes an item when ItemDeleteTrigger is clicked and calls onFilesChange$', async () => {
    const Demo = component$(() => {
      const files = useSignal<FileUploadFile[]>([sampleFile, secondFile]);
      const changeCount = useSignal(0);

      return (
        <div>
          <FileUpload.Root
            bind:files={files}
            multiple
            onFilesChange$={$(() => {
              changeCount.value += 1;
            })}
          >
            <FileUpload.HiddenInput />
            <FileUpload.ItemGroup>
              {files.value.map((file) => (
                <FileUpload.Item key={file.id} file={file}>
                  <FileUpload.ItemName />
                  <FileUpload.ItemDeleteTrigger>Delete</FileUpload.ItemDeleteTrigger>
                </FileUpload.Item>
              ))}
            </FileUpload.ItemGroup>
          </FileUpload.Root>
          <output data-change-count>{String(changeCount.value)}</output>
        </div>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Demo />);

    expect(Array.from(screen.querySelectorAll('[data-leve-file-upload-item]'))).toHaveLength(2);

    const firstDelete = screen.querySelector('[data-leve-file-upload-item-delete-trigger]');
    expect(firstDelete).not.toBeNull();
    await userEvent(firstDelete as Element, 'click');

    const remainingItems = Array.from(screen.querySelectorAll('[data-leve-file-upload-item]'));
    expect(remainingItems).toHaveLength(1);
    expect(screen.querySelector('[data-leve-file-upload-item-name]')?.textContent).toBe(
      'avatar.png',
    );
    expect(screen.querySelector('[data-change-count]')?.textContent).toBe('1');
  });

  it('propagates disabled, readOnly, invalid, required, accept, and multiple attributes', async () => {
    const { screen, render } = await createDOM();
    await render(
      <FileUpload.Root
        defaultFiles={[sampleFile]}
        accept="image/*,.pdf"
        maxFiles={3}
        disabled
        readOnly
        invalid
        required
      >
        <FileUpload.Label>Docs</FileUpload.Label>
        <FileUpload.Dropzone>Drop here</FileUpload.Dropzone>
        <FileUpload.Trigger>Browse</FileUpload.Trigger>
        <FileUpload.HiddenInput />
        <FileUpload.ItemGroup>
          <FileUpload.Item file={sampleFile}>
            <FileUpload.ItemDeleteTrigger>Remove</FileUpload.ItemDeleteTrigger>
          </FileUpload.Item>
        </FileUpload.ItemGroup>
      </FileUpload.Root>,
    );

    const root = screen.querySelector('[data-leve-file-upload]');
    const dropzone = screen.querySelector('[data-leve-file-upload-dropzone]');
    const trigger = screen.querySelector('[data-leve-file-upload-trigger]');
    const input = screen.querySelector('[data-leve-file-upload-hidden-input]');
    const deleteTrigger = screen.querySelector('[data-leve-file-upload-item-delete-trigger]');

    expect(root?.hasAttribute('data-disabled')).toBe(true);
    expect(root?.hasAttribute('data-readonly')).toBe(true);
    expect(root?.hasAttribute('data-invalid')).toBe(true);
    expect(dropzone?.hasAttribute('data-disabled')).toBe(true);
    expect(trigger?.hasAttribute('disabled')).toBe(true);
    expect(trigger?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.hasAttribute('disabled')).toBe(true);
    expect(input?.hasAttribute('required')).toBe(true);
    expect(input?.hasAttribute('multiple')).toBe(true);
    expect(input?.getAttribute('accept')).toBe('image/*,.pdf');
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(deleteTrigger?.hasAttribute('disabled')).toBe(true);
  });

  it('integrates with Field.Root for id, describedby, invalid, disabled, and required', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Field.Root hasDescription invalid required disabled>
        <Field.Label>Resume</Field.Label>
        <FileUpload.Root>
          <FileUpload.Trigger>Select resume</FileUpload.Trigger>
          <FileUpload.HiddenInput />
        </FileUpload.Root>
        <Field.Description>PDF up to 5 MB</Field.Description>
        <Field.ErrorMessage>Resume is required</Field.ErrorMessage>
      </Field.Root>,
    );

    const fieldLabel = screen.querySelector('[data-leve-field-label]');
    const description = screen.querySelector('[data-leve-field-description]');
    const errorMessage = screen.querySelector('[data-leve-field-error-message]');
    const trigger = screen.querySelector('[data-leve-file-upload-trigger]');
    const input = screen.querySelector('[data-leve-file-upload-hidden-input]');

    expect(fieldLabel?.getAttribute('for')).toBe(input?.getAttribute('id'));
    const describedBy = input?.getAttribute('aria-describedby') ?? '';
    expect(describedBy).toContain(description?.getAttribute('id') ?? '');
    expect(describedBy).toContain(errorMessage?.getAttribute('id') ?? '');
    expect(trigger?.getAttribute('aria-describedby')).toBe(describedBy);
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.hasAttribute('disabled')).toBe(true);
    expect(input?.hasAttribute('required')).toBe(true);
  });

  it('passes arbitrary props while preserving library data attributes and custom ids', async () => {
    const { screen, render } = await createDOM();
    await render(
      <FileUpload.Root
        class="custom-root"
        ids={{ input: 'custom-input', label: 'custom-label', trigger: 'custom-trigger' }}
      >
        <FileUpload.Label class="custom-label">Label</FileUpload.Label>
        <FileUpload.Trigger aria-label="Custom browse">Browse</FileUpload.Trigger>
        <FileUpload.HiddenInput name="files" />
      </FileUpload.Root>,
    );

    const root = screen.querySelector('[data-leve-file-upload]');
    const label = screen.querySelector('[data-leve-file-upload-label]');
    const trigger = screen.querySelector('[data-leve-file-upload-trigger]');
    const input = screen.querySelector('[data-leve-file-upload-hidden-input]');

    expect(root?.getAttribute('class')).toBe('custom-root');
    expect(label?.getAttribute('id')).toBe('custom-label');
    expect(label?.getAttribute('for')).toBe('custom-input');
    expect(input?.getAttribute('id')).toBe('custom-input');
    expect(trigger?.getAttribute('id')).toBe('custom-trigger');
    expect(trigger?.getAttribute('aria-label')).toBe('Custom browse');
  });

  it('formats byte sizes with formatFileSize', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(-10)).toBe('0 B');
    expect(formatFileSize(Number.NaN)).toBe('0 B');
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(2 * 1024 * 1024)).toBe('2 MB');
  });

  it('validates file types, sizes, and maxFiles', () => {
    const pngFile = new File(['abc'], 'photo.png', { type: 'image/png' });
    const txtFile = new File(['hello world'], 'notes.txt', { type: 'text/plain' });
    const bigFile = new File([new Uint8Array(2048)], 'big.png', { type: 'image/png' });

    expect(isFileTypeAccepted(pngFile, 'image/*')).toBe(true);
    expect(isFileTypeAccepted(pngFile, '.png')).toBe(true);
    expect(isFileTypeAccepted(txtFile, 'image/*,.pdf')).toBe(false);

    const result = validateFiles({
      currentFiles: [sampleFile],
      incomingFiles: [pngFile, txtFile, bigFile],
      accept: 'image/*',
      isMultiple: true,
      maxFiles: 2,
      minFileSize: 2,
      maxFileSize: 1024,
    });

    expect(result.accepted.map((item) => item.name)).toEqual(['photo.png']);
    expect(result.nextFiles).toHaveLength(2);
    expect(result.rejected).toHaveLength(2);
    expect(result.rejected[0]?.errors).toContain('FILE_INVALID_TYPE');
    expect(result.rejected[0]?.errors).toContain('TOO_MANY_FILES');
    expect(result.rejected[1]?.errors).toContain('FILE_TOO_LARGE');
    expect(result.rejected[1]?.errors).toContain('TOO_MANY_FILES');
  });
});
