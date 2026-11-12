import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { RadioGroup } from '@leve-ui/radio-group';
import styles from './controlled.css?inline';

export default component$(() => {
  useStyles$(styles);
  const selected = useSignal<string | null>('banana');

  return (
    <div class="radio-group-controlled-wrapper">
      <RadioGroup.Root bind:value={selected} class="radio-group-controlled-root">
        <RadioGroup.Label class="radio-group-controlled-label">Favorite fruit</RadioGroup.Label>
        <RadioGroup.Item value="apple" class="radio-group-controlled-item">
          <RadioGroup.Indicator class="radio-group-controlled-indicator" />
          Apple
        </RadioGroup.Item>
        <RadioGroup.Item value="banana" class="radio-group-controlled-item">
          <RadioGroup.Indicator class="radio-group-controlled-indicator" />
          Banana
        </RadioGroup.Item>
        <RadioGroup.Item value="orange" class="radio-group-controlled-item">
          <RadioGroup.Indicator class="radio-group-controlled-indicator" />
          Orange
        </RadioGroup.Item>
      </RadioGroup.Root>

      <div class="radio-group-controlled-controls">
        <button
          type="button"
          class="radio-group-controlled-button"
          onClick$={() => {
            selected.value = 'apple';
          }}
        >
          Select Apple
        </button>
        <button
          type="button"
          class="radio-group-controlled-button"
          onClick$={() => {
            selected.value = 'orange';
          }}
        >
          Select Orange
        </button>
        <button
          type="button"
          class="radio-group-controlled-button"
          onClick$={() => {
            selected.value = null;
          }}
        >
          Clear Selection
        </button>
      </div>

      <p class="radio-group-controlled-value">Current value: {selected.value ?? '(none)'}</p>
    </div>
  );
});
