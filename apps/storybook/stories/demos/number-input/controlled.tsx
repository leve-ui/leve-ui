import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { NumberInput } from '@leve-ui/number-input';
import { LuChevronDown, LuChevronUp } from '@qwikest/icons/lucide';
import styles from './controlled.css?inline';

export default component$(() => {
  useStyles$(styles);
  const value = useSignal<number | null>(10);

  return (
    <div class="number-input-controlled-wrapper">
      <NumberInput.Root bind:value={value} class="number-input-controlled">
        <NumberInput.Input class="number-input-controlled-input" aria-label="Controlled number" />
        <div class="number-input-controlled-triggers">
          <NumberInput.IncrementTrigger
            class="number-input-controlled-trigger"
            aria-label="Increment"
          >
            <LuChevronUp class="number-input-controlled-icon" aria-hidden="true" />
          </NumberInput.IncrementTrigger>
          <NumberInput.DecrementTrigger
            class="number-input-controlled-trigger"
            aria-label="Decrement"
          >
            <LuChevronDown class="number-input-controlled-icon" aria-hidden="true" />
          </NumberInput.DecrementTrigger>
        </div>
      </NumberInput.Root>
      <p class="number-input-controlled-status">
        Value: {value.value === null ? 'empty' : value.value}
      </p>
    </div>
  );
});
