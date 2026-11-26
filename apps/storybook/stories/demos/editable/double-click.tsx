import { component$, useStyles$ } from '@builder.io/qwik';
import { Editable } from '@leve-ui/editable';
import { LuCheck, LuPencil, LuX } from '@qwikest/icons/lucide';
import styles from './double-click.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Editable.Root
      defaultValue="Double-click to edit"
      activationMode="dblclick"
      class="editable-double-click"
    >
      <Editable.Label class="editable-double-click-label">Document name</Editable.Label>
      <div class="editable-double-click-row">
        <Editable.Area class="editable-double-click-area">
          <Editable.Preview class="editable-double-click-preview" />
          <Editable.Input class="editable-double-click-input" />
        </Editable.Area>
        <Editable.Control class="editable-double-click-control">
          <Editable.EditTrigger class="editable-double-click-trigger" aria-label="Edit">
            <LuPencil class="editable-double-click-icon" aria-hidden="true" />
          </Editable.EditTrigger>
          <Editable.SubmitTrigger
            class="editable-double-click-trigger editable-double-click-submit"
            aria-label="Save"
          >
            <LuCheck class="editable-double-click-icon" aria-hidden="true" />
          </Editable.SubmitTrigger>
          <Editable.CancelTrigger class="editable-double-click-trigger" aria-label="Cancel">
            <LuX class="editable-double-click-icon" aria-hidden="true" />
          </Editable.CancelTrigger>
        </Editable.Control>
      </div>
    </Editable.Root>
  );
});
