import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Checkbox } from '@leve-ui/checkbox';
import { LuCheck } from '@qwikest/icons/lucide';
import styles from './with-form.css?inline';

export default component$(() => {
  useStyles$(styles);
  const submittedData = useSignal('');

  const handleSubmit$ = $((_event: unknown, form: HTMLFormElement) => {
    const formData = new FormData(form);
    submittedData.value = JSON.stringify(Object.fromEntries(formData));
  });

  return (
    <form class="checkbox-with-form-form" preventdefault:submit onSubmit$={handleSubmit$}>
      <Checkbox.Root class="checkbox-with-form-root">
        <Checkbox.Control class="checkbox-with-form-control">
          <Checkbox.Indicator class="checkbox-with-form-indicator">
            <LuCheck class="checkbox-with-form-icon" aria-hidden="true" />
          </Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.Label class="checkbox-with-form-label">Agree to marketing emails</Checkbox.Label>
        <Checkbox.HiddenInput name="marketing" value="subscribed" />
      </Checkbox.Root>
      <button type="submit" class="checkbox-with-form-submit">
        Submit
      </button>
      <output class="checkbox-with-form-output">{submittedData.value}</output>
    </form>
  );
});
