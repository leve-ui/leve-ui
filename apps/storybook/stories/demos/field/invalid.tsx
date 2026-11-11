import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
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

  /* Style elements when invalid */
  .field-input[data-invalid] {
    border-color: #dc2626;
  }

  .field-input[data-invalid]:focus-visible {
    outline: 2px solid #dc2626;
    outline-offset: 2px;
  }

  .field-error-message {
    font-size: 12px;
    color: #dc2626;
  }
`;

export default component$(() => {
  useStyles$(styles);

  const value = useSignal('leve');

  return (
    <Field.Root invalid={value.value.trim() === ''} required class="field">
      <Field.Label class="field-label">Username</Field.Label>
      <Field.Input bind:value={value} class="field-input" />
      <Field.ErrorMessage class="field-error-message">Username is required.</Field.ErrorMessage>
    </Field.Root>
  );
});
