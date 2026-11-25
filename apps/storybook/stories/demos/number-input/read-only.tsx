import { component$, useStyles$ } from '@builder.io/qwik';
import { NumberInput } from '@leve-ui/number-input';
import { LuMinus, LuPlus } from '@qwikest/icons/lucide';
import styles from './read-only.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <NumberInput.Root defaultValue={42} readOnly class="number-input-read-only">
      <NumberInput.DecrementTrigger class="number-input-read-only-trigger" aria-label="Decrement">
        <LuMinus class="number-input-read-only-icon" aria-hidden="true" />
      </NumberInput.DecrementTrigger>
      <NumberInput.Input class="number-input-read-only-input" aria-label="Read-only value" />
      <NumberInput.IncrementTrigger class="number-input-read-only-trigger" aria-label="Increment">
        <LuPlus class="number-input-read-only-icon" aria-hidden="true" />
      </NumberInput.IncrementTrigger>
    </NumberInput.Root>
  );
});
