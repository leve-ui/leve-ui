import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Menu } from '@leve-ui/menu';
import { LuChevronRight } from '@qwikest/icons/lucide';
import styles from './context.css?inline';

export default component$(() => {
  useStyles$(styles);
  const last = useSignal('Nothing yet');
  const select$ = $((action: string) => {
    last.value = action;
  });

  return (
    <div class="menu-context">
      <Menu.Root>
        {/* Right-click (or long-press) anywhere in the area. Keyboard users press Shift+F10 on the button. */}
        <Menu.ContextTrigger class="menu-context-area">
          <span>Right-click here</span>
          <button type="button" class="menu-context-button">
            Or focus me and press Shift+F10
          </button>
        </Menu.ContextTrigger>
        {/* There is no Trigger to take the name from, so name the menu with aria-label */}
        <Menu.Content aria-label="Page" class="menu-context-content">
          <Menu.Item onSelect$={() => select$('Back')} class="menu-context-item">
            Back
          </Menu.Item>
          <Menu.Item disabled class="menu-context-item">
            Forward
          </Menu.Item>
          <Menu.Item onSelect$={() => select$('Reload')} class="menu-context-item">
            Reload
          </Menu.Item>
          <Menu.Separator class="menu-context-separator" />
          <Menu.Sub>
            <Menu.SubTrigger class="menu-context-item">
              More tools
              <LuChevronRight class="menu-context-icon" aria-hidden="true" />
            </Menu.SubTrigger>
            <Menu.SubContent alignOffset={-5} class="menu-context-content">
              <Menu.Item onSelect$={() => select$('Save page as')} class="menu-context-item">
                Save page as…
              </Menu.Item>
              <Menu.Item onSelect$={() => select$('Developer tools')} class="menu-context-item">
                Developer tools
              </Menu.Item>
            </Menu.SubContent>
          </Menu.Sub>
        </Menu.Content>
      </Menu.Root>
      <p class="menu-context-status">Last action: {last.value}</p>
    </div>
  );
});
