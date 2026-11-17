import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Menu } from '@leve-ui/menu';
import { LuChevronRight } from '@qwikest/icons/lucide';
import styles from './submenu.css?inline';

export default component$(() => {
  useStyles$(styles);
  const last = useSignal('Nothing yet');
  const select$ = $((action: string) => {
    last.value = action;
  });

  return (
    <div class="menu-submenu">
      <Menu.Root>
        <Menu.Trigger class="menu-submenu-trigger">File</Menu.Trigger>
        <Menu.Content sideOffset={4} class="menu-submenu-content">
          <Menu.Item onSelect$={() => select$('New file')} class="menu-submenu-item">
            New file
          </Menu.Item>
          <Menu.Sub>
            <Menu.SubTrigger class="menu-submenu-item">
              Share
              <LuChevronRight class="menu-submenu-icon" aria-hidden="true" />
            </Menu.SubTrigger>
            <Menu.SubContent alignOffset={-5} class="menu-submenu-content">
              <Menu.Item onSelect$={() => select$('Copy link')} class="menu-submenu-item">
                Copy link
              </Menu.Item>
              <Menu.Item onSelect$={() => select$('Email')} class="menu-submenu-item">
                Email
              </Menu.Item>
            </Menu.SubContent>
          </Menu.Sub>
          <Menu.Item onSelect$={() => select$('Print')} class="menu-submenu-item">
            Print
          </Menu.Item>
        </Menu.Content>
      </Menu.Root>
      <p class="menu-submenu-status">Last action: {last.value}</p>
    </div>
  );
});
