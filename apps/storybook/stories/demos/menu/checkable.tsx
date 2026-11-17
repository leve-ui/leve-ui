import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Menu } from '@leve-ui/menu';
import { LuCheck, LuDot } from '@qwikest/icons/lucide';
import styles from './checkable.css?inline';

export default component$(() => {
  useStyles$(styles);
  const grid = useSignal(true);
  const zoom = useSignal<string | null>('100');

  return (
    <div class="menu-checkable">
      <Menu.Root>
        <Menu.Trigger class="menu-checkable-trigger">View</Menu.Trigger>
        <Menu.Content sideOffset={4} class="menu-checkable-content">
          <Menu.CheckboxItem bind:checked={grid} class="menu-checkable-item">
            <Menu.ItemIndicator class="menu-checkable-indicator">
              <LuCheck class="menu-checkable-icon" />
            </Menu.ItemIndicator>
            Show grid
          </Menu.CheckboxItem>
          <Menu.CheckboxItem class="menu-checkable-item">
            <Menu.ItemIndicator class="menu-checkable-indicator">
              <LuCheck class="menu-checkable-icon" />
            </Menu.ItemIndicator>
            Show rulers
          </Menu.CheckboxItem>
          <Menu.Separator class="menu-checkable-separator" />
          <Menu.Group>
            <Menu.GroupLabel class="menu-checkable-label">Zoom</Menu.GroupLabel>
            <Menu.RadioGroup bind:value={zoom}>
              {['50', '100', '200'].map((value) => (
                <Menu.RadioItem key={value} value={value} class="menu-checkable-item">
                  <Menu.ItemIndicator class="menu-checkable-indicator">
                    <LuDot class="menu-checkable-icon" />
                  </Menu.ItemIndicator>
                  {value}%
                </Menu.RadioItem>
              ))}
            </Menu.RadioGroup>
          </Menu.Group>
        </Menu.Content>
      </Menu.Root>
      <p class="menu-checkable-status">
        Grid: {grid.value ? 'on' : 'off'}, zoom: {zoom.value}%
      </p>
    </div>
  );
});
