import { component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { RadioGroup } from './index';

describe('RadioGroup', () => {
  it('すべてのパーツが正しい要素と data 属性で描画され、必須属性が出力される', async () => {
    const { screen, render } = await createDOM();
    await render(
      <RadioGroup.Root defaultValue="opt1">
        <RadioGroup.Label>Choose option</RadioGroup.Label>
        <RadioGroup.Item value="opt1">
          <RadioGroup.Indicator />
          Option 1
        </RadioGroup.Item>
        <RadioGroup.Item value="opt2">
          <RadioGroup.Indicator />
          Option 2
        </RadioGroup.Item>
        <RadioGroup.HiddenInput />
      </RadioGroup.Root>,
    );

    const root = screen.querySelector('[data-leve-radio-group]');
    const label = screen.querySelector('[data-leve-radio-group-label]');
    const items = screen.querySelectorAll('[data-leve-radio-group-item]');
    const indicators = screen.querySelectorAll('[data-leve-radio-group-indicator]');
    const hiddenInput = screen.querySelector<HTMLInputElement>(
      '[data-leve-radio-group-hidden-input]',
    );

    // Root
    expect(root).not.toBeNull();
    expect(root?.tagName).toBe('DIV');
    expect(root?.getAttribute('role')).toBe('radiogroup');
    expect(root?.getAttribute('aria-orientation')).toBe('vertical');
    expect(root?.getAttribute('data-orientation')).toBe('vertical');
    expect(root?.hasAttribute('data-state')).toBe(false);

    // Label
    expect(label).not.toBeNull();
    expect(label?.tagName).toBe('SPAN');
    expect(label?.id).toBeTruthy();
    expect(root?.getAttribute('aria-labelledby')).toBe(label?.id);

    // Items
    expect(items).toHaveLength(2);
    expect(items[0]?.tagName).toBe('BUTTON');
    expect(items[0]?.getAttribute('type')).toBe('button');
    expect(items[0]?.getAttribute('role')).toBe('radio');
    expect(items[0]?.getAttribute('value')).toBe('opt1');
    expect(items[0]?.getAttribute('data-orientation')).toBe('vertical');
    expect(items[0]?.getAttribute('aria-checked')).toBe('true');
    expect(items[0]?.getAttribute('data-state')).toBe('checked');
    expect(items[0]?.getAttribute('tabindex')).toBe('0');

    expect(items[1]?.tagName).toBe('BUTTON');
    expect(items[1]?.getAttribute('type')).toBe('button');
    expect(items[1]?.getAttribute('role')).toBe('radio');
    expect(items[1]?.getAttribute('value')).toBe('opt2');
    expect(items[1]?.getAttribute('data-orientation')).toBe('vertical');
    expect(items[1]?.getAttribute('aria-checked')).toBe('false');
    expect(items[1]?.getAttribute('data-state')).toBe('unchecked');
    expect(items[1]?.getAttribute('tabindex')).toBe('-1');

    // Indicators
    expect(indicators).toHaveLength(2);
    expect(indicators[0]?.tagName).toBe('SPAN');
    expect(indicators[0]?.getAttribute('aria-hidden')).toBe('true');
    expect(indicators[0]?.getAttribute('data-state')).toBe('checked');

    expect(indicators[1]?.tagName).toBe('SPAN');
    expect(indicators[1]?.getAttribute('aria-hidden')).toBe('true');
    expect(indicators[1]?.getAttribute('data-state')).toBe('unchecked');

    // HiddenInput
    expect(hiddenInput).not.toBeNull();
    expect(hiddenInput?.tagName).toBe('INPUT');
    expect(hiddenInput?.getAttribute('type')).toBe('radio');
    expect(hiddenInput?.getAttribute('aria-hidden')).toBe('true');
    expect(hiddenInput?.getAttribute('tabindex')).toBe('-1');
    expect(hiddenInput?.getAttribute('data-state')).toBe('checked');
    expect(hiddenInput?.checked).toBe(true);
    expect(hiddenInput?.value).toBe('opt1');
  });

  it('aria-label 指定時は aria-labelledby を出力せず、aria-labelledby 指定時はそれを優先する', async () => {
    const { screen: screenAriaLabel, render: renderAriaLabel } = await createDOM();
    await renderAriaLabel(
      <RadioGroup.Root aria-label="Favorite color">
        <RadioGroup.Item value="red">Red</RadioGroup.Item>
      </RadioGroup.Root>,
    );

    const rootAriaLabel = screenAriaLabel.querySelector('[data-leve-radio-group]');
    expect(rootAriaLabel?.getAttribute('aria-label')).toBe('Favorite color');
    expect(rootAriaLabel?.hasAttribute('aria-labelledby')).toBe(false);

    const { screen: screenCustom, render: renderCustom } = await createDOM();
    await renderCustom(
      <RadioGroup.Root aria-labelledby="custom-heading-id">
        <RadioGroup.Item value="red">Red</RadioGroup.Item>
      </RadioGroup.Root>,
    );

    const rootCustom = screenCustom.querySelector('[data-leve-radio-group]');
    expect(rootCustom?.getAttribute('aria-labelledby')).toBe('custom-heading-id');
  });

  it('ids プロパティで Label の id と Root の aria-labelledby を上書きできる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <RadioGroup.Root ids={{ label: 'custom-label-id' }}>
        <RadioGroup.Label>Theme</RadioGroup.Label>
        <RadioGroup.Item value="light">Light</RadioGroup.Item>
      </RadioGroup.Root>,
    );

    const root = screen.querySelector('[data-leve-radio-group]');
    const label = screen.querySelector('[data-leve-radio-group-label]');

    expect(label?.id).toBe('custom-label-id');
    expect(root?.getAttribute('aria-labelledby')).toBe('custom-label-id');
    expect(root?.hasAttribute('ids')).toBe(false);
  });

  it('orientation="horizontal" のときは aria-orientation と data-orientation に反映される', async () => {
    const { screen, render } = await createDOM();
    await render(
      <RadioGroup.Root orientation="horizontal">
        <RadioGroup.Item value="h1">H1</RadioGroup.Item>
      </RadioGroup.Root>,
    );

    const root = screen.querySelector('[data-leve-radio-group]');
    const item = screen.querySelector('[data-leve-radio-group-item]');

    expect(root?.getAttribute('aria-orientation')).toBe('horizontal');
    expect(root?.getAttribute('data-orientation')).toBe('horizontal');
    expect(item?.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('未選択時のロービング tabIndex: 最初の有効な Item だけが 0 になり、他は -1 になる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <RadioGroup.Root>
        <RadioGroup.Item value="a">A</RadioGroup.Item>
        <RadioGroup.Item value="b">B</RadioGroup.Item>
        <RadioGroup.Item value="c">C</RadioGroup.Item>
      </RadioGroup.Root>,
    );

    const items = screen.querySelectorAll('[data-leve-radio-group-item]');
    expect(items[0]?.getAttribute('tabindex')).toBe('0');
    expect(items[1]?.getAttribute('tabindex')).toBe('-1');
    expect(items[2]?.getAttribute('tabindex')).toBe('-1');
  });

  it('未選択時かつ先頭の Item が disabled の場合、2 番目の有効な Item が tabIndex="0" になる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <RadioGroup.Root>
        <RadioGroup.Item value="a" disabled>
          A
        </RadioGroup.Item>
        <RadioGroup.Item value="b">B</RadioGroup.Item>
        <RadioGroup.Item value="c">C</RadioGroup.Item>
      </RadioGroup.Root>,
    );

    const items = screen.querySelectorAll('[data-leve-radio-group-item]');
    expect(items[0]?.getAttribute('tabindex')).toBe('-1');
    expect(items[1]?.getAttribute('tabindex')).toBe('0');
    expect(items[2]?.getAttribute('tabindex')).toBe('-1');
  });

  it('選択中の Item がある場合、その Item だけが tabIndex="0" になり、他は -1 になる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <RadioGroup.Root defaultValue="b">
        <RadioGroup.Item value="a">A</RadioGroup.Item>
        <RadioGroup.Item value="b">B</RadioGroup.Item>
        <RadioGroup.Item value="c">C</RadioGroup.Item>
      </RadioGroup.Root>,
    );

    const items = screen.querySelectorAll('[data-leve-radio-group-item]');
    expect(items[0]?.getAttribute('tabindex')).toBe('-1');
    expect(items[1]?.getAttribute('tabindex')).toBe('0');
    expect(items[2]?.getAttribute('tabindex')).toBe('-1');
  });

  it('選択中の Item が disabled の場合、最初の有効な Item が tabIndex="0" になる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <RadioGroup.Root defaultValue="b">
        <RadioGroup.Item value="a">A</RadioGroup.Item>
        <RadioGroup.Item value="b" disabled>
          B
        </RadioGroup.Item>
        <RadioGroup.Item value="c">C</RadioGroup.Item>
      </RadioGroup.Root>,
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const items = screen.querySelectorAll('[data-leve-radio-group-item]');
    expect(items[0]?.getAttribute('tabindex')).toBe('0');
    expect(items[1]?.getAttribute('tabindex')).toBe('-1');
    expect(items[2]?.getAttribute('tabindex')).toBe('-1');
  });

  it('値がどの Item にも一致しない場合、最初の有効な Item が tabIndex="0" になる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <RadioGroup.Root defaultValue="nonexistent">
        <RadioGroup.Item value="a">A</RadioGroup.Item>
        <RadioGroup.Item value="b">B</RadioGroup.Item>
        <RadioGroup.Item value="c">C</RadioGroup.Item>
      </RadioGroup.Root>,
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const items = screen.querySelectorAll('[data-leve-radio-group-item]');
    expect(items[0]?.getAttribute('tabindex')).toBe('0');
    expect(items[1]?.getAttribute('tabindex')).toBe('-1');
    expect(items[2]?.getAttribute('tabindex')).toBe('-1');
  });

  it('Root の disabled が後から変更されたとき、context.items が更新され tabIndex が追従する', async () => {
    const Parent = component$(() => {
      const rootDisabled = useSignal(false);
      return (
        <>
          <RadioGroup.Root disabled={rootDisabled.value}>
            <RadioGroup.Item value="a">A</RadioGroup.Item>
            <RadioGroup.Item value="b">B</RadioGroup.Item>
          </RadioGroup.Root>
          <button
            type="button"
            id="toggle-disable"
            onClick$={() => {
              rootDisabled.value = true;
            }}
          >
            Disable Root
          </button>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const items = screen.querySelectorAll('[data-leve-radio-group-item]');
    expect(items[0]?.getAttribute('tabindex')).toBe('0');
    expect(items[1]?.getAttribute('tabindex')).toBe('-1');

    await userEvent('#toggle-disable', 'click');
    await new Promise((resolve) => setTimeout(resolve, 0));

    const updatedItems = screen.querySelectorAll('[data-leve-radio-group-item]');
    expect(updatedItems[0]?.getAttribute('tabindex')).toBe('-1');
    expect(updatedItems[1]?.getAttribute('tabindex')).toBe('-1');
  });

  it('Item の disabled が後から変更されたとき、tabIndex が更新される', async () => {
    const Parent = component$(() => {
      const firstDisabled = useSignal(false);
      return (
        <>
          <RadioGroup.Root>
            <RadioGroup.Item value="a" disabled={firstDisabled.value}>
              A
            </RadioGroup.Item>
            <RadioGroup.Item value="b">B</RadioGroup.Item>
          </RadioGroup.Root>
          <button
            type="button"
            id="toggle-item-disable"
            onClick$={() => {
              firstDisabled.value = true;
            }}
          >
            Disable Item A
          </button>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const items = screen.querySelectorAll('[data-leve-radio-group-item]');
    expect(items[0]?.getAttribute('tabindex')).toBe('0');
    expect(items[1]?.getAttribute('tabindex')).toBe('-1');

    await userEvent('#toggle-item-disable', 'click');
    await new Promise((resolve) => setTimeout(resolve, 0));

    const updatedItems = screen.querySelectorAll('[data-leve-radio-group-item]');
    expect(updatedItems[0]?.getAttribute('tabindex')).toBe('-1');
    expect(updatedItems[1]?.getAttribute('tabindex')).toBe('0');
  });

  it('Root の orientation が後から変更されたとき、Root と Item の属性が追従する', async () => {
    const Parent = component$(() => {
      const orient = useSignal<'horizontal' | 'vertical'>('vertical');
      return (
        <>
          <RadioGroup.Root orientation={orient.value}>
            <RadioGroup.Item value="a">A</RadioGroup.Item>
          </RadioGroup.Root>
          <button
            type="button"
            id="toggle-orient"
            onClick$={() => {
              orient.value = 'horizontal';
            }}
          >
            Horizontal
          </button>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const root = screen.querySelector('[data-leve-radio-group]');
    const item = screen.querySelector('[data-leve-radio-group-item]');
    expect(root?.getAttribute('aria-orientation')).toBe('vertical');
    expect(root?.getAttribute('data-orientation')).toBe('vertical');
    expect(item?.getAttribute('data-orientation')).toBe('vertical');

    await userEvent('#toggle-orient', 'click');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(root?.getAttribute('aria-orientation')).toBe('horizontal');
    expect(root?.getAttribute('data-orientation')).toBe('horizontal');
    expect(item?.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('Item の keydown（矢印キー）で次の有効な Item に選択が移動する', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <RadioGroup.Root defaultValue="opt1">
        <RadioGroup.Item value="opt1">1</RadioGroup.Item>
        <RadioGroup.Item value="opt2">2</RadioGroup.Item>
      </RadioGroup.Root>,
    );

    const items = screen.querySelectorAll('[data-leve-radio-group-item]');
    expect(items[0]?.getAttribute('aria-checked')).toBe('true');
    expect(items[1]?.getAttribute('aria-checked')).toBe('false');

    await userEvent(items[0], 'keydown', {
      key: 'ArrowDown',
      target: items[0],
    });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(items[0]?.getAttribute('aria-checked')).toBe('false');
    expect(items[1]?.getAttribute('aria-checked')).toBe('true');
  });

  it('Item のクリックで非制御での選択が切り替わり、全パーツの状態と HiddenInput が更新される', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <RadioGroup.Root>
        <RadioGroup.Item value="opt1">
          <RadioGroup.Indicator />1
        </RadioGroup.Item>
        <RadioGroup.Item value="opt2">
          <RadioGroup.Indicator />2
        </RadioGroup.Item>
        <RadioGroup.HiddenInput />
      </RadioGroup.Root>,
    );

    const items = screen.querySelectorAll('[data-leve-radio-group-item]');
    const indicators = screen.querySelectorAll('[data-leve-radio-group-indicator]');
    const hiddenInput = screen.querySelector<HTMLInputElement>(
      '[data-leve-radio-group-hidden-input]',
    );

    expect(items[0]?.getAttribute('aria-checked')).toBe('false');
    expect(items[1]?.getAttribute('aria-checked')).toBe('false');
    expect(hiddenInput?.checked).toBe(false);
    expect(hiddenInput?.value).toBe('');

    await userEvent('[data-leve-radio-group-item]:nth-of-type(2)', 'click');

    expect(items[0]?.getAttribute('aria-checked')).toBe('false');
    expect(items[0]?.getAttribute('data-state')).toBe('unchecked');
    expect(items[0]?.getAttribute('tabindex')).toBe('-1');
    expect(indicators[0]?.getAttribute('data-state')).toBe('unchecked');

    expect(items[1]?.getAttribute('aria-checked')).toBe('true');
    expect(items[1]?.getAttribute('data-state')).toBe('checked');
    expect(items[1]?.getAttribute('tabindex')).toBe('0');
    expect(indicators[1]?.getAttribute('data-state')).toBe('checked');

    expect(hiddenInput?.checked).toBe(true);
    expect(hiddenInput?.value).toBe('opt2');
    expect(hiddenInput?.getAttribute('data-state')).toBe('checked');

    // 既に選択済みの Item を再度クリックしても解除されない
    await userEvent('[data-leve-radio-group-item]:nth-of-type(2)', 'click');
    expect(items[1]?.getAttribute('aria-checked')).toBe('true');
    expect(hiddenInput?.value).toBe('opt2');
  });

  it('bind:value で初期値が反映され、クリックで Signal が更新され、外部変更でも更新される', async () => {
    const Parent = component$(() => {
      const selected = useSignal<string | null>('v1');
      return (
        <>
          <RadioGroup.Root bind:value={selected}>
            <RadioGroup.Item value="v1">Value 1</RadioGroup.Item>
            <RadioGroup.Item value="v2">Value 2</RadioGroup.Item>
            <RadioGroup.HiddenInput />
          </RadioGroup.Root>
          <span id="selected-out">{selected.value}</span>
          <button
            type="button"
            id="external-btn"
            onClick$={() => {
              selected.value = 'v2';
            }}
          >
            Select 2
          </button>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const items = screen.querySelectorAll('[data-leve-radio-group-item]');
    const out = screen.querySelector('#selected-out');
    const hiddenInput = screen.querySelector<HTMLInputElement>(
      '[data-leve-radio-group-hidden-input]',
    );

    expect(items[0]?.getAttribute('aria-checked')).toBe('true');
    expect(out?.textContent).toBe('v1');
    expect(hiddenInput?.value).toBe('v1');

    await userEvent('[data-leve-radio-group-item]:nth-of-type(2)', 'click');
    expect(items[1]?.getAttribute('aria-checked')).toBe('true');
    expect(out?.textContent).toBe('v2');
    expect(hiddenInput?.value).toBe('v2');

    // 外部から変更
    await userEvent('#external-btn', 'click');
    expect(items[1]?.getAttribute('aria-checked')).toBe('true');
  });

  it('クリックによる値変更時に onValueChange$ が呼ばれる', async () => {
    const Parent = component$(() => {
      const history = useSignal<string[]>([]);
      return (
        <>
          <RadioGroup.Root
            onValueChange$={(val) => {
              history.value = [...history.value, val];
            }}
          >
            <RadioGroup.Item value="a">A</RadioGroup.Item>
            <RadioGroup.Item value="b">B</RadioGroup.Item>
          </RadioGroup.Root>
          <output id="history-out">{history.value.join(',')}</output>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    await userEvent('[data-leve-radio-group-item]:nth-of-type(1)', 'click');
    expect(screen.querySelector('#history-out')?.textContent).toBe('a');

    await userEvent('[data-leve-radio-group-item]:nth-of-type(2)', 'click');
    expect(screen.querySelector('#history-out')?.textContent).toBe('a,b');

    // 同じ項目をクリックしても onValueChange$ は呼ばれない
    await userEvent('[data-leve-radio-group-item]:nth-of-type(2)', 'click');
    expect(screen.querySelector('#history-out')?.textContent).toBe('a,b');
  });

  it('Root disabled のときは全パーツに data-disabled、Item と HiddenInput に disabled が付き、クリックしても選択されない', async () => {
    const Parent = component$(() => {
      const changed = useSignal(false);
      return (
        <>
          <RadioGroup.Root
            disabled
            onValueChange$={() => {
              changed.value = true;
            }}
          >
            <RadioGroup.Label>Disabled Group</RadioGroup.Label>
            <RadioGroup.Item value="d1">
              <RadioGroup.Indicator />
              D1
            </RadioGroup.Item>
            <RadioGroup.HiddenInput />
          </RadioGroup.Root>
          <span id="changed-status">{changed.value ? 'changed' : 'unchanged'}</span>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const root = screen.querySelector('[data-leve-radio-group]');
    const label = screen.querySelector('[data-leve-radio-group-label]');
    const item = screen.querySelector('[data-leve-radio-group-item]');
    const indicator = screen.querySelector('[data-leve-radio-group-indicator]');
    const hiddenInput = screen.querySelector('[data-leve-radio-group-hidden-input]');

    expect(root?.getAttribute('aria-disabled')).toBe('true');
    expect(root?.hasAttribute('data-disabled')).toBe(true);
    expect(label?.hasAttribute('data-disabled')).toBe(true);
    expect(item?.hasAttribute('disabled')).toBe(true);
    expect(item?.hasAttribute('data-disabled')).toBe(true);
    expect(indicator?.hasAttribute('data-disabled')).toBe(true);
    expect(hiddenInput?.hasAttribute('disabled')).toBe(true);
    expect(hiddenInput?.hasAttribute('data-disabled')).toBe(true);

    await userEvent('[data-leve-radio-group-item]', 'click');
    expect(item?.getAttribute('aria-checked')).toBe('false');
    expect(screen.querySelector('#changed-status')?.textContent).toBe('unchanged');
  });

  it('個別の Item が disabled のときはその Item だけが無効化され、クリックしても選択されない', async () => {
    const Parent = component$(() => {
      const val = useSignal<string | null>(null);
      return (
        <RadioGroup.Root bind:value={val}>
          <RadioGroup.Item value="enabled">Enabled</RadioGroup.Item>
          <RadioGroup.Item value="disabled" disabled>
            <RadioGroup.Indicator />
            Disabled
          </RadioGroup.Item>
        </RadioGroup.Root>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const items = screen.querySelectorAll('[data-leve-radio-group-item]');
    const indicator = screen.querySelector('[data-leve-radio-group-indicator]');

    expect(items[0]?.hasAttribute('disabled')).toBe(false);
    expect(items[0]?.hasAttribute('data-disabled')).toBe(false);
    expect(items[1]?.hasAttribute('disabled')).toBe(true);
    expect(items[1]?.hasAttribute('data-disabled')).toBe(true);
    expect(indicator?.hasAttribute('data-disabled')).toBe(true);

    await userEvent('[data-leve-radio-group-item]:nth-of-type(2)', 'click');
    expect(items[1]?.getAttribute('aria-checked')).toBe('false');
  });

  it('required のときは Root に aria-required="true"、HiddenInput に required が付く', async () => {
    const { screen, render } = await createDOM();
    await render(
      <RadioGroup.Root required>
        <RadioGroup.Item value="a">A</RadioGroup.Item>
        <RadioGroup.HiddenInput />
      </RadioGroup.Root>,
    );

    const root = screen.querySelector('[data-leve-radio-group]');
    const hiddenInput = screen.querySelector('[data-leve-radio-group-hidden-input]');

    expect(root?.getAttribute('aria-required')).toBe('true');
    expect(hiddenInput?.hasAttribute('required')).toBe(true);

    const { screen: screenNotReq, render: renderNotReq } = await createDOM();
    await renderNotReq(
      <RadioGroup.Root>
        <RadioGroup.Item value="a">A</RadioGroup.Item>
        <RadioGroup.HiddenInput />
      </RadioGroup.Root>,
    );

    const rootNotReq = screenNotReq.querySelector('[data-leve-radio-group]');
    const hiddenInputNotReq = screenNotReq.querySelector('[data-leve-radio-group-hidden-input]');
    expect(rootNotReq?.hasAttribute('aria-required')).toBe(false);
    expect(hiddenInputNotReq?.hasAttribute('required')).toBe(false);
  });

  it('任意 props（class, name, form 等）が要素に渡り、Root の独自 props は Root div の属性にならない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <RadioGroup.Root
        class="root-custom-class"
        defaultValue="foo"
        orientation="vertical"
        loop={false}
        disabled
        required
      >
        <RadioGroup.Item class="item-custom-class" value="foo">
          Foo
        </RadioGroup.Item>
        <RadioGroup.HiddenInput class="input-custom-class" name="choice" form="my-form" />
      </RadioGroup.Root>,
    );

    const root = screen.querySelector('[data-leve-radio-group]');
    const item = screen.querySelector('[data-leve-radio-group-item]');
    const hiddenInput = screen.querySelector('[data-leve-radio-group-hidden-input]');

    expect(root?.getAttribute('class')).toBe('root-custom-class');
    expect(root?.hasAttribute('defaultvalue')).toBe(false);
    expect(root?.hasAttribute('loop')).toBe(false);
    expect(root?.hasAttribute('disabled')).toBe(false);
    expect(root?.hasAttribute('required')).toBe(false);

    expect(item?.getAttribute('class')).toBe('item-custom-class');

    expect(hiddenInput?.getAttribute('class')).toBe('input-custom-class');
    expect(hiddenInput?.getAttribute('name')).toBe('choice');
    expect(hiddenInput?.getAttribute('form')).toBe('my-form');
  });

  it('Item に渡した利用者の onClick$ が呼ばれる（イベント合成）', async () => {
    const Parent = component$(() => {
      const clicked = useSignal(false);
      return (
        <RadioGroup.Root>
          <RadioGroup.Item
            value="opt"
            onClick$={() => {
              clicked.value = true;
            }}
          >
            Option
          </RadioGroup.Item>
          <span id="click-status">{clicked.value ? 'yes' : 'no'}</span>
        </RadioGroup.Root>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    expect(screen.querySelector('#click-status')?.textContent).toBe('no');
    await userEvent('[data-leve-radio-group-item]', 'click');
    expect(screen.querySelector('#click-status')?.textContent).toBe('yes');
  });
});
