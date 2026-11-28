import { component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Listbox } from './index';

function queryRoot(screen: HTMLElement) {
  return screen.querySelector<HTMLElement>('[data-leve-listbox]');
}

function queryItems(screen: HTMLElement) {
  return Array.from(screen.querySelectorAll<HTMLElement>('[data-leve-listbox-item]'));
}

const Fruits = component$<{
  defaultValue?: string[];
  multiple?: boolean;
  loop?: boolean;
  disabled?: boolean;
  orientation?: 'vertical' | 'horizontal';
}>((props) => (
  <Listbox.Root
    aria-label="Fruit"
    defaultValue={props.defaultValue}
    multiple={props.multiple}
    loop={props.loop}
    disabled={props.disabled}
    orientation={props.orientation}
  >
    <Listbox.Group>
      <Listbox.GroupLabel>Popular</Listbox.GroupLabel>
      <Listbox.Item value="apple">
        <Listbox.ItemText>Apple</Listbox.ItemText>
        <Listbox.ItemIndicator>✓</Listbox.ItemIndicator>
      </Listbox.Item>
      <Listbox.Item value="apricot">
        <Listbox.ItemText>Apricot</Listbox.ItemText>
        <Listbox.ItemIndicator>✓</Listbox.ItemIndicator>
      </Listbox.Item>
    </Listbox.Group>
    <Listbox.Item value="blue berry" disabled>
      <Listbox.ItemText>Blueberry</Listbox.ItemText>
      <Listbox.ItemIndicator>✓</Listbox.ItemIndicator>
    </Listbox.Item>
    <Listbox.Item value="cherry" textValue="Cherry">
      🍒 Cherry
      <Listbox.ItemIndicator>✓</Listbox.ItemIndicator>
    </Listbox.Item>
    <Listbox.Item value="new york">
      <Listbox.ItemText>New York</Listbox.ItemText>
    </Listbox.Item>
  </Listbox.Root>
));

