import { component$, useStyles$ } from '@builder.io/qwik';
import { Field } from '@leve-ui/field';
import styles from './textarea.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Field.Root hasDescription class="field-textarea">
      <Field.Label class="field-textarea-label">Bio</Field.Label>
      <Field.Textarea placeholder="I build things with Qwik." class="field-textarea-textarea" />
      <Field.Description class="field-textarea-description">
        Tell us about yourself.
      </Field.Description>
    </Field.Root>
  );
});
