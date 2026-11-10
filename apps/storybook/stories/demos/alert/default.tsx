import { component$, useStyles$ } from '@builder.io/qwik';
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

  return (
    <Alert.Root class="alert">
      <Alert.Title class="alert-title">Payment failed</Alert.Title>
      <Alert.Description>Check your card details and try again.</Alert.Description>
    </Alert.Root>
  );
});
