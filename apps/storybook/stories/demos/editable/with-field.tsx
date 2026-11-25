import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Editable } from '@leve-ui/editable';
import { Field } from '@leve-ui/field';
import { LuCheck, LuPencil, LuX } from '@qwikest/icons/lucide';
import styles from './with-field.css?inline';

export default component$(() => {
  useStyles$(styles);
  const value = useSignal('');

  return (
    <Field.Root invalid={value.value.trim().length === 0} required class="editable-with-field">
      <Field.Label class="editable-with-field-label">Display name</Field.Label>
      <Editable.Root
        bind:value={value}
        placeholder="Enter your name..."
        class="editable-with-field-root"
      >
        <div class="editable-with-field-row">
          <Editable.Area class="editable-with-field-area">
            <Editable.Preview class="editable-with-field-preview" />
            <Editable.Input class="editable-with-field-input" />
          </Editable.Area>
          <Editable.Control class="editable-with-field-control">
            <Editable.EditTrigger class="editable-with-field-trigger" aria-label="Edit">
              <LuPencil class="editable-with-field-icon" aria-hidden="true" />
            </Editable.EditTrigger>
            <Editable.SubmitTrigger
              class="editable-with-field-trigger editable-with-field-submit"
              aria-label="Save"
            >
              <LuCheck class="editable-with-field-icon" aria-hidden="true" />
            </Editable.SubmitTrigger>
            <Editable.CancelTrigger class="editable-with-field-trigger" aria-label="Cancel">
              <LuX class="editable-with-field-icon" aria-hidden="true" />
            </Editable.CancelTrigger>
          </Editable.Control>
        </div>
      </Editable.Root>
      <Field.Description class="editable-with-field-description">
        Shown on your public profile.
      </Field.Description>
      <Field.ErrorMessage class="editable-with-field-error">
        Display name cannot be empty.
      </Field.ErrorMessage>
    </Field.Root>
  );
});
