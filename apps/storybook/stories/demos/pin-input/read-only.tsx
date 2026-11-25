import { component$, useStyles$ } from '@builder.io/qwik';
import { PinInput } from '@leve-ui/pin-input';
import styles from './read-only.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <PinInput.Root
      length={4}
      readOnly
      defaultValue={['4', '8', '1', '5']}
      aria-label="Read-only PIN"
      class="pin-input-read-only"
    >
      <PinInput.Input index={0} class="pin-input-read-only-input" />
      <PinInput.Input index={1} class="pin-input-read-only-input" />
      <PinInput.Input index={2} class="pin-input-read-only-input" />
      <PinInput.Input index={3} class="pin-input-read-only-input" />
    </PinInput.Root>
  );
});
