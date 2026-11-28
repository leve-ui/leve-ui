import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Select } from '@leve-ui/select';
import { LuCheck, LuChevronDown } from '@qwikest/icons/lucide';
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
  const value = useSignal<string | null>(null);

  return (
    <div class="select-default">
      <Select.Root bind:value={value} class="select-default-root">
        <Select.Label class="select-default-label">Fruit</Select.Label>
        <Select.Trigger class="select-default-trigger">
          <Select.Value placeholder="Select a fruit" class="select-default-value" />
          <LuChevronDown aria-hidden="true" class="select-default-icon" />
        </Select.Trigger>
        <Select.Content sideOffset={4} class="select-default-content">
          <Select.List>
            {FRUITS.map((fruit) => (
              <Select.Item
                key={fruit.value}
                value={fruit.value}
                disabled={fruit.disabled}
                class="select-default-item"
              >
                <Select.ItemText>{fruit.label}</Select.ItemText>
                <Select.ItemIndicator class="select-default-indicator">
                  <LuCheck aria-hidden="true" class="select-default-icon" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.List>
        </Select.Content>
      </Select.Root>
      <p class="select-default-status">Selected: {value.value ?? 'none'}</p>
    </div>
  );
});
