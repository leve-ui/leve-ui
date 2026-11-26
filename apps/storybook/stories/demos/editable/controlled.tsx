import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Editable } from '@leve-ui/editable';
import { LuCheck, LuPencil, LuX } from '@qwikest/icons/lucide';
import styles from './controlled.css?inline';

export default component$(() => {
  useStyles$(styles);
  const value = useSignal('Controlled value');
  const isEditing = useSignal(false);

  return (
    <div class="editable-controlled-wrapper">
      <Editable.Root bind:value={value} bind:edit={isEditing} class="editable-controlled">
        <Editable.Label class="editable-controlled-label">Display name</Editable.Label>
        <div class="editable-controlled-row">
          <Editable.Area class="editable-controlled-area">
            <Editable.Preview class="editable-controlled-preview" />
            <Editable.Input class="editable-controlled-input" />
          </Editable.Area>
          <Editable.Control class="editable-controlled-control">
            <Editable.EditTrigger class="editable-controlled-trigger" aria-label="Edit">
              <LuPencil class="editable-controlled-icon" aria-hidden="true" />
            </Editable.EditTrigger>
            <Editable.SubmitTrigger
              class="editable-controlled-trigger editable-controlled-submit"
              aria-label="Save"
            >
              <LuCheck class="editable-controlled-icon" aria-hidden="true" />
            </Editable.SubmitTrigger>
            <Editable.CancelTrigger class="editable-controlled-trigger" aria-label="Cancel">
              <LuX class="editable-controlled-icon" aria-hidden="true" />
            </Editable.CancelTrigger>
          </Editable.Control>
        </div>
      </Editable.Root>
      <div class="editable-controlled-actions">
        <button
          type="button"
          class="editable-controlled-btn"
          onClick$={() => {
            isEditing.value = !isEditing.value;
          }}
        >
          Toggle edit ({isEditing.value ? 'editing' : 'preview'})
        </button>
        <span class="editable-controlled-status">Committed: {value.value}</span>
      </div>
    </div>
  );
});
