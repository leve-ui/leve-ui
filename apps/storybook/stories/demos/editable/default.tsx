import { component$, useStyles$ } from '@builder.io/qwik';
import { Editable } from '@leve-ui/editable';
import { LuCheck, LuPencil, LuX } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Editable.Root
      defaultValue="Click or focus to edit"
      placeholder="Enter a title..."
      class="editable-default"
    >
      <Editable.Label class="editable-default-label">Project title</Editable.Label>
      <div class="editable-default-row">
        <Editable.Area class="editable-default-area">
          <Editable.Preview class="editable-default-preview" />
          <Editable.Input class="editable-default-input" />
        </Editable.Area>
        <Editable.Control class="editable-default-control">
          <Editable.EditTrigger class="editable-default-trigger" aria-label="Edit">
            <LuPencil class="editable-default-icon" aria-hidden="true" />
          </Editable.EditTrigger>
          <Editable.SubmitTrigger
            class="editable-default-trigger editable-default-submit"
            aria-label="Save"
          >
            <LuCheck class="editable-default-icon" aria-hidden="true" />
          </Editable.SubmitTrigger>
          <Editable.CancelTrigger class="editable-default-trigger" aria-label="Cancel">
            <LuX class="editable-default-icon" aria-hidden="true" />
          </Editable.CancelTrigger>
        </Editable.Control>
      </div>
    </Editable.Root>
  );
});
