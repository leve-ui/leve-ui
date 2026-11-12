import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { RadioGroup } from '@leve-ui/radio-group';
import styles from './with-form.css?inline';

export default component$(() => {
  useStyles$(styles);
  const submittedValue = useSignal<string | null>(null);

  return (
    <div class="radio-group-with-form-wrapper">
      <form
        class="radio-group-with-form-form"
        preventdefault:submit
        onSubmit$={(event) => {
          const form = event.target as HTMLFormElement;
          const formData = new FormData(form);
          submittedValue.value = (formData.get('subscription') as string) || '(none)';
        }}
      >
        <RadioGroup.Root defaultValue="monthly" class="radio-group-with-form-root">
          <RadioGroup.Label class="radio-group-with-form-label">
            Subscription billing
          </RadioGroup.Label>
          <RadioGroup.Item value="monthly" class="radio-group-with-form-item">
            <RadioGroup.Indicator class="radio-group-with-form-indicator" />
            Monthly billing ($10/mo)
          </RadioGroup.Item>
          <RadioGroup.Item value="yearly" class="radio-group-with-form-item">
            <RadioGroup.Indicator class="radio-group-with-form-indicator" />
            Yearly billing ($100/yr)
          </RadioGroup.Item>
          <RadioGroup.HiddenInput name="subscription" />
        </RadioGroup.Root>
        <button type="submit" class="radio-group-with-form-form-button">
          Submit
        </button>
      </form>
      {submittedValue.value !== null && (
        <p class="radio-group-with-form-submitted" data-testid="submitted-value">
          Submitted: {submittedValue.value}
        </p>
      )}
    </div>
  );
});
