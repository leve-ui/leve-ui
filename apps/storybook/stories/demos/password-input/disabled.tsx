import { component$, useStyles$ } from '@builder.io/qwik';
import { PasswordInput } from '@leve-ui/password-input';
import { LuEye, LuEyeOff } from '@qwikest/icons/lucide';
import styles from './disabled.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <PasswordInput.Root disabled class="password-input-disabled">
      <PasswordInput.Input
        class="password-input-disabled-input"
        aria-label="Password"
        value="s3cr3t-pass"
      />
      <PasswordInput.VisibilityTrigger
        class="password-input-disabled-trigger"
        aria-label="Toggle password visibility"
      >
        <PasswordInput.Indicator class="password-input-disabled-indicator">
          <LuEye class="password-input-disabled-icon-show" aria-hidden="true" />
          <LuEyeOff class="password-input-disabled-icon-hide" aria-hidden="true" />
        </PasswordInput.Indicator>
      </PasswordInput.VisibilityTrigger>
    </PasswordInput.Root>
  );
});
