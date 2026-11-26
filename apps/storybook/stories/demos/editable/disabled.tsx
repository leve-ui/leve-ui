import { component$, useStyles$ } from '@builder.io/qwik';
import { Editable } from '@leve-ui/editable';
import { LuPencil } from '@qwikest/icons/lucide';
import styles from './disabled.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Editable.Root defaultValue="Cannot be edited" disabled class="editable-disabled">
      <Editable.Label class="editable-disabled-label">Locked field</Editable.Label>
      <div class="editable-disabled-row">
        <Editable.Area class="editable-disabled-area">
          <Editable.Preview class="editable-disabled-preview" />
          <Editable.Input class="editable-disabled-input" />
        </Editable.Area>
        <Editable.Control class="editable-disabled-control">
          <Editable.EditTrigger class="editable-disabled-trigger" aria-label="Edit">
            <LuPencil class="editable-disabled-icon" aria-hidden="true" />
          </Editable.EditTrigger>
        </Editable.Control>
      </div>
    </Editable.Root>
  );
});
