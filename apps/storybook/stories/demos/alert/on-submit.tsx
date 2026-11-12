import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Alert } from '@leve-ui/alert';
import { LuAlertCircle } from '@qwikest/icons/lucide';
import styles from './on-submit.css?inline';

export default component$(() => {
  useStyles$(styles);
  const error = useSignal(false);

  return (
    <div class="alert-on-submit-wrapper">
      <button type="button" class="alert-on-submit-button" onClick$={() => (error.value = true)}>
        Submit
      </button>
      {/* Render the alert when it should be announced */}
      {error.value && (
        <Alert.Root class="alert-on-submit">
          <LuAlertCircle class="alert-on-submit-icon" aria-hidden="true" />
          <Alert.Title class="alert-on-submit-title">Submission failed</Alert.Title>
          <Alert.Description class="alert-on-submit-description">
            Email is required.
          </Alert.Description>
        </Alert.Root>
      )}
    </div>
  );
});
