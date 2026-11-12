import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Tabs } from '@leve-ui/tabs';

const styles = `
  .tabs-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 400px;
  }

  .tabs-controls {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .tabs-btn {
    padding: 6px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: #ffffff;
    font-size: 13px;
    cursor: pointer;
  }

  .tabs-btn:hover {
    background: #f9fafb;
  }

  .tabs-root {
    display: flex;
    flex-direction: column;
    width: 100%;
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

  const selected = useSignal<string | null>('tab1');

  return (
    <div class="tabs-wrapper">
      <div class="tabs-controls">
        <span>External controls:</span>
        <button
          type="button"
          class="tabs-btn"
          onClick$={() => {
            selected.value = 'tab1';
          }}
        >
          Select Tab 1
        </button>
        <button
          type="button"
          class="tabs-btn"
          onClick$={() => {
            selected.value = 'tab2';
          }}
        >
          Select Tab 2
        </button>
      </div>

      <Tabs.Root bind:value={selected} class="tabs-root">
        <Tabs.List aria-label="Controlled tabs" class="tabs-list">
          <Tabs.Trigger value="tab1" class="tabs-trigger">
            First
          </Tabs.Trigger>
          <Tabs.Trigger value="tab2" class="tabs-trigger">
            Second
          </Tabs.Trigger>
          <Tabs.Trigger value="tab3" class="tabs-trigger">
            Third
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1" class="tabs-content">
          Panel 1 content (controlled by signal).
        </Tabs.Content>
        <Tabs.Content value="tab2" class="tabs-content">
          Panel 2 content (controlled by signal).
        </Tabs.Content>
        <Tabs.Content value="tab3" class="tabs-content">
          Panel 3 content (controlled by signal).
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
});
