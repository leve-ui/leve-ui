import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { ToggleGroup } from '@leve-ui/toggle-group';
import { LuAlignCenter, LuAlignLeft, LuAlignRight } from '@qwikest/icons/lucide';
import styles from './controlled.css?inline';

export default component$(() => {
  useStyles$(styles);
  const value = useSignal<string[]>(['left']);

  return (
    <div class="toggle-group-controlled-wrapper">
      <ToggleGroup.Root
        aria-label="Text alignment"
        bind:value={value}
        class="toggle-group-controlled"
      >
        <ToggleGroup.Item value="left" class="toggle-group-controlled-item" aria-label="Align left">
          <LuAlignLeft class="toggle-group-controlled-icon" aria-hidden="true" />
          Left
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value="center"
          class="toggle-group-controlled-item"
          aria-label="Align center"
        >
          <LuAlignCenter class="toggle-group-controlled-icon" aria-hidden="true" />
          Center
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value="right"
          class="toggle-group-controlled-item"
          aria-label="Align right"
        >
          <LuAlignRight class="toggle-group-controlled-icon" aria-hidden="true" />
          Right
        </ToggleGroup.Item>
      </ToggleGroup.Root>
      <p class="toggle-group-controlled-output">
        Selected: {value.value.length > 0 ? value.value.join(', ') : 'none'}
      </p>
    </div>
  );
});
