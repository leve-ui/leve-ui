import { component$, useStyles$ } from '@builder.io/qwik';
import { Tabs } from '@leve-ui/tabs';

const styles = `
  .tabs-root {
    display: flex;
    flex-direction: row;
    width: 100%;
    max-width: 500px;
    gap: 16px;
  }

  .tabs-list {
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e5e7eb;
    padding-right: 8px;
    gap: 4px;
    min-width: 120px;
  }

  .tabs-trigger {
    padding: 8px 12px;
    border: none;
    border-left: 2px solid transparent;
    background: transparent;
    color: #4b5563;
    font-size: 14px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    transition: color 150ms ease, border-color 150ms ease;
  }

  /* Active state */
  .tabs-trigger[data-state="active"] {
    color: #2563eb;
    border-left-color: #2563eb;
    background-color: #eff6ff;
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
    flex: 1;
    padding: 8px;
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
    <Tabs.Root orientation="vertical" defaultValue="tab1" class="tabs-root">
      <Tabs.List aria-label="Vertical navigation" class="tabs-list">
        <Tabs.Trigger value="tab1" class="tabs-trigger">
          Profile
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" class="tabs-trigger">
          Billing
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" class="tabs-trigger">
          Notifications
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" class="tabs-content">
        Profile details and public information.
      </Tabs.Content>
      <Tabs.Content value="tab2" class="tabs-content">
        Billing history and subscription plan.
      </Tabs.Content>
      <Tabs.Content value="tab3" class="tabs-content">
        Notification preferences and email alerts.
      </Tabs.Content>
    </Tabs.Root>
  );
});
