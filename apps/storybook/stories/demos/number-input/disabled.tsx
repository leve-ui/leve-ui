import { component$, useStyles$ } from '@builder.io/qwik';
import { NumberInput } from '@leve-ui/number-input';
import { LuMinus, LuPlus } from '@qwikest/icons/lucide';
import styles from './disabled.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <NumberInput.Root defaultValue={5} disabled class="number-input-disabled">
      <NumberInput.DecrementTrigger class="number-input-disabled-trigger" aria-label="Decrement">
        <LuMinus class="number-input-disabled-icon" aria-hidden="true" />
      </NumberInput.DecrementTrigger>
      <NumberInput.Input class="number-input-disabled-input" aria-label="Disabled quantity" />
      <NumberInput.IncrementTrigger class="number-input-disabled-trigger" aria-label="Increment">
        <LuPlus class="number-input-disabled-icon" aria-hidden="true" />
      </NumberInput.IncrementTrigger>
    </NumberInput.Root>
  );
});
