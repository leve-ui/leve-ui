import { component$, useStyles$ } from '@builder.io/qwik';
import { Listbox } from '@leve-ui/listbox';
import { LuCheck } from '@qwikest/icons/lucide';
import styles from './disabled.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <div class="listbox-disabled">
      <span id="listbox-disabled-label" class="listbox-disabled-label">
        Fruit (disabled)
      </span>
      <Listbox.Root
        disabled
        defaultValue={['apple']}
        aria-labelledby="listbox-disabled-label"
        class="listbox-disabled-list"
      >
        <Listbox.Item value="apple" class="listbox-disabled-item">
          <Listbox.ItemText>Apple</Listbox.ItemText>
          <Listbox.ItemIndicator class="listbox-disabled-indicator">
            <LuCheck aria-hidden="true" class="listbox-disabled-icon" />
          </Listbox.ItemIndicator>
        </Listbox.Item>
        <Listbox.Item value="banana" class="listbox-disabled-item">
          <Listbox.ItemText>Banana</Listbox.ItemText>
          <Listbox.ItemIndicator class="listbox-disabled-indicator">
            <LuCheck aria-hidden="true" class="listbox-disabled-icon" />
          </Listbox.ItemIndicator>
        </Listbox.Item>
        <Listbox.Item value="cherry" class="listbox-disabled-item">
          <Listbox.ItemText>Cherry</Listbox.ItemText>
          <Listbox.ItemIndicator class="listbox-disabled-indicator">
            <LuCheck aria-hidden="true" class="listbox-disabled-icon" />
          </Listbox.ItemIndicator>
        </Listbox.Item>
      </Listbox.Root>
    </div>
  );
});
