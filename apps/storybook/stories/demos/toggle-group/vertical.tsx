import { component$, useStyles$ } from '@builder.io/qwik';
import { ToggleGroup } from '@leve-ui/toggle-group';

const styles = `
  .toggle-group {
    display: inline-flex;
    flex-direction: column;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    background-color: #ffffff;
    padding: 2px;
    gap: 2px;
  }

  .toggle-group-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    border-radius: 4px;
    border: none;
    background-color: transparent;
    color: #374151;
    cursor: pointer;
    user-select: none;
    transition: background-color 150ms ease, color 150ms ease;
  }

  .toggle-group-item:hover:not(:disabled) {
    background-color: #f3f4f6;
    color: #111827;
  }

  /* Pressed state */
  .toggle-group-item[data-state="on"] {
    background-color: #111827;
    color: #ffffff;
  }

  .toggle-group-item[data-state="on"]:hover:not(:disabled) {
    background-color: #1f2937;
  }

  /* Focus indicator */
  .toggle-group-item:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  /* Disabled state */
  .toggle-group-item:disabled,
  .toggle-group-item[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default component$(() => {
  useStyles$(styles);

  return (
    <ToggleGroup.Root
      orientation="vertical"
      aria-label="Vertical text alignment"
      defaultValue={['top']}
      class="toggle-group"
    >
      <ToggleGroup.Item value="top" class="toggle-group-item" aria-label="Align top">
        Top
      </ToggleGroup.Item>
      <ToggleGroup.Item value="middle" class="toggle-group-item" aria-label="Align middle">
        Middle
      </ToggleGroup.Item>
      <ToggleGroup.Item value="bottom" class="toggle-group-item" aria-label="Align bottom">
        Bottom
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
});
