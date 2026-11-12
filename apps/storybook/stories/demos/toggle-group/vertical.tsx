import { component$, useStyles$ } from '@builder.io/qwik';
import { ToggleGroup } from '@leve-ui/toggle-group';
import {
  LuAlignVerticalJustifyCenter,
  LuAlignVerticalJustifyEnd,
  LuAlignVerticalJustifyStart,
} from '@qwikest/icons/lucide';
import styles from './vertical.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <ToggleGroup.Root
      orientation="vertical"
      aria-label="Vertical text alignment"
      defaultValue={['top']}
      class="toggle-group-vertical"
    >
      <ToggleGroup.Item value="top" class="toggle-group-vertical-item" aria-label="Align top">
        <LuAlignVerticalJustifyStart class="toggle-group-vertical-icon" aria-hidden="true" />
        Top
      </ToggleGroup.Item>
      <ToggleGroup.Item value="middle" class="toggle-group-vertical-item" aria-label="Align middle">
        <LuAlignVerticalJustifyCenter class="toggle-group-vertical-icon" aria-hidden="true" />
        Middle
      </ToggleGroup.Item>
      <ToggleGroup.Item value="bottom" class="toggle-group-vertical-item" aria-label="Align bottom">
        <LuAlignVerticalJustifyEnd class="toggle-group-vertical-icon" aria-hidden="true" />
        Bottom
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
});
