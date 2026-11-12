import { component$, useStyles$ } from '@builder.io/qwik';
import { Checkbox } from '@leve-ui/checkbox';
import { LuCheck } from '@qwikest/icons/lucide';
import styles from './disabled.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Checkbox.Root disabled class="checkbox-disabled-root">
      <Checkbox.Control class="checkbox-disabled-control">
        <Checkbox.Indicator class="checkbox-disabled-indicator">
          <LuCheck class="checkbox-disabled-icon" aria-hidden="true" />
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Label class="checkbox-disabled-label">Disabled option</Checkbox.Label>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
  );
});
