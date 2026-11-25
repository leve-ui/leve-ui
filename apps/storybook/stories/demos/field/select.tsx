import { component$, useStyles$ } from '@builder.io/qwik';
import { Field } from '@leve-ui/field';
import styles from './select.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Field.Root hasDescription class="field-select">
      <Field.Label class="field-select-label">Country</Field.Label>
      <Field.Select class="field-select-select">
        <option value="">Select a country</option>
        <option value="jp">Japan</option>
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
      </Field.Select>
      <Field.Description class="field-select-description">
        Used for shipping and tax calculation.
      </Field.Description>
    </Field.Root>
  );
});
