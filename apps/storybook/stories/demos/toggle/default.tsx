import { component$, useStyles$ } from '@builder.io/qwik';
import { Toggle } from '@leve-ui/toggle';
import { LuBold } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Toggle.Root class="toggle-default" aria-label="Bold">
      <LuBold class="toggle-default-icon" aria-hidden="true" />
    </Toggle.Root>
  );
});
