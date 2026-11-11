import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Switch } from '@leve-ui/switch';

const styles = `
  .switch-form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
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

  .switch-submit {
    padding: 6px 12px;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    background-color: #2563eb;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .switch-output {
    font-family: monospace;
    font-size: 14px;
    color: #374151;
  }
`;

export default component$(() => {
  useStyles$(styles);
  const submittedData = useSignal('');

  const handleSubmit$ = $((_event: unknown, form: HTMLFormElement) => {
    const formData = new FormData(form);
    submittedData.value = JSON.stringify(Object.fromEntries(formData));
  });

  return (
    <form class="switch-form" preventdefault:submit onSubmit$={handleSubmit$}>
      <Switch.Root class="switch-root">
        <Switch.Label class="switch-label">Notifications</Switch.Label>
        <Switch.Control class="switch-control">
          <Switch.Thumb class="switch-thumb" />
        </Switch.Control>
        <Switch.HiddenInput name="notifications" />
      </Switch.Root>
      <button type="submit" class="switch-submit">
        Save
      </button>
      <output class="switch-output">{submittedData.value}</output>
    </form>
  );
});
