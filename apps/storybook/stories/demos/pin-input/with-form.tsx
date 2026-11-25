import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { PinInput } from '@leve-ui/pin-input';
import styles from './with-form.css?inline';

export default component$(() => {
  useStyles$(styles);
  const submittedData = useSignal('');

  const handleSubmit$ = $((_event: unknown, form: HTMLFormElement) => {
    const formData = new FormData(form);
    submittedData.value = JSON.stringify(Object.fromEntries(formData));
  });

  return (
    <div class="pin-input-with-form-wrapper">
      <form class="pin-input-with-form-form" preventdefault:submit onSubmit$={handleSubmit$}>
        <PinInput.Root
          length={4}
          defaultValue={['1', '2', '', '']}
          required
          aria-label="Verification code"
          class="pin-input-with-form"
        >
          <PinInput.Input index={0} class="pin-input-with-form-input" />
          <PinInput.Input index={1} class="pin-input-with-form-input" />
          <PinInput.Input index={2} class="pin-input-with-form-input" />
          <PinInput.Input index={3} class="pin-input-with-form-input" />
          <PinInput.HiddenInput name="code" />
        </PinInput.Root>
        <div class="pin-input-with-form-actions">
          <button type="submit" class="pin-input-with-form-submit">
            Submit
          </button>
          <button type="reset" class="pin-input-with-form-reset">
            Reset
          </button>
        </div>
      </form>
      <output class="pin-input-with-form-output">{submittedData.value}</output>
    </div>
  );
});
