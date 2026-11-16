import { component$, useStyles$ } from '@builder.io/qwik';
import { Dialog } from '@leve-ui/dialog';
import { LuX } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Dialog.Root class="dialog-default">
      <Dialog.Trigger class="dialog-default-trigger">Edit profile</Dialog.Trigger>
      <Dialog.Content class="dialog-default-content">
        <Dialog.Title class="dialog-default-title">Edit profile</Dialog.Title>
        <Dialog.Description class="dialog-default-description">
          Change how your name appears to others.
        </Dialog.Description>
        <label class="dialog-default-label">
          Name
          <input class="dialog-default-input" name="name" value="Ada Lovelace" />
        </label>
        <div class="dialog-default-actions">
          <Dialog.Close class="dialog-default-button">Cancel</Dialog.Close>
          <Dialog.Close class="dialog-default-button dialog-default-button-primary">
            Save
          </Dialog.Close>
        </div>
        <Dialog.Close class="dialog-default-close" aria-label="Close">
          <LuX class="dialog-default-icon" aria-hidden="true" />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
});
