import { component$, useStyles$ } from '@builder.io/qwik';
import { Tooltip } from '@leve-ui/tooltip';
import { LuUndo2 } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  // The tooltip describes the button (aria-describedby); the button keeps its own label
  return (
    <Tooltip.Root>
      <Tooltip.Trigger aria-label="Undo" class="tooltip-default-trigger">
        <LuUndo2 class="tooltip-default-icon" aria-hidden="true" />
      </Tooltip.Trigger>
      <Tooltip.Content sideOffset={6} class="tooltip-default-content">
        Undo the last change (Ctrl+Z)
        <Tooltip.Arrow class="tooltip-default-arrow" />
      </Tooltip.Content>
    </Tooltip.Root>
  );
});
