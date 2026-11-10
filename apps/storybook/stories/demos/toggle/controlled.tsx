import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Toggle } from '@leve-ui/toggle';

const styles = `
  .toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    border-radius: 4px;
    border: 1px solid #d1d5db;
    background-color: #ffffff;
    color: #111827;
    cursor: pointer;
    user-select: none;
    transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease;
  }

  .toggle:hover:not(:disabled) {
    background-color: #f3f4f6;
  }

  /* Pressed state */
  .toggle[data-state="on"] {
    background-color: #111827;
    color: #ffffff;
    border-color: #111827;
  }

  .toggle[data-state="on"]:hover:not(:disabled) {
    background-color: #1f2937;
  }

  /* Focus indicator */
  .toggle:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  /* Disabled state */
  .toggle:disabled,
  .toggle[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .toggle-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .toggle-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .toggle-status {
    margin: 0;
    font-size: 14px;
    color: #374151;
  }

  .toggle-reset {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 4px;
    border: 1px solid #d1d5db;
    background-color: #f9fafb;
    color: #374151;
    cursor: pointer;
  }

  .toggle-reset:hover {
    background-color: #f3f4f6;
  }

  .toggle-reset:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
`;

export default component$(() => {
  useStyles$(styles);
  const pressed = useSignal(false);

  return (
    <div class="toggle-container">
      <div class="toggle-row">
        <Toggle.Root class="toggle" bind:pressed={pressed}>
          Bold
        </Toggle.Root>
        <button
          type="button"
          class="toggle-reset"
          onClick$={() => {
            pressed.value = false;
          }}
        >
          Reset
        </button>
      </div>
      <p class="toggle-status">Bold: {pressed.value ? 'on' : 'off'}</p>
    </div>
  );
});
