import { component$, useStyles$ } from '@builder.io/qwik';
import { Field } from '@leve-ui/field';
import { Switch } from '@leve-ui/switch';

const styles = `
  .switch-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 320px;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .switch-field-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .switch-field-label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
  }

  .switch-field-description {
    font-size: 12px;
    color: #6b7280;
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
    <Field.Root hasDescription class="switch-field">
      <div class="switch-field-row">
        <Field.Label class="switch-field-label">Dark mode</Field.Label>
        <Switch.Root class="switch-root">
          <Switch.Control class="switch-control">
            <Switch.Thumb class="switch-thumb" />
          </Switch.Control>
        </Switch.Root>
      </div>
      <Field.Description class="switch-field-description">
        Use a dark color scheme.
      </Field.Description>
    </Field.Root>
  );
});
