import { component$, useStyles$ } from '@builder.io/qwik';
import { Field } from '@leve-ui/field';
import styles from './required.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Field.Root required class="field-required">
      <Field.Label class="field-required-label">Full name</Field.Label>
      <Field.Input class="field-required-input" />
    </Field.Root>
  );
});
