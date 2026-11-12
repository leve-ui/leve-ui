import { component$, useStyles$ } from '@builder.io/qwik';
import { Toggle } from '@leve-ui/toggle';
import { LuBold } from '@qwikest/icons/lucide';
import styles from './pressed.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Toggle.Root class="toggle-pressed" aria-label="Bold" defaultPressed>
      <LuBold class="toggle-pressed-icon" aria-hidden="true" />
    </Toggle.Root>
  );
});
