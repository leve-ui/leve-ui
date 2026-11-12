import { component$, useStyles$ } from '@builder.io/qwik';
import { Checkbox } from '@leve-ui/checkbox';
import { LuCheck } from '@qwikest/icons/lucide';
import styles from './checked.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Checkbox.Root defaultChecked={true} class="checkbox-checked-root">
      <Checkbox.Control class="checkbox-checked-control">
        <Checkbox.Indicator class="checkbox-checked-indicator">
          <LuCheck class="checkbox-checked-icon" aria-hidden="true" />
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Label class="checkbox-checked-label">Subscribe to newsletter</Checkbox.Label>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
  );
});
