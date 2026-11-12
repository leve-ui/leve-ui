import { component$, useStyles$ } from '@builder.io/qwik';
import { ToggleGroup } from '@leve-ui/toggle-group';
import { LuAlignCenter, LuAlignLeft, LuAlignRight } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <ToggleGroup.Root
      aria-label="Text alignment"
      defaultValue={['left']}
      class="toggle-group-default"
    >
      <ToggleGroup.Item value="left" class="toggle-group-default-item" aria-label="Align left">
        <LuAlignLeft class="toggle-group-default-icon" aria-hidden="true" />
        Left
      </ToggleGroup.Item>
      <ToggleGroup.Item value="center" class="toggle-group-default-item" aria-label="Align center">
        <LuAlignCenter class="toggle-group-default-icon" aria-hidden="true" />
        Center
      </ToggleGroup.Item>
      <ToggleGroup.Item value="right" class="toggle-group-default-item" aria-label="Align right">
        <LuAlignRight class="toggle-group-default-icon" aria-hidden="true" />
        Right
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
});
