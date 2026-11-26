import { component$, useStyles$ } from '@builder.io/qwik';
import { Editable } from '@leve-ui/editable';
import { LuPencil } from '@qwikest/icons/lucide';
import styles from './read-only.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Editable.Root defaultValue="Read-only value" readOnly class="editable-read-only">
      <Editable.Label class="editable-read-only-label">Account ID</Editable.Label>
      <div class="editable-read-only-row">
        <Editable.Area class="editable-read-only-area">
          <Editable.Preview class="editable-read-only-preview" />
          <Editable.Input class="editable-read-only-input" />
        </Editable.Area>
        <Editable.Control class="editable-read-only-control">
          <Editable.EditTrigger class="editable-read-only-trigger" aria-label="Edit">
            <LuPencil class="editable-read-only-icon" aria-hidden="true" />
          </Editable.EditTrigger>
        </Editable.Control>
      </div>
    </Editable.Root>
  );
});
