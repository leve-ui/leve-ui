import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Toggle } from '@leve-ui/toggle';
import { LuBold } from '@qwikest/icons/lucide';
import styles from './controlled.css?inline';

export default component$(() => {
  useStyles$(styles);
  const pressed = useSignal(false);

  return (
    <div class="toggle-controlled-container">
      <div class="toggle-controlled-row">
        <Toggle.Root class="toggle-controlled" aria-label="Bold" bind:pressed={pressed}>
          <LuBold class="toggle-controlled-icon" aria-hidden="true" />
        </Toggle.Root>
        <button
          type="button"
          class="toggle-controlled-reset"
          onClick$={() => {
            pressed.value = false;
          }}
        >
          Reset
        </button>
      </div>
      <p class="toggle-controlled-status">Bold: {pressed.value ? 'on' : 'off'}</p>
    </div>
  );
});
