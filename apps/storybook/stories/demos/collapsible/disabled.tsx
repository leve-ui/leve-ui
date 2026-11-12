import { component$, useStyles$ } from '@builder.io/qwik';
import { Collapsible } from '@leve-ui/collapsible';
import { LuChevronDown } from '@qwikest/icons/lucide';
import styles from './disabled.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Collapsible.Root disabled class="collapsible-disabled-root">
      <Collapsible.Trigger class="collapsible-disabled-trigger">
        <span>Disabled section</span>
        <LuChevronDown class="collapsible-disabled-chevron" aria-hidden="true" />
      </Collapsible.Trigger>
      <Collapsible.Content class="collapsible-disabled-content">
        This content cannot be toggled because the collapsible is disabled.
      </Collapsible.Content>
    </Collapsible.Root>
  );
});
