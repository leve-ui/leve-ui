import { component$, useStyles$ } from '@builder.io/qwik';
import { PasswordInput } from '@leve-ui/password-input';
import { LuEye, LuEyeOff } from '@qwikest/icons/lucide';
import styles from './default-visible.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <PasswordInput.Root defaultVisible class="password-input-default-visible">
      <PasswordInput.Input
        class="password-input-default-visible-input"
        aria-label="Password"
        value="s3cr3t-pass"
      />
      <PasswordInput.VisibilityTrigger
        class="password-input-default-visible-trigger"
        aria-label="Toggle password visibility"
      >
        <PasswordInput.Indicator class="password-input-default-visible-indicator">
          <LuEye class="password-input-default-visible-icon-show" aria-hidden="true" />
          <LuEyeOff class="password-input-default-visible-icon-hide" aria-hidden="true" />
        </PasswordInput.Indicator>
      </PasswordInput.VisibilityTrigger>
    </PasswordInput.Root>
  );
});
