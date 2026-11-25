import { component$, useStyles$ } from '@builder.io/qwik';
import { Field } from '@leve-ui/field';
import styles from './read-only.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Field.Root readOnly class="field-read-only">
      <Field.Label class="field-read-only-label">Email</Field.Label>
      <Field.Input value="hello@leve-ui.dev" class="field-read-only-input" />
    </Field.Root>
  );
});
