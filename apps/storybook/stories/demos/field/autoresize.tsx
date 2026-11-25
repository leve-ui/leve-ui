import { component$, useStyles$ } from '@builder.io/qwik';
import { Field } from '@leve-ui/field';
import styles from './autoresize.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Field.Root hasDescription class="field-autoresize">
      <Field.Label class="field-autoresize-label">Notes</Field.Label>
      <Field.Textarea
        autoresize
        rows={2}
        placeholder="Type multiple lines to expand..."
        class="field-autoresize-textarea"
      />
      <Field.Description class="field-autoresize-description">
        Grows automatically as you type.
      </Field.Description>
    </Field.Root>
  );
});
