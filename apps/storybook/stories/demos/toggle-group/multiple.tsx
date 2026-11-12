import { component$, useStyles$ } from '@builder.io/qwik';
import { ToggleGroup } from '@leve-ui/toggle-group';
import { LuBold, LuItalic, LuUnderline } from '@qwikest/icons/lucide';
import styles from './multiple.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <ToggleGroup.Root
      type="multiple"
      aria-label="Text styles"
      defaultValue={['bold']}
      class="toggle-group-multiple"
    >
      <ToggleGroup.Item value="bold" class="toggle-group-multiple-item" aria-label="Bold text">
        <LuBold class="toggle-group-multiple-icon" aria-hidden="true" />
        Bold
      </ToggleGroup.Item>
      <ToggleGroup.Item value="italic" class="toggle-group-multiple-item" aria-label="Italic text">
        <LuItalic class="toggle-group-multiple-icon" aria-hidden="true" />
        Italic
      </ToggleGroup.Item>
      <ToggleGroup.Item
        value="underline"
        class="toggle-group-multiple-item"
        aria-label="Underline text"
      >
        <LuUnderline class="toggle-group-multiple-icon" aria-hidden="true" />
        Underline
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
});
