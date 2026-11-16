import { component$, useStyles$ } from '@builder.io/qwik';
import { Field } from '@leve-ui/field';
import { RadioGroup } from '@leve-ui/radio-group';
import styles from './with-field.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Field.Root hasDescription required class="radio-group-with-field-field">
      {/* RadioGroup.Label names the group; a <label> cannot */}
      <RadioGroup.Root defaultValue="standard" class="radio-group-with-field-root">
        <RadioGroup.Label class="radio-group-with-field-label">Shipping</RadioGroup.Label>
        <RadioGroup.Item value="standard" class="radio-group-with-field-item">
          <RadioGroup.Indicator class="radio-group-with-field-indicator" />
          Standard
        </RadioGroup.Item>
        <RadioGroup.Item value="express" class="radio-group-with-field-item">
          <RadioGroup.Indicator class="radio-group-with-field-indicator" />
          Express
        </RadioGroup.Item>
      </RadioGroup.Root>
      <Field.Description class="radio-group-with-field-description">
        Express arrives in one business day.
      </Field.Description>
    </Field.Root>
  );
});
