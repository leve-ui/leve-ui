import { component$, useStyles$ } from '@builder.io/qwik';
import { Toggle } from '@leve-ui/toggle';
import { Toolbar } from '@leve-ui/toolbar';
import { LuGrid3X3, LuRedo2, LuUndo2 } from '@qwikest/icons/lucide';
import styles from './vertical.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Toolbar.Root orientation="vertical" aria-label="Canvas" class="toolbar-vertical">
      <Toolbar.Button aria-label="Undo" class="toolbar-vertical-item">
        <LuUndo2 class="toolbar-vertical-icon" aria-hidden="true" />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Redo" disabled class="toolbar-vertical-item">
        <LuRedo2 class="toolbar-vertical-icon" aria-hidden="true" />
      </Toolbar.Button>
      <Toolbar.Separator class="toolbar-vertical-separator" />
      {/* A Toggle inside a Toolbar joins its arrow-key navigation */}
      <Toggle.Root aria-label="Show grid" class="toolbar-vertical-item">
        <LuGrid3X3 class="toolbar-vertical-icon" aria-hidden="true" />
      </Toggle.Root>
    </Toolbar.Root>
  );
});
