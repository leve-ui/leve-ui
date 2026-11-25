import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { NumberInput } from '@leve-ui/number-input';
import { LuMinus, LuPlus } from '@qwikest/icons/lucide';
import styles from './with-form.css?inline';

export default component$(() => {
  useStyles$(styles);
  const submitted = useSignal<string>('None');

  return (
    <div class="number-input-with-form-wrapper">
      <form
        class="number-input-with-form"
        preventdefault:submit
        onSubmit$={$((_, form) => {
          const data = new FormData(form);
          submitted.value = String(data.get('quantity') ?? '');
        })}
      >
        <NumberInput.Root defaultValue={3} min={1} max={10} class="number-input-with-form-control">
          <NumberInput.DecrementTrigger
            class="number-input-with-form-trigger"
            aria-label="Decrement quantity"
          >
            <LuMinus class="number-input-with-form-icon" aria-hidden="true" />
          </NumberInput.DecrementTrigger>
          <NumberInput.Input
            name="quantity"
            class="number-input-with-form-input"
            aria-label="Quantity"
          />
          <NumberInput.IncrementTrigger
            class="number-input-with-form-trigger"
            aria-label="Increment quantity"
          >
            <LuPlus class="number-input-with-form-icon" aria-hidden="true" />
          </NumberInput.IncrementTrigger>
        </NumberInput.Root>
        <div class="number-input-with-form-actions">
          <button type="submit" class="number-input-with-form-button">
            Submit
          </button>
          <button type="reset" class="number-input-with-form-button-secondary">
            Reset
          </button>
        </div>
      </form>
      <output class="number-input-with-form-output">Submitted: {submitted.value}</output>
    </div>
  );
});
