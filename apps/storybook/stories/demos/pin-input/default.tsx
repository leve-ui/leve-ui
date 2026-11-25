import { component$, useStyles$ } from '@builder.io/qwik';
import { PinInput } from '@leve-ui/pin-input';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <PinInput.Root length={4} aria-label="Verification code" class="pin-input-default">
      <PinInput.Input index={0} class="pin-input-default-input" />
      <PinInput.Input index={1} class="pin-input-default-input" />
      <PinInput.Input index={2} class="pin-input-default-input" />
      <PinInput.Input index={3} class="pin-input-default-input" />
    </PinInput.Root>
  );
});
