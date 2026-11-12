import { component$, useStyles$ } from '@builder.io/qwik';
import { Switch } from '@leve-ui/switch';
import styles from './disabled.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Switch.Root disabled class="switch-disabled-root">
      <Switch.Label class="switch-disabled-label">Bluetooth</Switch.Label>
      <Switch.Control class="switch-disabled-control">
        <Switch.Thumb class="switch-disabled-thumb" />
      </Switch.Control>
    </Switch.Root>
  );
});
