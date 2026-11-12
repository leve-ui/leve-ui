import { component$, useStyles$ } from '@builder.io/qwik';
import { Field } from '@leve-ui/field';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Field.Root hasDescription class="field-default">
      <Field.Label class="field-default-label">Email</Field.Label>
      <Field.Input type="email" placeholder="you@example.com" class="field-default-input" />
      <Field.Description class="field-default-description">
        We'll never share your email.
      </Field.Description>
    </Field.Root>
  );
});
