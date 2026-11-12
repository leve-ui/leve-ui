import { component$, useStyles$ } from '@builder.io/qwik';
import { Collapsible } from '@leve-ui/collapsible';
import { LuChevronDown } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Collapsible.Root class="collapsible-default-root">
      <Collapsible.Trigger class="collapsible-default-trigger">
        <span>Can I use this component in my project?</span>
        <LuChevronDown class="collapsible-default-chevron" aria-hidden="true" />
      </Collapsible.Trigger>
      <Collapsible.Content class="collapsible-default-content">
        Yes! It is headless, fully accessible, and styled with plain CSS.
      </Collapsible.Content>
    </Collapsible.Root>
  );
});
