import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { PasswordInput } from '@leve-ui/password-input';
import { LuEye, LuEyeOff } from '@qwikest/icons/lucide';
import styles from './controlled.css?inline';

export default component$(() => {
  useStyles$(styles);
  const visible = useSignal(false);

  return (
    <div class="password-input-controlled-wrap">
      <PasswordInput.Root bind:visible={visible} class="password-input-controlled">
        <PasswordInput.Input
          class="password-input-controlled-input"
          aria-label="Password"
          placeholder="Enter password"
        />
        <PasswordInput.VisibilityTrigger
          class="password-input-controlled-trigger"
          aria-label="Toggle password visibility"
        >
          <PasswordInput.Indicator class="password-input-controlled-indicator">
            <LuEye class="password-input-controlled-icon-show" aria-hidden="true" />
            <LuEyeOff class="password-input-controlled-icon-hide" aria-hidden="true" />
          </PasswordInput.Indicator>
        </PasswordInput.VisibilityTrigger>
      </PasswordInput.Root>
      <p class="password-input-controlled-status">
        Visibility: {visible.value ? 'visible' : 'hidden'}
      </p>
    </div>
  );
});
