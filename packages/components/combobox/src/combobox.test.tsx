import { component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Combobox } from './index';

function query(screen: HTMLElement, part: string) {
  return screen.querySelector<HTMLElement>(
    part ? `[data-leve-combobox-${part}]` : '[data-leve-combobox]',
  );
}

function items(screen: HTMLElement) {
  return Array.from(screen.querySelectorAll<HTMLElement>('[data-leve-combobox-item]'));
}

const Fruits = component$<{ defaultValue?: string; defaultInputValue?: string }>((props) => (
  <Combobox.Root defaultValue={props.defaultValue} defaultInputValue={props.defaultInputValue}>
    <Combobox.Label>Fruit</Combobox.Label>
    <Combobox.Control>
      <Combobox.Input class="input" placeholder="Search" />
      <Combobox.Trigger aria-label="Show fruits">▼</Combobox.Trigger>
    </Combobox.Control>
    <Combobox.HiddenInput name="fruit" />
    <Combobox.Content>
      <Combobox.List>
        <Combobox.Group>
          <Combobox.GroupLabel>Popular</Combobox.GroupLabel>
          <Combobox.Item value="apple">
            <Combobox.ItemText>Apple</Combobox.ItemText>
            <Combobox.ItemIndicator>✓</Combobox.ItemIndicator>
          </Combobox.Item>
        </Combobox.Group>
        <Combobox.Item value="blue berry" disabled>
          <Combobox.ItemText>Blueberry</Combobox.ItemText>
        </Combobox.Item>
        <Combobox.Item value="cherry" textValue="Cherry">
          🍒 Cherry
        </Combobox.Item>
      </Combobox.List>
      <Combobox.Empty>No results</Combobox.Empty>
    </Combobox.Content>
  </Combobox.Root>
));

