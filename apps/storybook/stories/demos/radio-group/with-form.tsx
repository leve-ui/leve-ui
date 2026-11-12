import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { RadioGroup } from '@leve-ui/radio-group';

const styles = `
  .radio-group-root {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .radio-group-label {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
  }

  .radio-group-item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: none;
    background: transparent;
    padding: 4px 0;
    font-size: 14px;
    color: #374151;
    cursor: pointer;
  }

  .radio-group-indicator {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 9999px;
    border: 2px solid #9ca3af;
    background-color: #ffffff;
    box-sizing: border-box;
  }

  /* Checked indicator */
  .radio-group-indicator[data-state="checked"] {
    border-color: #2563eb;
  }

  .radio-group-indicator[data-state="checked"]::after {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 9999px;
    background-color: #2563eb;
  }

  /* Focus indicator */
  .radio-group-item:focus-visible .radio-group-indicator {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  .radio-group-form-button {
    margin-top: 12px;
    padding: 6px 16px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background-color: #ffffff;
    font-size: 14px;
    cursor: pointer;
  }

  .radio-group-submitted {
    margin-top: 12px;
    font-size: 14px;
    color: #059669;
  }
`;

export default component$(() => {
  useStyles$(styles);
  const submittedValue = useSignal<string | null>(null);

  return (
    <div>
      <form
        preventdefault:submit
        onSubmit$={(event) => {
          const form = event.target as HTMLFormElement;
          const formData = new FormData(form);
          submittedValue.value = (formData.get('subscription') as string) || '(none)';
        }}
      >
        <RadioGroup.Root defaultValue="monthly" class="radio-group-root">
          <RadioGroup.Label class="radio-group-label">Subscription billing</RadioGroup.Label>
          <RadioGroup.Item value="monthly" class="radio-group-item">
            <RadioGroup.Indicator class="radio-group-indicator" />
            Monthly billing ($10/mo)
          </RadioGroup.Item>
          <RadioGroup.Item value="yearly" class="radio-group-item">
            <RadioGroup.Indicator class="radio-group-indicator" />
            Yearly billing ($100/yr)
          </RadioGroup.Item>
          <RadioGroup.HiddenInput name="subscription" />
        </RadioGroup.Root>
        <button type="submit" class="radio-group-form-button">
          Submit
        </button>
      </form>
      {submittedValue.value !== null && (
        <p class="radio-group-submitted" data-testid="submitted-value">
          Submitted: {submittedValue.value}
        </p>
      )}
    </div>
  );
});
