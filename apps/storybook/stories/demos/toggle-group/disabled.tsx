import { component$, useStyles$ } from '@builder.io/qwik';
import { ToggleGroup } from '@leve-ui/toggle-group';
import { LuAlignCenter, LuAlignLeft, LuAlignRight } from '@qwikest/icons/lucide';
import styles from './disabled.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <ToggleGroup.Root
      aria-label="Text alignment"
      defaultValue={['left']}
      class="toggle-group-disabled"
    >
      <ToggleGroup.Item value="left" class="toggle-group-disabled-item" aria-label="Align left">
        <LuAlignLeft class="toggle-group-disabled-icon" aria-hidden="true" />
        Left
      </ToggleGroup.Item>
      <ToggleGroup.Item
        value="center"
        disabled
        class="toggle-group-disabled-item"
        aria-label="Align center"
      >
        <LuAlignCenter class="toggle-group-disabled-icon" aria-hidden="true" />
        Center
      </ToggleGroup.Item>
      <ToggleGroup.Item value="right" class="toggle-group-disabled-item" aria-label="Align right">
        <LuAlignRight class="toggle-group-disabled-icon" aria-hidden="true" />
        Right
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
});
