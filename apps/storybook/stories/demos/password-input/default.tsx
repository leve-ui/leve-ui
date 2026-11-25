import { component$, useStyles$ } from '@builder.io/qwik';
import { PasswordInput } from '@leve-ui/password-input';
import { LuEye, LuEyeOff } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <PasswordInput.Root class="password-input-default">
      <PasswordInput.Input
        class="password-input-default-input"
        aria-label="Password"
        placeholder="Enter password"
      />
      <PasswordInput.VisibilityTrigger
        class="password-input-default-trigger"
        aria-label="Toggle password visibility"
      >
        <PasswordInput.Indicator class="password-input-default-indicator">
          <LuEye class="password-input-default-icon-show" aria-hidden="true" />
          <LuEyeOff class="password-input-default-icon-hide" aria-hidden="true" />
        </PasswordInput.Indicator>
      </PasswordInput.VisibilityTrigger>
    </PasswordInput.Root>
  );
});
