import { component$, useStyles$ } from '@builder.io/qwik';
import { Collapsible } from '@leve-ui/collapsible';
import { LuChevronDown } from '@qwikest/icons/lucide';
import styles from './open.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Collapsible.Root defaultOpen class="collapsible-open-root">
      <Collapsible.Trigger class="collapsible-open-trigger">
        <span>What is leve-ui?</span>
        <LuChevronDown class="collapsible-open-chevron" aria-hidden="true" />
      </Collapsible.Trigger>
      <Collapsible.Content class="collapsible-open-content">
        A headless, accessible UI component library built for Qwik.
      </Collapsible.Content>
    </Collapsible.Root>
  );
});