describe('Listbox', () => {
  it('すべてのパーツが正しい要素・role・data 属性で描画される', async () => {
    const { screen, render } = await createDOM();
    await render(<Fruits />);

    const root = queryRoot(screen);
    expect(root?.tagName).toBe('DIV');
    expect(root?.getAttribute('role')).toBe('listbox');
    expect(root?.getAttribute('tabindex')).toBe('0');
    expect(root?.getAttribute('aria-orientation')).toBe('vertical');
    expect(root?.getAttribute('data-orientation')).toBe('vertical');
    expect(root?.hasAttribute('aria-multiselectable')).toBe(false);
    expect(root?.hasAttribute('aria-activedescendant')).toBe(false);
    expect(root?.hasAttribute('aria-disabled')).toBe(false);
    expect(root?.hasAttribute('data-disabled')).toBe(false);

    const items = queryItems(screen);
    expect(items).toHaveLength(5);
    expect(items.every((el) => el.tagName === 'DIV' && el.getAttribute('role') === 'option')).toBe(
      true,
    );

    const group = screen.querySelector('[data-leve-listbox-group]');
    const groupLabel = screen.querySelector('[data-leve-listbox-group-label]');
    expect(group?.getAttribute('role')).toBe('group');
    expect(group?.getAttribute('aria-labelledby')).toBe(groupLabel?.id);

    const itemText = screen.querySelector('[data-leve-listbox-item-text]');
    const itemIndicator = screen.querySelector('[data-leve-listbox-item-indicator]');
    expect(itemText?.tagName).toBe('SPAN');
    expect(itemIndicator?.tagName).toBe('SPAN');
    expect(itemIndicator?.getAttribute('aria-hidden')).toBe('true');
    expect(itemIndicator?.getAttribute('data-state')).toBe('unchecked');
    expect(itemIndicator?.hasAttribute('hidden')).toBe(true);
  });

  it('項目の id は重複しない単射エンコーディングで生成され、textValue と disabled を反映する', async () => {
    const { screen, render } = await createDOM();
    await render(<Fruits />);

    const root = queryRoot(screen);
    const [apple, , blueberry, cherry] = queryItems(screen);
    expect(apple.id).toBe(`${root?.id}-item-apple`);
    expect(blueberry.id).toBe(`${root?.id}-item-blue_20_berry`);
    expect(blueberry.getAttribute('aria-disabled')).toBe('true');
    expect(blueberry.hasAttribute('data-disabled')).toBe(true);
    expect(cherry.getAttribute('data-text-value')).toBe('Cherry');
    expect(apple.getAttribute('aria-selected')).toBe('false');
    expect(apple.getAttribute('data-state')).toBe('unchecked');
  });

  it('任意の props（class / id / aria-label / onClick$ など）が要素に渡り、ハンドラが合成される', async () => {
    const { screen, render, userEvent } = await createDOM();
    const clicked = { count: 0 };

    await render(
      <Listbox.Root id="custom-list" class="my-listbox" aria-label="Options">
        <Listbox.Item
          value="one"
          class="my-item"
          onClick$={() => {
            clicked.count++;
          }}
        >
          One
        </Listbox.Item>
      </Listbox.Root>,
    );

    const root = queryRoot(screen);
    expect(root?.id).toBe('custom-list');
    expect(root?.getAttribute('class')).toBe('my-listbox');
    expect(root?.getAttribute('aria-label')).toBe('Options');

    const item = queryItems(screen)[0];
    expect(item?.id).toBe('custom-list-item-one');
    expect(item?.getAttribute('class')).toBe('my-item');

    await userEvent('[data-value="one"]', 'click');
    expect(clicked.count).toBe(1);
    expect(item?.getAttribute('aria-selected')).toBe('true');
  });

  it('defaultValue で初期選択され、単一選択ではクリックで切り替わる', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<Fruits defaultValue={['apple']} />);

    const items = queryItems(screen);
    expect(items[0].getAttribute('aria-selected')).toBe('true');
    expect(items[0].getAttribute('data-state')).toBe('checked');
    const indicator0 = items[0].querySelector('[data-leve-listbox-item-indicator]');
    expect(indicator0?.hasAttribute('hidden')).toBe(false);
    expect(indicator0?.getAttribute('data-state')).toBe('checked');

    // Disabled item cannot be selected
    await userEvent('[data-value="blue berry"]', 'click');
    expect(queryItems(screen)[0].getAttribute('aria-selected')).toBe('true');
    expect(queryItems(screen)[2].getAttribute('aria-selected')).toBe('false');

    // Clicking another item moves selection
    await userEvent('[data-value="cherry"]', 'click');
    expect(queryItems(screen)[0].getAttribute('aria-selected')).toBe('false');
    expect(queryItems(screen)[3].getAttribute('aria-selected')).toBe('true');
  });

  it('multiple モードでは aria-multiselectable="true" が付き、クリックで複数トグルできる', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<Fruits multiple defaultValue={['apple']} />);

    expect(queryRoot(screen)?.getAttribute('aria-multiselectable')).toBe('true');
    expect(queryItems(screen)[0].getAttribute('aria-selected')).toBe('true');

    await userEvent('[data-value="cherry"]', 'click');
    expect(queryItems(screen)[0].getAttribute('aria-selected')).toBe('true');
    expect(queryItems(screen)[3].getAttribute('aria-selected')).toBe('true');

    await userEvent('[data-value="apple"]', 'click');
    expect(queryItems(screen)[0].getAttribute('aria-selected')).toBe('false');
    expect(queryItems(screen)[3].getAttribute('aria-selected')).toBe('true');
  });

  it('bind:value と onValueChange$ で制御モードが動作する', async () => {
    const Controlled = component$(() => {
      const value = useSignal<string[]>(['apple']);
      const changes = useSignal<string[]>([]);

      return (
        <>
          <Listbox.Root
            bind:value={value}
            onValueChange$={(next) => {
              changes.value = [...changes.value, next.join(',')];
            }}
            aria-label="Controlled"
          >
            <Listbox.Item value="apple">Apple</Listbox.Item>
            <Listbox.Item value="cherry">Cherry</Listbox.Item>
          </Listbox.Root>
          <output>{`${value.value.join(',')}|${changes.value.join(';')}`}</output>
          <button
            type="button"
            onClick$={() => {
              value.value = ['cherry'];
            }}
          >
            Set cherry
          </button>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Controlled />);

    expect(queryItems(screen)[0].getAttribute('aria-selected')).toBe('true');

    await userEvent('button', 'click');
    expect(queryItems(screen)[0].getAttribute('aria-selected')).toBe('false');
    expect(queryItems(screen)[1].getAttribute('aria-selected')).toBe('true');

    // Re-clicking already selected cherry in single mode does not fire redundant change
    await userEvent('[data-value="cherry"]', 'click');
    expect(screen.querySelector('output')?.textContent).toBe('cherry|');

    await userEvent('[data-value="apple"]', 'click');
    expect(screen.querySelector('output')?.textContent).toBe('apple|apple');
  });

  it('disabled の Root は操作を無効化し、子 Item にも disabled が伝播する', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<Fruits disabled defaultValue={['apple']} />);

    const root = queryRoot(screen);
    expect(root?.getAttribute('tabindex')).toBe('-1');
    expect(root?.getAttribute('aria-disabled')).toBe('true');
    expect(root?.hasAttribute('data-disabled')).toBe(true);

    for (const item of queryItems(screen)) {
      expect(item.getAttribute('aria-disabled')).toBe('true');
      expect(item.hasAttribute('data-disabled')).toBe(true);
    }

    await userEvent('[data-leve-listbox]', 'focus');
    expect(root?.hasAttribute('aria-activedescendant')).toBe(false);

    await userEvent('[data-value="cherry"]', 'click');
    expect(queryItems(screen)[0].getAttribute('aria-selected')).toBe('true');
    expect(queryItems(screen)[3].getAttribute('aria-selected')).toBe('false');
  });

  it('フォーカス時に選択中または最初の有効項目をハイライトし、ブラーで解除する', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<Fruits defaultValue={['cherry']} />);

    const root = queryRoot(screen);
    const items = queryItems(screen);

    await userEvent('[data-leve-listbox]', 'focus');
    expect(root?.getAttribute('aria-activedescendant')).toBe(items[3].id);
    expect(items[3].hasAttribute('data-highlighted')).toBe(true);

    await userEvent('[data-leve-listbox]', 'blur');
    expect(root?.hasAttribute('aria-activedescendant')).toBe(false);
    expect(queryItems(screen)[3].hasAttribute('data-highlighted')).toBe(false);
  });

  it('未選択で先頭項目が disabled の場合、フォーカス時に最初の有効項目をハイライトする', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Listbox.Root aria-label="First disabled">
        <Listbox.Item value="a" disabled>
          A
        </Listbox.Item>
        <Listbox.Item value="b">B</Listbox.Item>
      </Listbox.Root>,
    );

    await userEvent('[data-leve-listbox]', 'focus');
    const items = queryItems(screen);
    expect(queryRoot(screen)?.getAttribute('aria-activedescendant')).toBe(items[1].id);
    expect(items[1].hasAttribute('data-highlighted')).toBe(true);
  });

  it('ArrowDown / ArrowUp / Home / End で無効項目をスキップしてハイライトし、loop に対応する', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<Fruits loop />);

    const root = queryRoot(screen);
    await userEvent('[data-leve-listbox]', 'focus');
    expect(root?.getAttribute('aria-activedescendant')).toBe(queryItems(screen)[0].id);

    // Apple -> Apricot -> (skip disabled Blueberry) -> Cherry
    await userEvent('[data-leve-listbox]', 'keydown', { key: 'ArrowDown' });
    expect(root?.getAttribute('aria-activedescendant')).toBe(queryItems(screen)[1].id);
    await userEvent('[data-leve-listbox]', 'keydown', { key: 'ArrowDown' });
    expect(root?.getAttribute('aria-activedescendant')).toBe(queryItems(screen)[3].id);

    // End -> New York, then ArrowDown loops to Apple
    await userEvent('[data-leve-listbox]', 'keydown', { key: 'End' });
    expect(root?.getAttribute('aria-activedescendant')).toBe(queryItems(screen)[4].id);
    await userEvent('[data-leve-listbox]', 'keydown', { key: 'ArrowDown' });
    expect(root?.getAttribute('aria-activedescendant')).toBe(queryItems(screen)[0].id);

    // ArrowUp from Apple loops to New York; Home returns to Apple
    await userEvent('[data-leve-listbox]', 'keydown', { key: 'ArrowUp' });
    expect(root?.getAttribute('aria-activedescendant')).toBe(queryItems(screen)[4].id);
    await userEvent('[data-leve-listbox]', 'keydown', { key: 'Home' });
    expect(root?.getAttribute('aria-activedescendant')).toBe(queryItems(screen)[0].id);
  });

  it('orientation="horizontal" では ArrowRight / ArrowLeft で移動し、ArrowDown / ArrowUp は無視する', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<Fruits orientation="horizontal" />);

    const root = queryRoot(screen);
    expect(root?.getAttribute('aria-orientation')).toBe('horizontal');
    expect(root?.getAttribute('data-orientation')).toBe('horizontal');
    expect(queryItems(screen)[0].getAttribute('data-orientation')).toBe('horizontal');

    await userEvent('[data-leve-listbox]', 'focus');
    await userEvent('[data-leve-listbox]', 'keydown', { key: 'ArrowDown' });
    expect(root?.getAttribute('aria-activedescendant')).toBe(queryItems(screen)[0].id);

    await userEvent('[data-leve-listbox]', 'keydown', { key: 'ArrowRight' });
    expect(root?.getAttribute('aria-activedescendant')).toBe(queryItems(screen)[1].id);
    await userEvent('[data-leve-listbox]', 'keydown', { key: 'ArrowLeft' });
    expect(root?.getAttribute('aria-activedescendant')).toBe(queryItems(screen)[0].id);
  });

  it('Space / Enter でハイライト項目を選択またはトグルする', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<Fruits multiple />);

    await userEvent('[data-leve-listbox]', 'focus');
    await userEvent('[data-leve-listbox]', 'keydown', { key: ' ' });
    expect(queryItems(screen)[0].getAttribute('aria-selected')).toBe('true');

    await userEvent('[data-leve-listbox]', 'keydown', { key: 'ArrowDown' });
    await userEvent('[data-leve-listbox]', 'keydown', { key: 'Enter' });
    expect(queryItems(screen)[1].getAttribute('aria-selected')).toBe('true');

    await userEvent('[data-leve-listbox]', 'keydown', { key: ' ' });
    expect(queryItems(screen)[1].getAttribute('aria-selected')).toBe('false');
  });

  it('multiple モードで Shift+矢印・Shift+Home/End・Ctrl/Cmd+A・Shift+クリックが動作する', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<Fruits multiple />);

    await userEvent('[data-leve-listbox]', 'focus');
    // Shift+ArrowDown twice from Apple: selects Apple, Apricot, skips Blueberry, selects Cherry
    await userEvent('[data-leve-listbox]', 'keydown', { key: 'ArrowDown', shiftKey: true });
    await userEvent('[data-leve-listbox]', 'keydown', { key: 'ArrowDown', shiftKey: true });
    expect(queryItems(screen).map((el) => el.getAttribute('aria-selected'))).toEqual([
      'true',
      'true',
      'false',
      'true',
      'false',
    ]);

    // Reversing with Shift+ArrowUp shrinks the range back to Apple, Apricot
    await userEvent('[data-leve-listbox]', 'keydown', { key: 'ArrowUp', shiftKey: true });
    expect(queryItems(screen).map((el) => el.getAttribute('aria-selected'))).toEqual([
      'true',
      'true',
      'false',
      'false',
      'false',
    ]);

    // Shift+End selects through New York (skipping disabled Blueberry)
    await userEvent('[data-leve-listbox]', 'keydown', { key: 'End', shiftKey: true });
    expect(queryItems(screen).map((el) => el.getAttribute('aria-selected'))).toEqual([
      'true',
      'true',
      'false',
      'true',
      'true',
    ]);

    // Deselect everything via clicking one by one, then test Ctrl+A
    await userEvent('[data-value="apple"]', 'click');
    await userEvent('[data-value="apricot"]', 'click');
    await userEvent('[data-value="cherry"]', 'click');
    await userEvent('[data-value="new york"]', 'click');
    expect(queryItems(screen).every((el) => el.getAttribute('aria-selected') === 'false')).toBe(
      true,
    );

    await userEvent('[data-leve-listbox]', 'keydown', { key: 'a', ctrlKey: true });
    expect(queryItems(screen).map((el) => el.getAttribute('aria-selected'))).toEqual([
      'true',
      'true',
      'false',
      'true',
      'true',
    ]);

    // Shift+Click selects range from clicked anchor
    await userEvent('[data-value="apple"]', 'click');
    await userEvent('[data-value="apricot"]', 'click');
    await userEvent('[data-value="cherry"]', 'click');
    await userEvent('[data-value="new york"]', 'click');
    // Now empty; click Apricot to set anchor, then Shift+Click New York
    await userEvent('[data-value="apricot"]', 'click');
    await userEvent('[data-value="new york"]', 'click', { shiftKey: true });
    expect(queryItems(screen).map((el) => el.getAttribute('aria-selected'))).toEqual([
      'false',
      'true',
      'false',
      'true',
      'true',
    ]);
  });

  it('連続した Shift+ArrowDown でも後の選択状態が失われない', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<Fruits multiple defaultValue={['apple']} />);

    await userEvent('[data-leve-listbox]', 'focus');
    await Promise.all([
      userEvent('[data-leve-listbox]', 'keydown', { key: 'ArrowDown', shiftKey: true }),
      userEvent('[data-leve-listbox]', 'keydown', { key: 'ArrowDown', shiftKey: true }),
    ]);

    expect(queryItems(screen).map((el) => el.getAttribute('aria-selected'))).toEqual([
      'true',
      'true',
      'false',
      'true',
      'false',
    ]);
  });

  it('タイプアヘッドで一致する有効項目へハイライトが移動する', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<Fruits />);

    const root = queryRoot(screen);
    await userEvent('[data-leve-listbox]', 'focus');

    // Pressing 'a' when on Apple cycles to Apricot
    await userEvent('[data-leve-listbox]', 'keydown', { key: 'a' });
    expect(root?.getAttribute('aria-activedescendant')).toBe(queryItems(screen)[1].id);

    // Pressing 'a' again wraps back to Apple
    await userEvent('[data-leve-listbox]', 'keydown', { key: 'a' });
    expect(root?.getAttribute('aria-activedescendant')).toBe(queryItems(screen)[0].id);

    // Clear buffer via blur and test multi-char + textValue matching ('c' -> Cherry)
    await userEvent('[data-leve-listbox]', 'blur');
    await userEvent('[data-leve-listbox]', 'focus');
    await userEvent('[data-leve-listbox]', 'keydown', { key: 'c' });
    expect(root?.getAttribute('aria-activedescendant')).toBe(queryItems(screen)[3].id);

    // 'b' should NOT match disabled Blueberry
    await userEvent('[data-leve-listbox]', 'keydown', { key: 'b' });
    expect(root?.getAttribute('aria-activedescendant')).toBe(queryItems(screen)[3].id);

    // Multi-word with buffered space ('new y' -> New York)
    await userEvent('[data-leve-listbox]', 'blur');
    await userEvent('[data-leve-listbox]', 'focus');
    for (const key of ['n', 'e', 'w', ' ', 'y']) {
      await userEvent('[data-leve-listbox]', 'keydown', { key });
    }
    expect(root?.getAttribute('aria-activedescendant')).toBe(queryItems(screen)[4].id);
  });
});
