import { component$, useStyles$ } from '@builder.io/qwik';
import { Checkbox } from '@leve-ui/checkbox';
import { Field } from '@leve-ui/field';
import { LuCheck } from '@qwikest/icons/lucide';
import styles from './with-field.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Field.Root hasDescription class="checkbox-with-field-field">
      <div class="checkbox-with-field-row">
        <Checkbox.Root class="checkbox-with-field-root">
          <Checkbox.Control class="checkbox-with-field-control">
            <Checkbox.Indicator class="checkbox-with-field-indicator">
              <LuCheck class="checkbox-with-field-icon" aria-hidden="true" />
            </Checkbox.Indicator>
          </Checkbox.Control>
          <Checkbox.HiddenInput />
        </Checkbox.Root>
        <Field.Label class="checkbox-with-field-label">Remember me</Field.Label>
      </div>
      <Field.Description class="checkbox-with-field-description">
        Save your session on this device for 30 days.
      </Field.Description>
    </Field.Root>
  );
});
