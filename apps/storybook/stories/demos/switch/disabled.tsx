import { component$, useStyles$ } from '@builder.io/qwik';
import { Switch } from '@leve-ui/switch';

const styles = `
  .switch-disabled-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .switch-button {
    padding: 6px 12px;
    font-size: 14px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background: #ffffff;
    cursor: pointer;
  }

  .switch-root {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .switch-label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
  }

  .switch-label[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .switch-control {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 44px;
    height: 24px;
    padding: 2px;
    border: none;
    border-radius: 9999px;
    background-color: #d1d5db;
    cursor: pointer;
    transition: background-color 150ms ease;
  }

  /* Checked state */
  .switch-control[data-state="checked"] {
    background-color: #2563eb;
  }

  /* Focus indicator */
  .switch-control:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  /* Disabled state */
  .switch-control:disabled,
  .switch-control[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .switch-thumb {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 9999px;
    background-color: #ffffff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
    transition: transform 150ms ease;
    transform: translateX(0);
  }

  .switch-thumb[data-state="checked"] {
    transform: translateX(20px);
  }
`;

export default component$(() => {
  useStyles$(styles);

  return (
    <div class="switch-disabled-wrapper">
      <button type="button" class="switch-button">
        Before
      </button>
      <Switch.Root disabled class="switch-root">
        <Switch.Label class="switch-label">Bluetooth</Switch.Label>
        <Switch.Control class="switch-control">
          <Switch.Thumb class="switch-thumb" />
        </Switch.Control>
      </Switch.Root>
      <button type="button" class="switch-button">
        After
      </button>
    </div>
  );
});
