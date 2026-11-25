import { component$, useStyles$ } from '@builder.io/qwik';
import { NumberInput } from '@leve-ui/number-input';
import { LuMinus, LuPlus } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <NumberInput.Root defaultValue={1} class="number-input-default">
      <NumberInput.DecrementTrigger
        class="number-input-default-trigger"
        aria-label="Decrement quantity"
      >
        <LuMinus class="number-input-default-icon" aria-hidden="true" />
      </NumberInput.DecrementTrigger>
      <NumberInput.Input class="number-input-default-input" aria-label="Quantity" />
      <NumberInput.IncrementTrigger
        class="number-input-default-trigger"
        aria-label="Increment quantity"
      >
        <LuPlus class="number-input-default-icon" aria-hidden="true" />
      </NumberInput.IncrementTrigger>
    </NumberInput.Root>
  );
});
