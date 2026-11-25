import { component$, useStyles$ } from '@builder.io/qwik';
import { NumberInput } from '@leve-ui/number-input';
import { LuMinus, LuPlus } from '@qwikest/icons/lucide';
import styles from './formatted.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <NumberInput.Root
      defaultValue={1250}
      min={0}
      step={50}
      locale="en-US"
      formatOptions={{ style: 'currency', currency: 'USD' }}
      class="number-input-formatted"
    >
      <NumberInput.DecrementTrigger
        class="number-input-formatted-trigger"
        aria-label="Decrease price"
      >
        <LuMinus class="number-input-formatted-icon" aria-hidden="true" />
      </NumberInput.DecrementTrigger>
      <NumberInput.Input class="number-input-formatted-input" aria-label="Price" />
      <NumberInput.IncrementTrigger
        class="number-input-formatted-trigger"
        aria-label="Increase price"
      >
        <LuPlus class="number-input-formatted-icon" aria-hidden="true" />
      </NumberInput.IncrementTrigger>
    </NumberInput.Root>
  );
});
