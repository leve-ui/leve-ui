import { component$, useStyles$ } from '@builder.io/qwik';
import { Fieldset } from '@leve-ui/fieldset';
import { Switch } from '@leve-ui/switch';
import styles from './disabled.css?inline';

export default component$(() => {
  useStyles$(styles);

  // A disabled Fieldset also disables the leve-ui controls inside it
  return (
    <Fieldset.Root disabled class="fieldset-disabled">
      <Fieldset.Legend class="fieldset-disabled-legend">Notifications</Fieldset.Legend>
      <Switch.Root defaultChecked class="fieldset-disabled-switch">
        <Switch.Label class="fieldset-disabled-label">Email</Switch.Label>
        <Switch.Control class="fieldset-disabled-control">
          <Switch.Thumb class="fieldset-disabled-thumb" />
        </Switch.Control>
      </Switch.Root>
      <Switch.Root class="fieldset-disabled-switch">
        <Switch.Label class="fieldset-disabled-label">Push</Switch.Label>
        <Switch.Control class="fieldset-disabled-control">
          <Switch.Thumb class="fieldset-disabled-thumb" />
        </Switch.Control>
      </Switch.Root>
    </Fieldset.Root>
  );
});
