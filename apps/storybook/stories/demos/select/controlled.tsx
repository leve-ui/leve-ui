import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Select } from '@leve-ui/select';
import { LuCheck, LuChevronDown } from '@qwikest/icons/lucide';
import styles from './controlled.css?inline';

export default component$(() => {
  useStyles$(styles);
  const selected = useSignal<string | null>('banana');

  return (
    <div class="select-controlled">
      <Select.Root bind:value={selected} class="select-controlled-root">
        <Select.Label class="select-controlled-label">Favorite fruit</Select.Label>
        <Select.Trigger class="select-controlled-trigger">
          <Select.Value placeholder="Select a fruit" class="select-controlled-value" />
          <LuChevronDown aria-hidden="true" class="select-controlled-icon" />
        </Select.Trigger>
        <Select.Content sideOffset={4} class="select-controlled-content">
          <Select.List>
            <Select.Item value="apple" class="select-controlled-item">
              <Select.ItemText>Apple</Select.ItemText>
              <Select.ItemIndicator class="select-controlled-indicator">
                <LuCheck aria-hidden="true" class="select-controlled-icon" />
              </Select.ItemIndicator>
            </Select.Item>
            <Select.Item value="banana" class="select-controlled-item">
              <Select.ItemText>Banana</Select.ItemText>
              <Select.ItemIndicator class="select-controlled-indicator">
                <LuCheck aria-hidden="true" class="select-controlled-icon" />
              </Select.ItemIndicator>
            </Select.Item>
            <Select.Item value="orange" class="select-controlled-item">
              <Select.ItemText>Orange</Select.ItemText>
              <Select.ItemIndicator class="select-controlled-indicator">
                <LuCheck aria-hidden="true" class="select-controlled-icon" />
              </Select.ItemIndicator>
            </Select.Item>
          </Select.List>
        </Select.Content>
      </Select.Root>

      <div class="select-controlled-controls">
        <button
          type="button"
          class="select-controlled-button"
          onClick$={() => {
            selected.value = 'apple';
          }}
        >
          Select Apple
        </button>
        <button
          type="button"
          class="select-controlled-button"
          onClick$={() => {
            selected.value = 'orange';
          }}
        >
          Select Orange
        </button>
        <button
          type="button"
          class="select-controlled-button"
          onClick$={() => {
            selected.value = null;
          }}
        >
          Clear Selection
        </button>
      </div>

      <p class="select-controlled-status">Current value: {selected.value ?? 'none'}</p>
    </div>
  );
});
