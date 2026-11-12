import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Field } from '@leve-ui/field';
import styles from './invalid.css?inline';

export default component$(() => {
  useStyles$(styles);

  const value = useSignal('leve');

  return (
    <Field.Root invalid={value.value.trim() === ''} required class="field-invalid">
      <Field.Label class="field-invalid-label">Username</Field.Label>
      <Field.Input bind:value={value} class="field-invalid-input" />
      <Field.ErrorMessage class="field-invalid-error-message">
        Username is required.
      </Field.ErrorMessage>
    </Field.Root>
  );
});
