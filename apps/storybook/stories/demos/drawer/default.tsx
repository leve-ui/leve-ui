import { component$, useStyles$ } from '@builder.io/qwik';
import { Drawer } from '@leve-ui/drawer';
import { LuX } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  // Non-modal by default: the page stays usable while the panel is open
  return (
    <Drawer.Root class="drawer-default">
      <Drawer.Trigger class="drawer-default-trigger">Order details</Drawer.Trigger>
      <button type="button" class="drawer-default-trigger">
        Another page action
      </button>
      <Drawer.Content class="drawer-default-content">
        <Drawer.Title class="drawer-default-title">Order #1042</Drawer.Title>
        <Drawer.Description class="drawer-default-description">
          Shipped on November 12 to Osaka.
        </Drawer.Description>
        <dl class="drawer-default-list">
          <dt>Items</dt>
          <dd>3</dd>
          <dt>Total</dt>
          <dd>¥12,800</dd>
        </dl>
        <Drawer.Close class="drawer-default-close" aria-label="Close">
          <LuX class="drawer-default-icon" aria-hidden="true" />
        </Drawer.Close>
      </Drawer.Content>
    </Drawer.Root>
  );
});
