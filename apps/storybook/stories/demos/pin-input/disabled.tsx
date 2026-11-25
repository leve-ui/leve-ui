import { component$, useStyles$ } from '@builder.io/qwik';
import { PinInput } from '@leve-ui/pin-input';
import styles from './disabled.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <PinInput.Root
      length={4}
      disabled
      defaultValue={['1', '2', '', '']}
      aria-label="Disabled PIN"
      class="pin-input-disabled"
    >
      <PinInput.Input index={0} class="pin-input-disabled-input" />
      <PinInput.Input index={1} class="pin-input-disabled-input" />
      <PinInput.Input index={2} class="pin-input-disabled-input" />
      <PinInput.Input index={3} class="pin-input-disabled-input" />
    </PinInput.Root>
  );
});
