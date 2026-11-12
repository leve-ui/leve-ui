import { component$, useStyles$ } from '@builder.io/qwik';
import { RadioGroup } from '@leve-ui/radio-group';

const styles = `
  .radio-group-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .radio-group-external-button {
    padding: 6px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: #ffffff;
    font-size: 14px;
    cursor: pointer;
  }

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

  /* Disabled state */
  .radio-group-item:disabled,
  .radio-group-item[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default component$(() => {
  useStyles$(styles);

  return (
    <div class="radio-group-container">
      <button type="button" class="radio-group-external-button">
        Before
      </button>
      <RadioGroup.Root class="radio-group-root">
        <RadioGroup.Label class="radio-group-label">Plan</RadioGroup.Label>
        <RadioGroup.Item value="free" class="radio-group-item">
          <RadioGroup.Indicator class="radio-group-indicator" />
          Free
        </RadioGroup.Item>
        <RadioGroup.Item value="starter" class="radio-group-item">
          <RadioGroup.Indicator class="radio-group-indicator" />
          Starter
        </RadioGroup.Item>
        <RadioGroup.Item value="pro" class="radio-group-item">
          <RadioGroup.Indicator class="radio-group-indicator" />
          Pro
        </RadioGroup.Item>
      </RadioGroup.Root>
      <button type="button" class="radio-group-external-button">
        After
      </button>
    </div>
  );
});
