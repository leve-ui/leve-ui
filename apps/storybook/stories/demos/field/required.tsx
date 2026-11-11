import { component$, useStyles$ } from '@builder.io/qwik';
import { Field } from '@leve-ui/field';

const styles = `
  .field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: 320px;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .field-label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }

  /* Indicate required field with an asterisk */
  .field-label[data-required]::after {
    content: ' *';
    color: #dc2626;
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
`;

export default component$(() => {
  useStyles$(styles);

  return (
    <Field.Root required class="field">
      <Field.Label class="field-label">Full name</Field.Label>
      <Field.Input class="field-input" />
    </Field.Root>
  );
});
