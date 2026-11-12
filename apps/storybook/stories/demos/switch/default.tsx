import { component$, useStyles$ } from '@builder.io/qwik';
import { Switch } from '@leve-ui/switch';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Switch.Root class="switch-default-root">
      <Switch.Label class="switch-default-label">Airplane mode</Switch.Label>
      <Switch.Control class="switch-default-control">
        <Switch.Thumb class="switch-default-thumb" />
      </Switch.Control>
    </Switch.Root>
  );
});
