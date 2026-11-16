import { component$, useStyles$ } from '@builder.io/qwik';
import { Dialog } from '@leve-ui/dialog';
import styles from './persistent.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Dialog.Root class="dialog-persistent">
      <Dialog.Trigger class="dialog-persistent-trigger">Delete project</Dialog.Trigger>
      {/* Clicking the backdrop does not close it; Escape and the buttons still do */}
      <Dialog.Content closeOnOutsideClick={false} class="dialog-persistent-content">
        <Dialog.Title class="dialog-persistent-title">Delete project?</Dialog.Title>
        <Dialog.Description class="dialog-persistent-description">
          This deletes the project and its files. You cannot undo it.
        </Dialog.Description>
        <div class="dialog-persistent-actions">
          <Dialog.Close class="dialog-persistent-button">Cancel</Dialog.Close>
          <Dialog.Close class="dialog-persistent-button dialog-persistent-button-primary">
            Delete
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
});
