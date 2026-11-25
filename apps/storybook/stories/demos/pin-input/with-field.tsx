import { component$, useStyles$ } from '@builder.io/qwik';
import { Field } from '@leve-ui/field';
import { PinInput } from '@leve-ui/pin-input';
import styles from './with-field.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Field.Root hasDescription required class="pin-input-with-field-field">
      <Field.Label class="pin-input-with-field-label">Security code</Field.Label>
      <PinInput.Root length={4} class="pin-input-with-field">
        <PinInput.Input index={0} class="pin-input-with-field-input" />
        <PinInput.Input index={1} class="pin-input-with-field-input" />
        <PinInput.Input index={2} class="pin-input-with-field-input" />
        <PinInput.Input index={3} class="pin-input-with-field-input" />
      </PinInput.Root>
      <Field.Description class="pin-input-with-field-description">
        Enter the 4-digit code sent to your email.
      </Field.Description>
    </Field.Root>
  );
});
