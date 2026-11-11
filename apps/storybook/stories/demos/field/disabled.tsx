import { component$, useStyles$ } from '@builder.io/qwik';
import { Field } from '@leve-ui/field';

const styles = `
  .field-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 320px;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .field-label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }

  .field-input {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
  }

  .field-input:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  /* Style elements when disabled */
  .field[data-disabled] {
    opacity: 0.6;
  }

  .field-input[data-disabled] {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }

  .field-button {
    padding: 6px 12px;
    background-color: #e5e7eb;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    cursor: pointer;
  }

  .field-button:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
`;

export default component$(() => {
  useStyles$(styles);

  return (
    <div class="field-wrapper">
      <button type="button" class="field-button">
        Before
      </button>
      <Field.Root disabled class="field">
        <Field.Label class="field-label">Name</Field.Label>
        <Field.Input class="field-input" />
      </Field.Root>
      <button type="button" class="field-button">
        After
      </button>
    </div>
  );
});
