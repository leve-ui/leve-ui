import { $, component$, type PropsOf, Slot, sync$, useContext, useSignal } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { fileUploadContextId } from './file-upload-context';

export type FileUploadDropzoneProps = PropsOf<'div'> & {
  /**
   * Prevents clicking the dropzone from opening the file picker.
   * @default false
   */
  disableClick?: boolean;
};

const preventDragDefault$ = sync$((event: DragEvent) => {
  event.preventDefault();
});

/**
 * Drag-and-drop area for selecting files.
 */
export const FileUploadDropzone = component$<FileUploadDropzoneProps>((props) => {
  const { disableClick = false, ...restProps } = props;
  const context = useContext(fileUploadContextId);
  const isDragging = useSignal(false);
  const dragDepth = useSignal(0);

  const handleDragEnter$ = $(() => {
    if (context.disabled.value || context.readOnly.value) {
      return;
    }
    dragDepth.value += 1;
    isDragging.value = true;
  });

  const handleDragOver$ = $((event: DragEvent) => {
    if (context.disabled.value || context.readOnly.value) {
      return;
    }
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  });

  const handleDragLeave$ = $(() => {
    if (context.disabled.value || context.readOnly.value) {
      return;
    }
    dragDepth.value = Math.max(0, dragDepth.value - 1);
    if (dragDepth.value === 0) {
      isDragging.value = false;
    }
  });

  const handleDrop$ = $(async (event: DragEvent) => {
    dragDepth.value = 0;
    isDragging.value = false;

    if (context.disabled.value || context.readOnly.value) {
      return;
    }

    const droppedFiles = event.dataTransfer?.files ? Array.from(event.dataTransfer.files) : [];
    if (droppedFiles.length > 0) {
      await context.addFiles$(droppedFiles);
    }
  });

  const handleClick$ = $(async (event: MouseEvent) => {
    if (disableClick || context.disabled.value || context.readOnly.value) {
      return;
    }
    if (
      event.target instanceof Element &&
      event.target.closest('[data-leve-file-upload-trigger]')
    ) {
      return;
    }
    await context.openFilePicker$();
  });

  return (
    <div
      {...restProps}
      id={context.ids.dropzone}
      data-leve-file-upload-dropzone=""
      data-state={isDragging.value ? 'dragging' : 'idle'}
      data-dragging={dataAttr(isDragging.value)}
      data-disabled={dataAttr(context.disabled.value)}
      data-readonly={dataAttr(context.readOnly.value)}
      data-invalid={dataAttr(context.invalid.value)}
      onDragEnter$={[handleDragEnter$, props.onDragEnter$]}
      onDragOver$={[preventDragDefault$, handleDragOver$, props.onDragOver$]}
      onDragLeave$={[handleDragLeave$, props.onDragLeave$]}
      onDrop$={[preventDragDefault$, handleDrop$, props.onDrop$]}
      onClick$={[handleClick$, props.onClick$]}
    >
      <Slot />
    </div>
  );
});
