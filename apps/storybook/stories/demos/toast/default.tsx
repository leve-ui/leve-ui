import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Toast } from '@leve-ui/toast';
import { LuX } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

const MESSAGES = [
  { title: 'Saved', description: 'Your changes were saved.' },
  { title: 'Copied', description: 'The link was copied to the clipboard.' },
  { title: 'Invitation sent', description: 'We emailed the invitation to your teammate.' },
];

// Any component inside the Provider can add toasts
const ShowButton = component$(() => {
  const toaster = Toast.useToaster();
  const count = useSignal(0);

  return (
    <button
      type="button"
      class="toast-default-button"
      onClick$={() => {
        toaster.add$(MESSAGES[count.value % MESSAGES.length]);
        count.value += 1;
      }}
    >
      Show toast
    </button>
  );
});

// Renders the toasts; put it once, usually at the app root
const Toaster = component$(() => {
  const toaster = Toast.useToaster();

  return (
    <Toast.Region class="toast-default-region">
      <Toast.List class="toast-default-list">
        {toaster.toasts.value.map((toast) => (
          <Toast.Root key={toast.id} toast={toast} class="toast-default-toast">
            <Toast.Title class="toast-default-title">{toast.title}</Toast.Title>
            <Toast.Description class="toast-default-description">
              {toast.description}
            </Toast.Description>
            <Toast.Close aria-label="Close" class="toast-default-close">
              <LuX aria-hidden="true" class="toast-default-icon" />
            </Toast.Close>
          </Toast.Root>
        ))}
      </Toast.List>
    </Toast.Region>
  );
});

export default component$(() => {
  useStyles$(styles);

  return (
    <Toast.Provider>
      <ShowButton />
      <Toaster />
    </Toast.Provider>
  );
});
