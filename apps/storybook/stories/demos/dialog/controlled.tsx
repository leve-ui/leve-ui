import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Dialog } from '@leve-ui/dialog';
import styles from './controlled.css?inline';

export default component$(() => {
  useStyles$(styles);
  const open = useSignal(false);
  const saved = useSignal(false);

  const save$ = $(() => {
    saved.value = true;
    open.value = false;
  });

  return (
    <Dialog.Root bind:open={open} class="dialog-controlled">
      <Dialog.Trigger class="dialog-controlled-trigger">Rename</Dialog.Trigger>
      <span class="dialog-controlled-status">
        {open.value ? 'Open' : saved.value ? 'Saved' : 'Closed'}
      </span>
      <Dialog.Content class="dialog-controlled-content">
        <Dialog.Title class="dialog-controlled-title">Rename file</Dialog.Title>
        <Dialog.Description class="dialog-controlled-description">
          The dialog closes from code after saving.
        </Dialog.Description>
        <label class="dialog-controlled-label">
          File name
          <input class="dialog-controlled-input" name="file" value="report.pdf" />
        </label>
        <div class="dialog-controlled-actions">
          <Dialog.Close class="dialog-controlled-button">Cancel</Dialog.Close>
          <button
            type="button"
            class="dialog-controlled-button dialog-controlled-button-primary"
            onClick$={save$}
          >
            Save
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
});
