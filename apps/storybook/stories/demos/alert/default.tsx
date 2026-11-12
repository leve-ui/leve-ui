import { component$, useStyles$ } from '@builder.io/qwik';
import { Alert } from '@leve-ui/alert';
import { LuAlertCircle } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Alert.Root class="alert-default">
      <LuAlertCircle class="alert-default-icon" aria-hidden="true" />
      <Alert.Title class="alert-default-title">Payment failed</Alert.Title>
      <Alert.Description class="alert-default-description">
        Check your card details and try again.
      </Alert.Description>
    </Alert.Root>
  );
});
