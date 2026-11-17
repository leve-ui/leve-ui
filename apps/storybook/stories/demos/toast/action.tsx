import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Toast } from '@leve-ui/toast';
import { LuX } from '@qwikest/icons/lucide';
import styles from './action.css?inline';

// The data your toasts carry, typed through useToaster<T>()
type FileToast = { file: string };

export default component$(() => {
  useStyles$(styles);

  return (
    <Toast.Provider>
      <Files />
    </Toast.Provider>
  );
});

const Files = component$(() => {
  const toaster = Toast.useToaster<FileToast>();
  const files = useSignal(['report.pdf', 'photo.png', 'notes.txt']);

  return (
    <div class="toast-action">
      <ul class="toast-action-files">
        {files.value.map((file) => (
          <li key={file} class="toast-action-file">
            {file}
            <button
              type="button"
              class="toast-action-button"
              onClick$={() => {
                files.value = files.value.filter((item) => item !== file);
                toaster.add$({ title: 'File deleted', description: file, data: { file } });
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {files.value.length === 0 && <p class="toast-action-empty">No files</p>}

      <Toast.Region class="toast-action-region">
        <Toast.List class="toast-action-list">
          {toaster.toasts.value.map((toast) => (
            <Toast.Root key={toast.id} toast={toast} class="toast-action-toast">
              <Toast.Title class="toast-action-title">{toast.title}</Toast.Title>
              <Toast.Description class="toast-action-description">
                {toast.description}
              </Toast.Description>
              {/* A toast with an Action stays until it is closed */}
              <Toast.Action
                class="toast-action-undo"
                onClick$={() => {
                  if (toast.data) files.value = [...files.value, toast.data.file];
                }}
              >
                Undo
              </Toast.Action>
              <Toast.Close aria-label="Close" class="toast-action-close">
                <LuX aria-hidden="true" class="toast-action-icon" />
              </Toast.Close>
            </Toast.Root>
          ))}
        </Toast.List>
      </Toast.Region>
    </div>
  );
});
