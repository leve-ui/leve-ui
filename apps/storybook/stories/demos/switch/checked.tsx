import { component$, useStyles$ } from '@builder.io/qwik';
import { Switch } from '@leve-ui/switch';
import styles from './checked.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Switch.Root defaultChecked class="switch-checked-root">
      <Switch.Label class="switch-checked-label">Wi-Fi</Switch.Label>
      <Switch.Control class="switch-checked-control">
        <Switch.Thumb class="switch-checked-thumb" />
      </Switch.Control>
    </Switch.Root>
  );
});
