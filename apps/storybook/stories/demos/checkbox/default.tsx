import { component$, useStyles$ } from '@builder.io/qwik';
import { Checkbox } from '@leve-ui/checkbox';
import { LuCheck } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Checkbox.Root class="checkbox-default-root">
      <Checkbox.Control class="checkbox-default-control">
        <Checkbox.Indicator class="checkbox-default-indicator">
          <LuCheck class="checkbox-default-icon" aria-hidden="true" />
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Label class="checkbox-default-label">Accept terms and conditions</Checkbox.Label>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
  );
});
