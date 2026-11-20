import { component$, type PropsOf, Slot, useStyles$ } from '@builder.io/qwik';
import { Popover } from '@leve-ui/popover';
import { LuSlidersHorizontal } from '@qwikest/icons/lucide';
import styles from './anchor.css?inline';

// Custom components passed to `as` must spread all received props onto one element
const FieldWrapper = component$<PropsOf<'div'>>((props) => (
  <div {...props}>
    <Slot />
  </div>
));

const IconButton = component$<PropsOf<'button'>>(({ type = 'button', ...props }) => (
  <button type={type} {...props}>
    <Slot />
  </button>
));

export default component$(() => {
  useStyles$(styles);

  return (
    <Popover.Root class="popover-anchor">
      {/* The Content is placed below the whole field, not only below the button */}
      <Popover.Anchor as={FieldWrapper} class="popover-anchor-field">
        <input class="popover-anchor-input" aria-label="Search" placeholder="Search" />
        <Popover.Trigger as={IconButton} class="popover-anchor-trigger" aria-label="Filters">
          <LuSlidersHorizontal class="popover-anchor-icon" aria-hidden="true" />
        </Popover.Trigger>
      </Popover.Anchor>
      <Popover.Content align="start" sideOffset={6} class="popover-anchor-content">
        <Popover.Title class="popover-anchor-title">Filters</Popover.Title>
        <label class="popover-anchor-option">
          <input type="checkbox" name="open" checked /> Open issues
        </label>
        <label class="popover-anchor-option">
          <input type="checkbox" name="mine" /> Assigned to me
        </label>
      </Popover.Content>
    </Popover.Root>
  );
});
