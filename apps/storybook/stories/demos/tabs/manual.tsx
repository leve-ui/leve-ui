import { component$, useStyles$ } from '@builder.io/qwik';
import { Tabs } from '@leve-ui/tabs';
import styles from './manual.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Tabs.Root activationMode="manual" defaultValue="tab1" class="tabs-manual-root">
      <Tabs.List aria-label="Manual activation tabs" class="tabs-manual-list">
        <Tabs.Trigger value="tab1" class="tabs-manual-trigger">
          First
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" class="tabs-manual-trigger">
          Second
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" class="tabs-manual-trigger">
          Third
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1" class="tabs-manual-content">
        Panel 1: In manual mode, arrow keys move focus without changing the active panel.
      </Tabs.Content>
      <Tabs.Content value="tab2" class="tabs-manual-content">
        Panel 2: Press Enter or Space to activate the focused tab.
      </Tabs.Content>
      <Tabs.Content value="tab3" class="tabs-manual-content">
        Panel 3: Active panel updated.
      </Tabs.Content>
    </Tabs.Root>
  );
});
