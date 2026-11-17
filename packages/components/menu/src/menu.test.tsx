import { component$ } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Menu } from './index';

function query(screen: HTMLElement, part: string) {
  return screen.querySelector<HTMLElement>(part ? `[data-leve-menu-${part}]` : '[data-leve-menu]');
}

const BasicMenu = component$(() => (
  <Menu.Root>
    <Menu.Trigger>Actions</Menu.Trigger>
    <Menu.Content>
      <Menu.Item>New file</Menu.Item>
      <Menu.Item disabled textValue="Paste">
        Paste ⌘V
      </Menu.Item>
      <Menu.Separator />
      <Menu.Group>
        <Menu.GroupLabel>Share</Menu.GroupLabel>
        <Menu.Item>Copy link</Menu.Item>
      </Menu.Group>
      <Menu.Arrow />
    </Menu.Content>
  </Menu.Root>
));

describe('Menu', () => {
  it('各パーツが正しい要素・role・data 属性で描画される', async () => {
    const { screen, render } = await createDOM();
    await render(<BasicMenu />);

    expect(query(screen, '')?.tagName).toBe('DIV');
    expect(query(screen, 'trigger')?.getAttribute('type')).toBe('button');
    expect(query(screen, 'content')?.getAttribute('role')).toBe('menu');
    expect(query(screen, 'content')?.getAttribute('popover')).toBe('manual');
    expect(query(screen, 'item')?.getAttribute('role')).toBe('menuitem');
    expect(query(screen, 'item')?.getAttribute('tabindex')).toBe('-1');
    expect(query(screen, 'separator')?.getAttribute('role')).toBe('separator');
    expect(query(screen, 'group')?.getAttribute('role')).toBe('group');
    expect(query(screen, 'arrow')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('Trigger と Content、Group と GroupLabel の ARIA 属性が関連付けられる', async () => {
    const { screen, render } = await createDOM();
    await render(<BasicMenu />);

    const trigger = query(screen, 'trigger');
    const content = query(screen, 'content');
    expect(trigger?.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(trigger?.getAttribute('aria-controls')).toBe(content?.id);
    expect(content?.getAttribute('aria-labelledby')).toBe(trigger?.id);
    expect(query(screen, 'group')?.getAttribute('aria-labelledby')).toBe(
      query(screen, 'group-label')?.id,
    );
  });

  it('無効な項目に aria-disabled と data-disabled、textValue に data-text-value が付く', async () => {
    const { screen, render } = await createDOM();
    await render(<BasicMenu />);

    const paste = screen.querySelectorAll('[data-leve-menu-item]')[1];
    expect(paste.getAttribute('aria-disabled')).toBe('true');
    expect(paste.hasAttribute('data-disabled')).toBe(true);
    expect(paste.getAttribute('data-text-value')).toBe('Paste');
    expect(paste.hasAttribute('disabled')).toBe(false);
    expect(paste.hasAttribute('textvalue')).toBe(false);
  });

  it('Trigger で開閉し、項目のクリックで onSelect$ を呼んで閉じる', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<BasicMenu />);

    await userEvent('[data-leve-menu-trigger]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('open');
    expect(query(screen, 'trigger')?.getAttribute('aria-expanded')).toBe('true');

    await userEvent('[data-leve-menu-item]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
  });

  it('closeOnSelect={false} と無効な項目では、クリックしても閉じない', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Content>
          <Menu.Item closeOnSelect={false} class="keep">
            Keep open
          </Menu.Item>
          <Menu.Item disabled class="disabled">
            Disabled
          </Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );

    await userEvent('.keep', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('open');
    await userEvent('.disabled', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('open');
  });

  it('CheckboxItem は role="menuitemcheckbox" と aria-checked を出力し、クリックで切り替わる', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Menu.Root defaultOpen>
        <Menu.Content>
          <Menu.CheckboxItem defaultChecked closeOnSelect={false}>
            <Menu.ItemIndicator>✓</Menu.ItemIndicator>
            Show grid
          </Menu.CheckboxItem>
        </Menu.Content>
      </Menu.Root>,
    );

    const item = query(screen, 'checkbox-item');
    const indicator = query(screen, 'item-indicator');
    expect(item?.getAttribute('role')).toBe('menuitemcheckbox');
    expect(item?.getAttribute('aria-checked')).toBe('true');
    expect(item?.getAttribute('data-state')).toBe('checked');
    expect(indicator?.hasAttribute('hidden')).toBe(false);
    expect(indicator?.getAttribute('aria-hidden')).toBe('true');

    await userEvent('[data-leve-menu-checkbox-item]', 'click');
    expect(item?.getAttribute('aria-checked')).toBe('false');
    expect(indicator?.hasAttribute('hidden')).toBe(true);
    expect(query(screen, '')?.getAttribute('data-state')).toBe('open');
  });

  it('RadioItem は 1 つだけ aria-checked="true" になり、RadioGroup は role="group"', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Menu.Root defaultOpen>
        <Menu.Content>
          <Menu.RadioGroup defaultValue="100" aria-label="Zoom">
            <Menu.RadioItem value="100">100%</Menu.RadioItem>
            <Menu.RadioItem value="200" class="two">
              200%
            </Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Content>
      </Menu.Root>,
    );

    expect(query(screen, 'radio-group')?.getAttribute('role')).toBe('group');
    const [one, two] = screen.querySelectorAll('[data-leve-menu-radio-item]');
    expect(one.getAttribute('role')).toBe('menuitemradio');
    expect(one.getAttribute('aria-checked')).toBe('true');
    expect(two.getAttribute('aria-checked')).toBe('false');
    expect(two.hasAttribute('value')).toBe(false);

    await userEvent('.two', 'click');
    expect(one.getAttribute('aria-checked')).toBe('false');
    expect(two.getAttribute('aria-checked')).toBe('true');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
  });
});
