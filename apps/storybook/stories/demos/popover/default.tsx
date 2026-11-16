import { component$, useStyles$ } from '@builder.io/qwik';
import { Popover } from '@leve-ui/popover';
import { LuX } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <Popover.Root class="popover-default">
      <Popover.Trigger class="popover-default-trigger">Dimensions</Popover.Trigger>
      <Popover.Content sideOffset={8} class="popover-default-content">
        <Popover.Title class="popover-default-title">Dimensions</Popover.Title>
        <Popover.Description class="popover-default-description">
          Set the size of the layer.
        </Popover.Description>
        <label class="popover-default-label">
          Width
          <input class="popover-default-input" name="width" value="320px" />
        </label>
        <label class="popover-default-label">
          Height
          <input class="popover-default-input" name="height" value="240px" />
        </label>
        <Popover.Close class="popover-default-close" aria-label="Close">
          <LuX class="popover-default-icon" aria-hidden="true" />
        </Popover.Close>
        {/* The library positions the arrow along the edge and sets data-side */}
        <Popover.Arrow class="popover-default-arrow" />
      </Popover.Content>
    </Popover.Root>
  );
});
