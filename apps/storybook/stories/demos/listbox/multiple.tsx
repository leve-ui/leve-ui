import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Listbox } from '@leve-ui/listbox';
import { LuCheck } from '@qwikest/icons/lucide';
import styles from './multiple.css?inline';

const TOPPINGS = [
  { value: 'avocado', label: 'Avocado' },
  { value: 'bacon', label: 'Bacon' },
  { value: 'cheese', label: 'Cheese' },
  { value: 'lettuce', label: 'Lettuce' },
  { value: 'onion', label: 'Onion' },
  { value: 'truffle', label: 'Truffle', disabled: true },
  { value: 'tomato', label: 'Tomato' },
];

export default component$(() => {
  useStyles$(styles);
  const value = useSignal<string[]>([]);

  return (
    <div class="listbox-multiple">
      <span id="listbox-multiple-label" class="listbox-multiple-label">
        Toppings
      </span>
      <Listbox.Root
        multiple
        aria-labelledby="listbox-multiple-label"
        bind:value={value}
        class="listbox-multiple-list"
      >
        {TOPPINGS.map((topping) => (
          <Listbox.Item
            key={topping.value}
            value={topping.value}
            disabled={topping.disabled}
            class="listbox-multiple-item"
          >
            <Listbox.ItemText>{topping.label}</Listbox.ItemText>
            <Listbox.ItemIndicator class="listbox-multiple-indicator">
              <LuCheck aria-hidden="true" class="listbox-multiple-icon" />
            </Listbox.ItemIndicator>
          </Listbox.Item>
        ))}
      </Listbox.Root>
      <p class="listbox-multiple-status">
        Selected: {value.value.length > 0 ? value.value.join(', ') : 'none'}
      </p>
    </div>
  );
});