describe('Combobox', () => {
  it('各パーツが正しい要素・role・data 属性で描画される', async () => {
    const { screen, render } = await createDOM();
    await render(<Fruits />);

    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
    expect(query(screen, 'label')?.tagName).toBe('LABEL');
    expect(query(screen, 'control')?.tagName).toBe('DIV');
    expect(query(screen, 'input')?.getAttribute('role')).toBe('combobox');
    expect(query(screen, 'input')?.getAttribute('type')).toBe('text');
    expect(query(screen, 'input')?.getAttribute('autocomplete')).toBe('off');
    expect(query(screen, 'trigger')?.getAttribute('type')).toBe('button');
    expect(query(screen, 'trigger')?.getAttribute('tabindex')).toBe('-1');
    expect(query(screen, 'content')?.getAttribute('popover')).toBe('manual');
    expect(query(screen, 'list')?.getAttribute('role')).toBe('listbox');
    expect(items(screen).map((item) => item.getAttribute('role'))).toEqual([
      'option',
      'option',
      'option',
    ]);
    expect(query(screen, 'group')?.getAttribute('role')).toBe('group');
    expect(query(screen, 'empty')?.textContent).toBe('No results');
    expect(query(screen, 'hidden-input')?.getAttribute('aria-hidden')).toBe('true');
    expect(query(screen, 'hidden-input')?.getAttribute('name')).toBe('fruit');
  });

  it('Input・Label・List・Group の ARIA 属性が関連付けられる', async () => {
    const { screen, render } = await createDOM();
    await render(<Fruits />);

    const input = query(screen, 'input');
    const label = query(screen, 'label');
    const list = query(screen, 'list');
    expect(label?.getAttribute('for')).toBe(input?.id);
    expect(input?.getAttribute('aria-autocomplete')).toBe('list');
    expect(input?.getAttribute('aria-expanded')).toBe('false');
    expect(input?.getAttribute('aria-controls')).toBe(list?.id);
    expect(input?.hasAttribute('aria-activedescendant')).toBe(false);
    expect(list?.getAttribute('aria-labelledby')).toBe(label?.id);
    expect(query(screen, 'trigger')?.getAttribute('aria-controls')).toBe(list?.id);
    expect(query(screen, 'group')?.getAttribute('aria-labelledby')).toBe(
      query(screen, 'group-label')?.id,
    );
    expect(input?.getAttribute('class')).toBe('input');
    expect(input?.getAttribute('placeholder')).toBe('Search');
  });

  it('項目は値から重複しない id を持ち、無効と textValue を出力する', async () => {
    const { screen, render } = await createDOM();
    await render(<Fruits />);

    const [apple, blueberry, cherry] = items(screen);
    const listId = query(screen, 'list')?.id;
    expect(apple.id).toBe(`${listId}-item-apple`);
    expect(blueberry.id).toBe(`${listId}-item-blue_20_berry`);
    expect(blueberry.getAttribute('aria-disabled')).toBe('true');
    expect(blueberry.hasAttribute('data-disabled')).toBe(true);
    expect(cherry.getAttribute('data-text-value')).toBe('Cherry');
    expect(apple.getAttribute('aria-selected')).toBe('false');
    expect(query(screen, 'item-indicator')?.hasAttribute('hidden')).toBe(true);
  });

  it('defaultValue の項目が選択され、HiddenInput に値が入る', async () => {
    const { screen, render } = await createDOM();
    await render(<Fruits defaultValue="apple" defaultInputValue="Apple" />);

    const [apple] = items(screen);
    expect(apple.getAttribute('aria-selected')).toBe('true');
    expect(apple.getAttribute('data-state')).toBe('checked');
    expect(query(screen, 'item-indicator')?.hasAttribute('hidden')).toBe(false);
    expect((query(screen, 'input') as HTMLInputElement).value).toBe('Apple');
    expect((query(screen, 'hidden-input') as HTMLInputElement).value).toBe('apple');
  });

  it('Trigger で開閉する', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<Fruits />);

    await userEvent('[data-leve-combobox-trigger]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('open');
    expect(query(screen, 'input')?.getAttribute('aria-expanded')).toBe('true');
    expect(query(screen, 'trigger')?.getAttribute('aria-expanded')).toBe('true');

    await userEvent('[data-leve-combobox-trigger]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
  });

  it('項目のクリックで選び、文字列を Input に入れて閉じる。無効な項目は選べない', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<Fruits />);

    await userEvent('[data-leve-combobox-trigger]', 'click');
    await userEvent('[data-value="blue berry"]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('open');
    expect((query(screen, 'hidden-input') as HTMLInputElement).value).toBe('');

    await userEvent('[data-value="cherry"]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
    expect((query(screen, 'input') as HTMLInputElement).value).toBe('Cherry');
    expect((query(screen, 'hidden-input') as HTMLInputElement).value).toBe('cherry');
    expect(items(screen)[2].getAttribute('aria-selected')).toBe('true');
  });

  it('bind:value と bind:inputValue で制御できる', async () => {
    const Controlled = component$(() => {
      const value = useSignal<string | null>('apple');
      const text = useSignal('Apple');
      return (
        <>
          <Combobox.Root bind:value={value} bind:inputValue={text}>
            <Combobox.Input />
            <Combobox.Content>
              <Combobox.List>
                <Combobox.Item value="apple">Apple</Combobox.Item>
                <Combobox.Item value="cherry">Cherry</Combobox.Item>
              </Combobox.List>
            </Combobox.Content>
          </Combobox.Root>
          <output>{`${value.value}:${text.value}`}</output>
          <button
            type="button"
            onClick$={() => {
              value.value = 'cherry';
            }}
          >
            set
          </button>
        </>
      );
    });
    const { screen, render, userEvent } = await createDOM();
    await render(<Controlled />);

    expect(items(screen)[0].getAttribute('aria-selected')).toBe('true');
    await userEvent('button', 'click');
    expect(items(screen)[1].getAttribute('aria-selected')).toBe('true');
    await userEvent('[data-value="apple"]', 'click');
    expect(screen.querySelector('output')?.textContent).toBe('apple:Apple');
  });

  it('disabled のとき Input と Trigger が無効になり、開かない', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Combobox.Root disabled>
        <Combobox.Input />
        <Combobox.Trigger>▼</Combobox.Trigger>
        <Combobox.Content>
          <Combobox.List />
        </Combobox.Content>
      </Combobox.Root>,
    );

    expect(query(screen, 'input')?.hasAttribute('disabled')).toBe(true);
    expect(query(screen, 'trigger')?.hasAttribute('disabled')).toBe(true);
    expect(query(screen, '')?.hasAttribute('data-disabled')).toBe(true);
    await userEvent('[data-leve-combobox-trigger]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
  });

  it('ClearTrigger は消すものがない間は hidden で、押すと入力と選択を消す', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Combobox.Root defaultValue="apple" defaultInputValue="Apple">
        <Combobox.Input />
        <Combobox.ClearTrigger aria-label="Clear">×</Combobox.ClearTrigger>
        <Combobox.HiddenInput />
        <Combobox.Content>
          <Combobox.List>
            <Combobox.Item value="apple">Apple</Combobox.Item>
          </Combobox.List>
        </Combobox.Content>
      </Combobox.Root>,
    );

    const clear = query(screen, 'clear-trigger');
    expect(clear?.getAttribute('type')).toBe('button');
    expect(clear?.getAttribute('tabindex')).toBe('-1');
    expect(clear?.getAttribute('aria-label')).toBe('Clear');
    expect(clear?.getAttribute('aria-controls')).toBe(query(screen, 'input')?.id);
    expect(clear?.hasAttribute('hidden')).toBe(false);
    expect(clear?.getAttribute('data-state')).toBe('filled');

    await userEvent('[data-leve-combobox-clear-trigger]', 'click');
    expect((query(screen, 'input') as HTMLInputElement).value).toBe('');
    expect((query(screen, 'hidden-input') as HTMLInputElement).value).toBe('');
    expect(query(screen, 'clear-trigger')?.hasAttribute('hidden')).toBe(true);
    expect(query(screen, 'clear-trigger')?.getAttribute('data-state')).toBe('empty');
  });

  it('onInputValueChange$ に変更の理由が渡される', async () => {
    const Reasons = component$(() => {
      const log = useSignal<string[]>([]);
      return (
        <>
          <Combobox.Root
            onInputValueChange$={(value, { reason }) => {
              log.value = [...log.value, `${reason}:${value}`];
            }}
          >
            <Combobox.Input />
            <Combobox.ClearTrigger>×</Combobox.ClearTrigger>
            <Combobox.Trigger>▼</Combobox.Trigger>
            <Combobox.Content>
              <Combobox.List>
                <Combobox.Item value="apple">Apple</Combobox.Item>
              </Combobox.List>
            </Combobox.Content>
          </Combobox.Root>
          <output>{log.value.join(',')}</output>
        </>
      );
    });
    const { screen, render, userEvent } = await createDOM();
    await render(<Reasons />);

    await userEvent('[data-leve-combobox-trigger]', 'click');
    await userEvent('[data-value="apple"]', 'click');
    await userEvent('[data-leve-combobox-clear-trigger]', 'click');
    expect(screen.querySelector('output')?.textContent).toBe('select:Apple,clear:');
  });

  it('openOnClick のとき Input のクリックで開く。既定では開かない', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <>
        <Combobox.Root class="default">
          <Combobox.Input />
          <Combobox.Content>
            <Combobox.List />
          </Combobox.Content>
        </Combobox.Root>
        <Combobox.Root openOnClick class="on-click">
          <Combobox.Input />
          <Combobox.Content>
            <Combobox.List />
          </Combobox.Content>
        </Combobox.Root>
      </>,
    );

    await userEvent('.default [data-leve-combobox-input]', 'click');
    expect(screen.querySelector('.default')?.getAttribute('data-state')).toBe('closed');
    await userEvent('.on-click [data-leve-combobox-input]', 'click');
    expect(screen.querySelector('.on-click')?.getAttribute('data-state')).toBe('open');
  });
});
