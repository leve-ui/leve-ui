import { component$, useStyles$ } from '@builder.io/qwik';
import { Field } from '@leve-ui/field';
import { NumberInput } from '@leve-ui/number-input';
import { LuMinus, LuPlus } from '@qwikest/icons/lucide';
import styles from './with-field.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Field.Root class="number-input-with-field" hasDescription invalid required>
      <Field.Label class="number-input-with-field-label">
        Seat count
        <Field.RequiredIndicator class="number-input-with-field-required">
          *
        </Field.RequiredIndicator>
      </Field.Label>
      <NumberInput.Root defaultValue={0} min={1} max={10} class="number-input-with-field-control">
        <NumberInput.DecrementTrigger
          class="number-input-with-field-trigger"
          aria-label="Decrement seats"
        >
          <LuMinus class="number-input-with-field-icon" aria-hidden="true" />
        </NumberInput.DecrementTrigger>
        <NumberInput.Input class="number-input-with-field-input" />
        <NumberInput.IncrementTrigger
          class="number-input-with-field-trigger"
          aria-label="Increment seats"
        >
          <LuPlus class="number-input-with-field-icon" aria-hidden="true" />
        </NumberInput.IncrementTrigger>
      </NumberInput.Root>
      <Field.Description class="number-input-with-field-description">
        Choose between 1 and 10 seats.
      </Field.Description>
      <Field.ErrorMessage class="number-input-with-field-error">
        Please select at least 1 seat.
      </Field.ErrorMessage>
    </Field.Root>
  );
});
