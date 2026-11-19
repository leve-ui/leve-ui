import { $, component$, type PropsOf, Slot, sync$, useStyles$ } from '@builder.io/qwik';
import { Tooltip } from '@leve-ui/tooltip';
import { LuUndo2 } from '@qwikest/icons/lucide';
import styles from './custom-trigger.css?inline';

// Example of a consumer link component (such as Qwik City's <Link>) that spreads props onto <a>
const ClientLink = component$<PropsOf<'a'>>(({ onClick$, ...props }) => {
  const preventDefault$ = sync$((event: MouseEvent) => {
    event.preventDefault();
  });

  return (
    <a {...props} onClick$={[preventDefault$, $(() => {}), onClick$]}>
      <Slot />
    </a>
  );
});

export default component$(() => {
  useStyles$(styles);

  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        as={ClientLink}
        href="#undo"
        aria-label="Undo"
        class="tooltip-custom-trigger"
      >
        <LuUndo2 class="tooltip-custom-trigger-icon" aria-hidden="true" />
      </Tooltip.Trigger>
      <Tooltip.Content sideOffset={6} class="tooltip-custom-trigger-content">
        Undo the last change (Ctrl+Z)
        <Tooltip.Arrow class="tooltip-custom-trigger-arrow" />
      </Tooltip.Content>
    </Tooltip.Root>
  );
});
