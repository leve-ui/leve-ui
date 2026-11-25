import { component$, useStyles$ } from '@builder.io/qwik';
import { NumberInput } from '@leve-ui/number-input';
import { LuMinus, LuPlus } from '@qwikest/icons/lucide';
import styles from './min-max-step.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <NumberInput.Root
      defaultValue={0}
      min={-10}
      max={10}
      step={0.5}
      largeStep={2}
      class="number-input-min-max-step"
    >
      <NumberInput.DecrementTrigger
        class="number-input-min-max-step-trigger"
        aria-label="Decrement by 0.5"
      >
        <LuMinus class="number-input-min-max-step-icon" aria-hidden="true" />
      </NumberInput.DecrementTrigger>
      <NumberInput.Input class="number-input-min-max-step-input" aria-label="Offset (-10 to 10)" />
      <NumberInput.IncrementTrigger
        class="number-input-min-max-step-trigger"
        aria-label="Increment by 0.5"
      >
        <LuPlus class="number-input-min-max-step-icon" aria-hidden="true" />
      </NumberInput.IncrementTrigger>
    </NumberInput.Root>
  );
});
