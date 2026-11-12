import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { RadioGroup } from '@leve-ui/radio-group';

const styles = `
  .radio-group-root {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .radio-group-label {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
  }

  .radio-group-item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: none;
    background: transparent;
    padding: 4px 0;
    font-size: 14px;
    color: #374151;
    cursor: pointer;
  }

  .radio-group-indicator {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 9999px;
    border: 2px solid #9ca3af;
    background-color: #ffffff;
    box-sizing: border-box;
  }

  /* Checked indicator */
  .radio-group-indicator[data-state="checked"] {
    border-color: #2563eb;
  }

  .radio-group-indicator[data-state="checked"]::after {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 9999px;
    background-color: #2563eb;
  }

  /* Focus indicator */
  .radio-group-item:focus-visible .radio-group-indicator {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  .radio-group-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
  }

  .radio-group-button {
    padding: 6px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background-color: #ffffff;
    font-size: 14px;
    cursor: pointer;
  }

  .radio-group-value {
    margin-top: 8px;
    font-size: 14px;
    color: #4b5563;
  }
`;

export default component$(() => {
  useStyles$(styles);
  const selected = useSignal<string | null>('banana');

  return (
    <div>
      <RadioGroup.Root bind:value={selected} class="radio-group-root">
        <RadioGroup.Label class="radio-group-label">Favorite fruit</RadioGroup.Label>
        <RadioGroup.Item value="apple" class="radio-group-item">
          <RadioGroup.Indicator class="radio-group-indicator" />
          Apple
        </RadioGroup.Item>
        <RadioGroup.Item value="banana" class="radio-group-item">
          <RadioGroup.Indicator class="radio-group-indicator" />
          Banana
        </RadioGroup.Item>
        <RadioGroup.Item value="orange" class="radio-group-item">
          <RadioGroup.Indicator class="radio-group-indicator" />
          Orange
        </RadioGroup.Item>
      </RadioGroup.Root>

      <div class="radio-group-controls">
        <button
          type="button"
          class="radio-group-button"
          onClick$={() => {
            selected.value = 'apple';
          }}
        >
          Select Apple
        </button>
        <button
          type="button"
          class="radio-group-button"
          onClick$={() => {
            selected.value = 'orange';
          }}
        >
          Select Orange
        </button>
        <button
          type="button"
          class="radio-group-button"
          onClick$={() => {
            selected.value = null;
          }}
        >
          Clear Selection
        </button>
      </div>

      <p class="radio-group-value">Current value: {selected.value ?? '(none)'}</p>
    </div>
  );
});
