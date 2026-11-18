import { component$, useComputed$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Combobox } from '@leve-ui/combobox';
import { LuCheck } from '@qwikest/icons/lucide';
import styles from './grouped.css?inline';

const TIMEZONES = [
  { region: 'Americas', zones: ['New York', 'Chicago', 'Los Angeles', 'São Paulo'] },
  { region: 'Europe', zones: ['London', 'Paris', 'Berlin'] },
  { region: 'Asia', zones: ['Tokyo', 'Seoul', 'Singapore'] },
];

export default component$(() => {
  useStyles$(styles);
  const query = useSignal('');
  const groups = useComputed$(() =>
    TIMEZONES.map((group) => ({
      ...group,
      zones: group.zones.filter((zone) => zone.toLowerCase().includes(query.value.toLowerCase())),
    })).filter((group) => group.zones.length > 0),
  );

  return (
    // autoHighlight: typing highlights the first match, so Enter selects it
    <Combobox.Root bind:inputValue={query} autoHighlight loop class="combobox-grouped">
      <Combobox.Label class="combobox-grouped-label">Time zone</Combobox.Label>
      <Combobox.Control class="combobox-grouped-control">
        <Combobox.Input placeholder="Type a city" class="combobox-grouped-input" />
      </Combobox.Control>
      <Combobox.Content sideOffset={4} class="combobox-grouped-content">
        <Combobox.List>
          {groups.value.map((group) => (
            <Combobox.Group key={group.region} class="combobox-grouped-group">
              <Combobox.GroupLabel class="combobox-grouped-group-label">
                {group.region}
              </Combobox.GroupLabel>
              {group.zones.map((zone) => (
                <Combobox.Item key={zone} value={zone} class="combobox-grouped-item">
                  <Combobox.ItemText>{zone}</Combobox.ItemText>
                  <Combobox.ItemIndicator>
                    <LuCheck aria-hidden="true" class="combobox-grouped-icon" />
                  </Combobox.ItemIndicator>
                </Combobox.Item>
              ))}
            </Combobox.Group>
          ))}
        </Combobox.List>
        {groups.value.length === 0 && (
          <Combobox.Empty class="combobox-grouped-empty">No cities found</Combobox.Empty>
        )}
      </Combobox.Content>
    </Combobox.Root>
  );
});
