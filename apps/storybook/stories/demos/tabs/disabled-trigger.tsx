import { component$, useStyles$ } from '@builder.io/qwik';
import { Tabs } from '@leve-ui/tabs';
import styles from './disabled-trigger.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Tabs.Root defaultValue="tab1" class="tabs-disabled-trigger-root">
      <Tabs.List aria-label="Tabs with disabled item" class="tabs-disabled-trigger-list">
        <Tabs.Trigger value="tab1" class="tabs-disabled-trigger-trigger">
          Available
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled class="tabs-disabled-trigger-trigger">
          Disabled
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" class="tabs-disabled-trigger-trigger">
          Also Available
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" class="tabs-disabled-trigger-content">
        Panel 1: Navigating with arrow keys skips the disabled tab.
      </Tabs.Content>
      <Tabs.Content value="tab2" class="tabs-disabled-trigger-content">
        Panel 2: This panel cannot be selected by the user.
      </Tabs.Content>
      <Tabs.Content value="tab3" class="tabs-disabled-trigger-content">
        Panel 3: Reached directly from the first tab.
      </Tabs.Content>
    </Tabs.Root>
  );
});
