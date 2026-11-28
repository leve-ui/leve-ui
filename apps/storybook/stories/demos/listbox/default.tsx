import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Listbox } from '@leve-ui/listbox';
import { LuCheck } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

const FRUITS = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry', disabled: true },
  { value: 'blackberry', label: 'Blackberry' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'peach', label: 'Peach' },
];

export default component$(() => {
  useStyles$(styles);
  const value = useSignal<string[]>([]);

  return (
    <div class="listbox-default">
      <span id="listbox-default-label" class="listbox-default-label">
        Fruit
      </span>
      <Listbox.Root
        aria-labelledby="listbox-default-label"
        bind:value={value}
        class="listbox-default-list"
      >
        {FRUITS.map((fruit) => (
          <Listbox.Item
            key={fruit.value}
            value={fruit.value}
            disabled={fruit.disabled}
            class="listbox-default-item"
          >
            <Listbox.ItemText>{fruit.label}</Listbox.ItemText>
            <Listbox.ItemIndicator class="listbox-default-indicator">
              <LuCheck aria-hidden="true" class="listbox-default-icon" />
            </Listbox.ItemIndicator>
          </Listbox.Item>
        ))}
      </Listbox.Root>
      <p class="listbox-default-status">Selected: {value.value[0] ?? 'none'}</p>
    </div>
  );
});
