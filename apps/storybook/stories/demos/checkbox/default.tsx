import { component$, useStyles$ } from '@builder.io/qwik';
import { Checkbox } from '@leve-ui/checkbox';

const styles = `
  .checkbox-root {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .checkbox-label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    user-select: none;
  }

  .checkbox-control {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 0;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background-color: #ffffff;
    cursor: pointer;
    transition: background-color 150ms ease, border-color 150ms ease;
  }

  /* Checked state */
  .checkbox-control[data-state="checked"] {
    background-color: #2563eb;
    border-color: #2563eb;
  }

  /* Focus indicator */
  .checkbox-control:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  /* Disabled state */
  .checkbox-control:disabled,
  .checkbox-control[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .checkbox-indicator {
    display: none;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #ffffff;
  }

  .checkbox-indicator[data-state="checked"] {
    display: flex;
  }

  .checkbox-icon {
    width: 14px;
    height: 14px;
  }
`;

export default component$(() => {
  useStyles$(styles);

  return (
    <Checkbox.Root class="checkbox-root">
      <Checkbox.Control class="checkbox-control">
        <Checkbox.Indicator class="checkbox-indicator">
          <svg
            aria-hidden="true"
            class="checkbox-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Label class="checkbox-label">Accept terms and conditions</Checkbox.Label>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
  );
});
