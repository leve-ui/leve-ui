import { component$, useStyles$ } from '@builder.io/qwik';
import { Field } from '@leve-ui/field';
import { PasswordInput } from '@leve-ui/password-input';
import { LuEye, LuEyeOff } from '@qwikest/icons/lucide';
import styles from './with-field.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Field.Root hasDescription required class="password-input-with-field-field">
      <Field.Label class="password-input-with-field-label">Password</Field.Label>
      <PasswordInput.Root class="password-input-with-field">
        <PasswordInput.Input class="password-input-with-field-input" placeholder="Enter password" />
        <PasswordInput.VisibilityTrigger
          class="password-input-with-field-trigger"
          aria-label="Toggle password visibility"
        >
          <PasswordInput.Indicator class="password-input-with-field-indicator">
            <LuEye class="password-input-with-field-icon-show" aria-hidden="true" />
            <LuEyeOff class="password-input-with-field-icon-hide" aria-hidden="true" />
          </PasswordInput.Indicator>
        </PasswordInput.VisibilityTrigger>
      </PasswordInput.Root>
      <Field.Description class="password-input-with-field-description">
        Must be at least 8 characters.
      </Field.Description>
    </Field.Root>
  );
});
