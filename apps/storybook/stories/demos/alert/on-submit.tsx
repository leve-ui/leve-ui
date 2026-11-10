import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Alert } from '@leve-ui/alert';

const styles = `
  .alert {
    border: 1px solid #fca5a5;
    background: #fef2f2;
    padding: 12px;
    border-radius: 6px;
  }

  .alert-title {
    font-weight: 600;
  }
`;

export default component$(() => {
  useStyles$(styles);
  const error = useSignal(false);

  return (
    <div>
      <button type="button" onClick$={() => (error.value = true)}>
        Submit
      </button>
      {/* Render the alert when it should be announced */}
      {error.value && (
        <Alert.Root class="alert">
          <Alert.Title class="alert-title">Submission failed</Alert.Title>
          <Alert.Description>Email is required.</Alert.Description>
        </Alert.Root>
      )}
    </div>
  );
});
