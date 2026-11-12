import { component$, useStyles$ } from '@builder.io/qwik';
import { Tabs } from '@leve-ui/tabs';

const styles = `
  .tabs-root {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
  }

  .tabs-list {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    gap: 8px;
  }

  .tabs-trigger {
    padding: 8px 16px;
    border: none;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: #4b5563;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: color 150ms ease, border-color 150ms ease;
  }

  /* Active state */
  .tabs-trigger[data-state="active"] {
    color: #2563eb;
    border-bottom-color: #2563eb;
  }

  /* Focus indicator */
  .tabs-trigger:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: -2px;
  }

  /* Disabled state */
  .tabs-trigger:disabled,
  .tabs-trigger[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .tabs-content {
    padding: 16px 0;
    font-size: 14px;
    color: #1f2937;
  }

  .tabs-content:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
`;

export default component$(() => {
  useStyles$(styles);

  return (
    <Tabs.Root defaultValue="tab1" class="tabs-root">
      <Tabs.List aria-label="Account settings" class="tabs-list">
        <Tabs.Trigger value="tab1" class="tabs-trigger">
          Account
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" class="tabs-trigger">
          Password
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" class="tabs-trigger">
          Settings
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" class="tabs-content">
        Manage your account details and profile information.
      </Tabs.Content>
      <Tabs.Content value="tab2" class="tabs-content">
        Change your password and manage authentication settings.
      </Tabs.Content>
      <Tabs.Content value="tab3" class="tabs-content">
        Configure application preferences and notification options.
      </Tabs.Content>
    </Tabs.Root>
  );
});
