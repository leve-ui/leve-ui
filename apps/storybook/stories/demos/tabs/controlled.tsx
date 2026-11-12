import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Tabs } from '@leve-ui/tabs';
import styles from './controlled.css?inline';

export default component$(() => {
  useStyles$(styles);

  const selected = useSignal<string | null>('tab1');

  return (
    <div class="tabs-controlled-wrapper">
      <div class="tabs-controlled-controls">
        <span class="tabs-controlled-label">External controls:</span>
        <button
          type="button"
          class="tabs-controlled-btn"
          onClick$={() => {
            selected.value = 'tab1';
          }}
        >
          Select Tab 1
        </button>
        <button
          type="button"
          class="tabs-controlled-btn"
          onClick$={() => {
            selected.value = 'tab2';
          }}
        >
          Select Tab 2
        </button>
      </div>

      <Tabs.Root bind:value={selected} class="tabs-controlled-root">
        <Tabs.List aria-label="Controlled tabs" class="tabs-controlled-list">
          <Tabs.Trigger value="tab1" class="tabs-controlled-trigger">
            First
          </Tabs.Trigger>
          <Tabs.Trigger value="tab2" class="tabs-controlled-trigger">
            Second
          </Tabs.Trigger>
          <Tabs.Trigger value="tab3" class="tabs-controlled-trigger">
            Third
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1" class="tabs-controlled-content">
          Panel 1 content (controlled by signal).
        </Tabs.Content>
        <Tabs.Content value="tab2" class="tabs-controlled-content">
          Panel 2 content (controlled by signal).
        </Tabs.Content>
        <Tabs.Content value="tab3" class="tabs-controlled-content">
          Panel 3 content (controlled by signal).
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
});
