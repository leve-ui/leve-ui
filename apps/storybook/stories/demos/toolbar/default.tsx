import { component$, useStyles$ } from '@builder.io/qwik';
import { ToggleGroup } from '@leve-ui/toggle-group';
import { Toolbar } from '@leve-ui/toolbar';
import {
  LuAlignCenter,
  LuAlignLeft,
  LuAlignRight,
  LuBold,
  LuItalic,
  LuUnderline,
} from '@qwikest/icons/lucide';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Toolbar.Root aria-label="Formatting" class="toolbar-default">
      {/* Toggle Group items inside a Toolbar join its arrow-key navigation */}
      <ToggleGroup.Root type="multiple" aria-label="Text style" class="toolbar-default-group">
        <ToggleGroup.Item value="bold" aria-label="Bold" class="toolbar-default-item">
          <LuBold class="toolbar-default-icon" aria-hidden="true" />
        </ToggleGroup.Item>
        <ToggleGroup.Item value="italic" aria-label="Italic" class="toolbar-default-item">
          <LuItalic class="toolbar-default-icon" aria-hidden="true" />
        </ToggleGroup.Item>
        <ToggleGroup.Item value="underline" aria-label="Underline" class="toolbar-default-item">
          <LuUnderline class="toolbar-default-icon" aria-hidden="true" />
        </ToggleGroup.Item>
      </ToggleGroup.Root>
      <Toolbar.Separator class="toolbar-default-separator" />
      <ToggleGroup.Root
        defaultValue={['left']}
        aria-label="Text alignment"
        class="toolbar-default-group"
      >
        <ToggleGroup.Item value="left" aria-label="Align left" class="toolbar-default-item">
          <LuAlignLeft class="toolbar-default-icon" aria-hidden="true" />
        </ToggleGroup.Item>
        <ToggleGroup.Item value="center" aria-label="Align center" class="toolbar-default-item">
          <LuAlignCenter class="toolbar-default-icon" aria-hidden="true" />
        </ToggleGroup.Item>
        <ToggleGroup.Item value="right" aria-label="Align right" class="toolbar-default-item">
          <LuAlignRight class="toolbar-default-icon" aria-hidden="true" />
        </ToggleGroup.Item>
      </ToggleGroup.Root>
      <Toolbar.Separator class="toolbar-default-separator" />
      <Toolbar.Link href="#history" class="toolbar-default-link">
        Edited 5 minutes ago
      </Toolbar.Link>
      <Toolbar.Button class="toolbar-default-button">Share</Toolbar.Button>
    </Toolbar.Root>
  );
});
