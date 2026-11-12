import { component$, useStyles$ } from '@builder.io/qwik';
import { Field } from '@leve-ui/field';
import styles from './disabled.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Field.Root disabled class="field-disabled">
      <Field.Label class="field-disabled-label">Name</Field.Label>
      <Field.Input class="field-disabled-input" />
    </Field.Root>
  );
});
