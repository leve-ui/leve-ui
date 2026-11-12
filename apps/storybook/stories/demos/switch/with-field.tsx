import { component$, useStyles$ } from '@builder.io/qwik';
import { Field } from '@leve-ui/field';
import { Switch } from '@leve-ui/switch';
import styles from './with-field.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Field.Root hasDescription class="switch-with-field-field">
      <div class="switch-with-field-row">
        <Field.Label class="switch-with-field-label">Dark mode</Field.Label>
        <Switch.Root class="switch-with-field-root">
          <Switch.Control class="switch-with-field-control">
            <Switch.Thumb class="switch-with-field-thumb" />
          </Switch.Control>
        </Switch.Root>
      </div>
      <Field.Description class="switch-with-field-description">
        Use a dark color scheme.
      </Field.Description>
    </Field.Root>
  );
});
