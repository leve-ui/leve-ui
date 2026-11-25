import { component$, useStyles$ } from '@builder.io/qwik';
import { PinInput } from '@leve-ui/pin-input';
import styles from './alphanumeric.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <PinInput.Root
      length={4}
      type="alphanumeric"
      aria-label="Alphanumeric code"
      class="pin-input-alphanumeric"
    >
      <PinInput.Input index={0} class="pin-input-alphanumeric-input" />
      <PinInput.Input index={1} class="pin-input-alphanumeric-input" />
      <PinInput.Input index={2} class="pin-input-alphanumeric-input" />
      <PinInput.Input index={3} class="pin-input-alphanumeric-input" />
    </PinInput.Root>
  );
});
