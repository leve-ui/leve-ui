import { component$, useStyles$ } from '@builder.io/qwik';
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
`;

export default component$(() => {
  useStyles$(styles);

  return (
    <Toggle.Root class="toggle" disabled>
      Bold
    </Toggle.Root>
  );
});
