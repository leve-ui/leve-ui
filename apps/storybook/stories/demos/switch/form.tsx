import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Switch } from '@leve-ui/switch';
import styles from './form.css?inline';

export default component$(() => {
  useStyles$(styles);
  const submittedData = useSignal('');

  const handleSubmit$ = $((_event: unknown, form: HTMLFormElement) => {
    const formData = new FormData(form);
    submittedData.value = JSON.stringify(Object.fromEntries(formData));
  });

  return (
    <form class="switch-form-form" preventdefault:submit onSubmit$={handleSubmit$}>
      <Switch.Root class="switch-form-root">
        <Switch.Label class="switch-form-label">Notifications</Switch.Label>
        <Switch.Control class="switch-form-control">
          <Switch.Thumb class="switch-form-thumb" />
        </Switch.Control>
        <Switch.HiddenInput name="notifications" />
      </Switch.Root>
      <button type="submit" class="switch-form-submit">
        Save
      </button>
      <output class="switch-form-output">{submittedData.value}</output>
    </form>
  );
});
