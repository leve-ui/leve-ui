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

  .field-textarea {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    min-height: 80px;
    resize: vertical;
  }

  .field-textarea:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  .field-description {
    font-size: 12px;
    color: #6b7280;
  }
`;

export default component$(() => {
  useStyles$(styles);

  return (
    <Field.Root hasDescription class="field">
      <Field.Label class="field-label">Bio</Field.Label>
      <Field.Textarea class="field-textarea" />
      <Field.Description class="field-description">Tell us about yourself.</Field.Description>
    </Field.Root>
  );
});
