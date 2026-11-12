import { component$, useStyles$ } from '@builder.io/qwik';
import { Toggle } from '@leve-ui/toggle';
import { LuBold } from '@qwikest/icons/lucide';
import styles from './disabled.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Toggle.Root class="toggle-disabled" aria-label="Bold" disabled>
      <LuBold class="toggle-disabled-icon" aria-hidden="true" />
    </Toggle.Root>
  );
});
