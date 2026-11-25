import { component$, useStyles$ } from '@builder.io/qwik';
import { PinInput } from '@leve-ui/pin-input';
import styles from './mask.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <PinInput.Root
      length={4}
      mask
      defaultValue={['1', '2', '', '']}
      aria-label="Masked PIN"
      class="pin-input-mask"
    >
      <PinInput.Input index={0} class="pin-input-mask-input" />
      <PinInput.Input index={1} class="pin-input-mask-input" />
      <PinInput.Input index={2} class="pin-input-mask-input" />
      <PinInput.Input index={3} class="pin-input-mask-input" />
    </PinInput.Root>
  );
});
