import { component$, useStyles$ } from '@builder.io/qwik';
import { Tabs } from '@leve-ui/tabs';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Tabs.Root defaultValue="tab1" class="tabs-default-root">
      <Tabs.List aria-label="Account settings" class="tabs-default-list">
        <Tabs.Trigger value="tab1" class="tabs-default-trigger">
          Account
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" class="tabs-default-trigger">
          Password
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" class="tabs-default-trigger">
          Settings
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" class="tabs-default-content">
        Manage your account details and profile information.
      </Tabs.Content>
      <Tabs.Content value="tab2" class="tabs-default-content">
        Change your password and manage authentication settings.
      </Tabs.Content>
      <Tabs.Content value="tab3" class="tabs-default-content">
        Configure application preferences and notification options.
      </Tabs.Content>
    </Tabs.Root>
  );
});
