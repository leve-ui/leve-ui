import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Listbox } from '@leve-ui/listbox';
import { LuCheck } from '@qwikest/icons/lucide';
import styles from './grouped.css?inline';

const TIMEZONES = [
  { region: 'Americas', zones: ['New York', 'Chicago', 'Los Angeles'] },
  { region: 'Europe', zones: ['London', 'Paris', 'Berlin'] },
  { region: 'Asia', zones: ['Tokyo', 'Seoul', 'Singapore'] },
];

export default component$(() => {
  useStyles$(styles);
  const value = useSignal<string[]>([]);

  return (
    <div class="listbox-grouped">
      <span id="listbox-grouped-label" class="listbox-grouped-label">
        Time zone
      </span>
      {/* loop wraps arrow navigation from the last option back to the first */}
      <Listbox.Root
        loop
        aria-labelledby="listbox-grouped-label"
        bind:value={value}
        class="listbox-grouped-list"
      >
        {TIMEZONES.map((group) => (
          <Listbox.Group key={group.region} class="listbox-grouped-group">
            <Listbox.GroupLabel class="listbox-grouped-group-label">
              {group.region}
            </Listbox.GroupLabel>
            {group.zones.map((zone) => (
              <Listbox.Item key={zone} value={zone} class="listbox-grouped-item">
                <Listbox.ItemText>{zone}</Listbox.ItemText>
                <Listbox.ItemIndicator class="listbox-grouped-indicator">
                  <LuCheck aria-hidden="true" class="listbox-grouped-icon" />
                </Listbox.ItemIndicator>
              </Listbox.Item>
            ))}
          </Listbox.Group>
        ))}
      </Listbox.Root>
      <p class="listbox-grouped-status">Selected: {value.value[0] ?? 'none'}</p>
    </div>
  );
});
