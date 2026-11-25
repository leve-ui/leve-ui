import { component$, useStyles$ } from '@builder.io/qwik';
import { Editable } from '@leve-ui/editable';
import { LuCheck, LuPencil, LuX } from '@qwikest/icons/lucide';
import styles from './multiline.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Editable.Root
      multiline
      defaultValue={'First line of notes.\nPress Ctrl+Enter (or Cmd+Enter) to save.'}
      placeholder="Add notes..."
      class="editable-multiline"
    >
      <Editable.Label class="editable-multiline-label">Notes</Editable.Label>
      <Editable.Area class="editable-multiline-area">
        <Editable.Preview class="editable-multiline-preview" />
        <Editable.Input rows={3} class="editable-multiline-input" />
      </Editable.Area>
      <Editable.Control class="editable-multiline-control">
        <Editable.EditTrigger class="editable-multiline-trigger">
          <LuPencil class="editable-multiline-icon" aria-hidden="true" />
          Edit
        </Editable.EditTrigger>
        <Editable.SubmitTrigger class="editable-multiline-trigger editable-multiline-submit">
          <LuCheck class="editable-multiline-icon" aria-hidden="true" />
          Save
        </Editable.SubmitTrigger>
        <Editable.CancelTrigger class="editable-multiline-trigger">
          <LuX class="editable-multiline-icon" aria-hidden="true" />
          Cancel
        </Editable.CancelTrigger>
      </Editable.Control>
    </Editable.Root>
  );
});
