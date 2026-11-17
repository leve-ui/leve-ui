import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Menu } from '@leve-ui/menu';
import { LuChevronDown } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);
  const last = useSignal('Nothing yet');
  const select$ = $((action: string) => {
    last.value = action;
  });

  return (
    <div class="menu-default">
      <Menu.Root>
        <Menu.Trigger class="menu-default-trigger">
          Actions
          <LuChevronDown class="menu-default-chevron" aria-hidden="true" />
        </Menu.Trigger>
        <Menu.Content sideOffset={4} class="menu-default-content">
          <Menu.Item onSelect$={() => select$('New file')} class="menu-default-item">
            New file <span class="menu-default-shortcut">⌘N</span>
          </Menu.Item>
          <Menu.Item onSelect$={() => select$('Duplicate')} class="menu-default-item">
            Duplicate <span class="menu-default-shortcut">⌘D</span>
          </Menu.Item>
          <Menu.Item disabled class="menu-default-item">
            Paste <span class="menu-default-shortcut">⌘V</span>
          </Menu.Item>
          <Menu.Separator class="menu-default-separator" />
          <Menu.Group>
            <Menu.GroupLabel class="menu-default-label">Share</Menu.GroupLabel>
            <Menu.Item onSelect$={() => select$('Copy link')} class="menu-default-item">
              Copy link
            </Menu.Item>
            <Menu.Item onSelect$={() => select$('Email')} class="menu-default-item">
              Email
            </Menu.Item>
          </Menu.Group>
        </Menu.Content>
      </Menu.Root>
      <p class="menu-default-status">Last action: {last.value}</p>
    </div>
  );
});
