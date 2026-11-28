import { component$, useStyles$ } from '@builder.io/qwik';
import { Select } from '@leve-ui/select';
import { LuCheck, LuChevronDown } from '@qwikest/icons/lucide';
import styles from './grouped.css?inline';

const TIMEZONES = [
  { region: 'Americas', zones: ['New York', 'Chicago', 'Los Angeles'] },
  { region: 'Europe', zones: ['London', 'Paris', 'Berlin'] },
  { region: 'Asia', zones: ['Tokyo', 'Seoul', 'Singapore'] },
];

export default component$(() => {
  useStyles$(styles);

  return (
    <Select.Root loop class="select-grouped">
      <Select.Label class="select-grouped-label">Time zone</Select.Label>
      <Select.Trigger class="select-grouped-trigger">
        <Select.Value placeholder="Select a time zone" class="select-grouped-value" />
        <LuChevronDown aria-hidden="true" class="select-grouped-icon" />
      </Select.Trigger>
      <Select.Content sideOffset={4} class="select-grouped-content">
        <Select.List>
          {TIMEZONES.map((group) => (
            <Select.Group key={group.region}>
              <Select.GroupLabel class="select-grouped-group-label">
                {group.region}
              </Select.GroupLabel>
              {group.zones.map((zone) => (
                <Select.Item key={zone} value={zone} class="select-grouped-item">
                  <Select.ItemText>{zone}</Select.ItemText>
                  <Select.ItemIndicator class="select-grouped-indicator">
                    <LuCheck aria-hidden="true" class="select-grouped-icon" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Group>
          ))}
        </Select.List>
      </Select.Content>
    </Select.Root>
  );
});
