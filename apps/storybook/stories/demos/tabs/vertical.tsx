import { component$, useStyles$ } from '@builder.io/qwik';
import { Tabs } from '@leve-ui/tabs';
import styles from './vertical.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Tabs.Root orientation="vertical" defaultValue="tab1" class="tabs-vertical-root">
      <Tabs.List aria-label="Vertical navigation" class="tabs-vertical-list">
        <Tabs.Trigger value="tab1" class="tabs-vertical-trigger">
          Profile
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" class="tabs-vertical-trigger">
          Billing
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" class="tabs-vertical-trigger">
          Notifications
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" class="tabs-vertical-content">
        Profile details and public information.
      </Tabs.Content>
      <Tabs.Content value="tab2" class="tabs-vertical-content">
        Billing history and subscription plan.
      </Tabs.Content>
      <Tabs.Content value="tab3" class="tabs-vertical-content">
        Notification preferences and email alerts.
      </Tabs.Content>
    </Tabs.Root>
  );
});
