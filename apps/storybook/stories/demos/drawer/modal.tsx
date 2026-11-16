import { component$, useStyles$ } from '@builder.io/qwik';
import { Drawer } from '@leve-ui/drawer';
import { LuMenu, LuX } from '@qwikest/icons/lucide';
import styles from './modal.css?inline';

export default component$(() => {
  useStyles$(styles);

  // modal blocks the page like a Dialog, for example for navigation on small screens
  return (
    <Drawer.Root modal side="left" class="drawer-modal">
      <Drawer.Trigger class="drawer-modal-trigger" aria-label="Open navigation">
        <LuMenu class="drawer-modal-icon" aria-hidden="true" />
      </Drawer.Trigger>
      <Drawer.Content class="drawer-modal-content">
        <Drawer.Title class="drawer-modal-title">Navigation</Drawer.Title>
        <Drawer.Description class="drawer-modal-description">
          Go to a section of the site.
        </Drawer.Description>
        <nav class="drawer-modal-nav">
          <a href="#home" class="drawer-modal-link">
            Home
          </a>
          <a href="#projects" class="drawer-modal-link">
            Projects
          </a>
          <a href="#settings" class="drawer-modal-link">
            Settings
          </a>
        </nav>
        <Drawer.Close class="drawer-modal-close" aria-label="Close">
          <LuX class="drawer-modal-icon" aria-hidden="true" />
        </Drawer.Close>
      </Drawer.Content>
    </Drawer.Root>
  );
});
