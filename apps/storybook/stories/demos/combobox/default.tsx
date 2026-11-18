import { component$, useComputed$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Combobox } from '@leve-ui/combobox';
import { LuCheck, LuChevronDown, LuX } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

const FRUITS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'lemon', label: 'Lemon', disabled: true },
  { value: 'orange', label: 'Orange' },
  { value: 'peach', label: 'Peach' },
];

export default component$(() => {
  useStyles$(styles);
  const query = useSignal('');
  const value = useSignal<string | null>(null);
  // Filtering is yours. Filter only while the user types, so the list shows every fruit again
  // when it opens after a selection
  const items = useComputed$(() =>
    FRUITS.filter((fruit) => fruit.label.toLowerCase().includes(query.value.toLowerCase())),
  );

  return (
    <div class="combobox-default">
      <Combobox.Root
        bind:value={value}
        onInputValueChange$={(text, { reason }) => {
          query.value = reason === 'input' ? text : '';
        }}
        openOnClick
        class="combobox-default-root"
      >
        <Combobox.Label class="combobox-default-label">Fruit</Combobox.Label>
        <Combobox.Control class="combobox-default-control">
          <Combobox.Input placeholder="Search fruits" class="combobox-default-input" />
          <Combobox.ClearTrigger aria-label="Clear" class="combobox-default-clear">
            <LuX aria-hidden="true" class="combobox-default-icon" />
          </Combobox.ClearTrigger>
          <Combobox.Trigger aria-label="Show fruits" class="combobox-default-trigger">
            <LuChevronDown aria-hidden="true" class="combobox-default-icon" />
          </Combobox.Trigger>
        </Combobox.Control>
        <Combobox.Content sideOffset={4} class="combobox-default-content">
          <Combobox.List class="combobox-default-list">
            {items.value.map((fruit) => (
              <Combobox.Item
                key={fruit.value}
                value={fruit.value}
                disabled={fruit.disabled}
                class="combobox-default-item"
              >
                <Combobox.ItemText>{fruit.label}</Combobox.ItemText>
                <Combobox.ItemIndicator class="combobox-default-indicator">
                  <LuCheck aria-hidden="true" class="combobox-default-icon" />
                </Combobox.ItemIndicator>
              </Combobox.Item>
            ))}
          </Combobox.List>
          {items.value.length === 0 && (
            <Combobox.Empty class="combobox-default-empty">No fruits found</Combobox.Empty>
          )}
        </Combobox.Content>
      </Combobox.Root>
      <p class="combobox-default-status">Selected: {value.value ?? 'none'}</p>
    </div>
  );
});
