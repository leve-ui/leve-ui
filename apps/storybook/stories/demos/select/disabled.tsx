import { component$, useStyles$ } from '@builder.io/qwik';
import { Select } from '@leve-ui/select';
import { LuCheck, LuChevronDown } from '@qwikest/icons/lucide';
import styles from './disabled.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Select.Root disabled defaultValue="starter" class="select-disabled">
      <Select.Label class="select-disabled-label">Plan</Select.Label>
      <Select.Trigger class="select-disabled-trigger">
        <Select.Value placeholder="Choose a plan" />
        <LuChevronDown aria-hidden="true" class="select-disabled-icon" />
      </Select.Trigger>
      <Select.Content sideOffset={4} class="select-disabled-content">
        <Select.List>
          <Select.Item value="free" class="select-disabled-item">
            <Select.ItemText>Free</Select.ItemText>
            <Select.ItemIndicator class="select-disabled-indicator">
              <LuCheck aria-hidden="true" class="select-disabled-icon" />
            </Select.ItemIndicator>
          </Select.Item>
          <Select.Item value="starter" class="select-disabled-item">
            <Select.ItemText>Starter</Select.ItemText>
            <Select.ItemIndicator class="select-disabled-indicator">
              <LuCheck aria-hidden="true" class="select-disabled-icon" />
            </Select.ItemIndicator>
          </Select.Item>
          <Select.Item value="pro" class="select-disabled-item">
            <Select.ItemText>Pro</Select.ItemText>
            <Select.ItemIndicator class="select-disabled-indicator">
              <LuCheck aria-hidden="true" class="select-disabled-icon" />
            </Select.ItemIndicator>
          </Select.Item>
        </Select.List>
      </Select.Content>
    </Select.Root>
  );
});
