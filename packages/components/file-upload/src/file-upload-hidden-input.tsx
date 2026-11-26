import {
  $,
  component$,
  type PropsOf,
  useContext,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import { dataAttr, useFormReset } from '@leve-ui/utils';
import { fileUploadContextId } from './file-upload-context';
import { syncInputFiles } from './file-upload-utils';

export type FileUploadHiddenInputProps = PropsOf<'input'> & {
  /** The `id` of the form element to associate the input with. */
  form?: string;
};

/**
 * Visually hidden native `<input type="file">` for file selection and native `<form>` submission.
 */
export const FileUploadHiddenInput = component$<FileUploadHiddenInputProps>((props) => {
  const context = useContext(fileUploadContextId);
  const hasInitialRun = useSignal(false);

  useFormReset(
    context.inputRef,
    $(async () => {
      await context.reset$();
    }),
  );

  // Sync the native FileList whenever the managed files state changes (e.g., controlled bind:files or initial defaultFiles).
  // biome-ignore lint/correctness/noQwikUseVisibleTask: Syncs native HTMLInputElement.files via DataTransfer in the browser.
  useVisibleTask$(
    ({ track }) => {
      const files = track(() => context.files.value);
      if (!hasInitialRun.value) {
        hasInitialRun.value = true;
        if (files.length === 0) {
          return;
        }
      }
      syncInputFiles(context.inputRef.value, files);
    },
    { strategy: 'document-ready' },
  );

  const handleChange$ = $(async (_event: Event, element: HTMLInputElement) => {
    const selected = element.files ? Array.from(element.files) : [];
    if (selected.length > 0) {
      await context.addFiles$(selected);
    } else {
      syncInputFiles(element, context.files.value);
    }
  });

  return (
    <input
      {...props}
      ref={context.inputRef}
      type="file"
      id={context.ids.input}
      accept={context.accept.value}
      multiple={context.isMultiple.value}
      required={context.required.value}
      disabled={context.disabled.value}
      aria-describedby={context.describedBy.value}
      aria-invalid={context.invalid.value ? 'true' : undefined}
      tabIndex={-1}
      aria-hidden="true"
      // Functional inline style per adr/0026; keeps native form submission and required validation working.
      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', margin: 0 }}
      data-leve-file-upload-hidden-input=""
      data-disabled={dataAttr(context.disabled.value)}
      data-readonly={dataAttr(context.readOnly.value)}
      data-invalid={dataAttr(context.invalid.value)}
      onChange$={[handleChange$, props.onChange$]}
    />
  );
});
