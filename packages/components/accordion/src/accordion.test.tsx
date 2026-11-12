import { component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Accordion } from './index';

describe('Accordion', () => {
  it('全パーツが正しい要素と data 属性で描画され、Header は既定で h3、level={2} で h2 を描画する', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Accordion.Root>
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Header level={2}>
            <Accordion.Trigger>Trigger 2</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content 2</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const root = screen.querySelector('[data-leve-accordion]');
    const items = screen.querySelectorAll('[data-leve-accordion-item]');
    const headers = screen.querySelectorAll('[data-leve-accordion-header]');
    const triggers = screen.querySelectorAll('[data-leve-accordion-trigger]');
    const contents = screen.querySelectorAll('[data-leve-accordion-content]');

    expect(root).not.toBeNull();
    expect(root?.tagName).toBe('DIV');
    expect(root?.getAttribute('data-orientation')).toBe('vertical');
    expect(root?.hasAttribute('data-state')).toBe(false);
    expect(root?.hasAttribute('data-disabled')).toBe(false);

    expect(items.length).toBe(2);
    expect(items[0]?.tagName).toBe('DIV');
    expect(items[0]?.getAttribute('data-state')).toBe('closed');
    expect(items[0]?.getAttribute('data-orientation')).toBe('vertical');
    expect(items[0]?.hasAttribute('data-disabled')).toBe(false);

    expect(headers.length).toBe(2);
    expect(headers[0]?.tagName).toBe('H3');
    expect(headers[0]?.getAttribute('data-state')).toBe('closed');
    expect(headers[0]?.getAttribute('data-orientation')).toBe('vertical');
    expect(headers[1]?.tagName).toBe('H2');

    expect(triggers.length).toBe(2);
    expect(triggers[0]?.tagName).toBe('BUTTON');
    expect(triggers[0]?.getAttribute('type')).toBe('button');
    expect(triggers[0]?.getAttribute('data-state')).toBe('closed');
    expect(triggers[0]?.getAttribute('data-orientation')).toBe('vertical');

    expect(contents.length).toBe(2);
    expect(contents[0]?.tagName).toBe('DIV');
    expect(contents[0]?.getAttribute('role')).toBe('region');
    expect(contents[0]?.getAttribute('data-state')).toBe('closed');
    expect(contents[0]?.getAttribute('data-orientation')).toBe('vertical');
  });

  it('Trigger と Content の ARIA 属性と ID が正しく関連付けられ、閉じている Content に hidden が付く', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Accordion.Root>
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const trigger = screen.querySelector('[data-leve-accordion-trigger]');
    const content = screen.querySelector('[data-leve-accordion-content]');

    const triggerId = trigger?.getAttribute('id');
    const contentId = content?.getAttribute('id');

    expect(triggerId).toBeTruthy();
    expect(contentId).toBeTruthy();

    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(trigger?.getAttribute('aria-controls')).toBe(contentId);

    expect(content?.getAttribute('role')).toBe('region');
    expect(content?.getAttribute('aria-labelledby')).toBe(triggerId);
    expect(content?.hasAttribute('hidden')).toBe(true);
  });

  it('開閉によって Item / Header / Trigger / Content の data-state が open / closed に切り替わる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Accordion.Root defaultValue={['item-1']}>
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Header>
            <Accordion.Trigger>Trigger 2</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content 2</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const item1 = screen.querySelectorAll('[data-leve-accordion-item]')[0];
    const header1 = screen.querySelectorAll('[data-leve-accordion-header]')[0];
    const trigger1 = screen.querySelectorAll('[data-leve-accordion-trigger]')[0];
    const content1 = screen.querySelectorAll('[data-leve-accordion-content]')[0];

    const item2 = screen.querySelectorAll('[data-leve-accordion-item]')[1];
    const header2 = screen.querySelectorAll('[data-leve-accordion-header]')[1];
    const trigger2 = screen.querySelectorAll('[data-leve-accordion-trigger]')[1];
    const content2 = screen.querySelectorAll('[data-leve-accordion-content]')[1];

    expect(item1?.getAttribute('data-state')).toBe('open');
    expect(header1?.getAttribute('data-state')).toBe('open');
    expect(trigger1?.getAttribute('data-state')).toBe('open');
    expect(trigger1?.getAttribute('aria-expanded')).toBe('true');
    expect(content1?.getAttribute('data-state')).toBe('open');
    expect(content1?.hasAttribute('hidden')).toBe(false);

    expect(item2?.getAttribute('data-state')).toBe('closed');
    expect(header2?.getAttribute('data-state')).toBe('closed');
    expect(trigger2?.getAttribute('data-state')).toBe('closed');
    expect(trigger2?.getAttribute('aria-expanded')).toBe('false');
    expect(content2?.getAttribute('data-state')).toBe('closed');
    expect(content2?.hasAttribute('hidden')).toBe(true);
  });

  it('single モード: 別の項目を開くと前の項目が閉じ、非 collapsible の開いているトリガーは aria-disabled="true" となりクリックしても開いたままになる', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Accordion.Root type="single" defaultValue={['item-1']}>
        <Accordion.Item value="item-1" id="item-1">
          <Accordion.Header>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2" id="item-2">
          <Accordion.Header>
            <Accordion.Trigger>Trigger 2</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content 2</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const trigger1 = screen.querySelector('#item-1 [data-leve-accordion-trigger]');
    const trigger2 = screen.querySelector('#item-2 [data-leve-accordion-trigger]');
    const content1 = screen.querySelector('#item-1 [data-leve-accordion-content]');
    const content2 = screen.querySelector('#item-2 [data-leve-accordion-content]');

    expect(trigger1?.getAttribute('aria-expanded')).toBe('true');
    expect(trigger1?.getAttribute('aria-disabled')).toBe('true');
    expect(trigger1?.hasAttribute('disabled')).toBe(false);
    expect(content1?.hasAttribute('hidden')).toBe(false);

    expect(trigger2?.getAttribute('aria-expanded')).toBe('false');
    expect(trigger2?.hasAttribute('aria-disabled')).toBe(false);
    expect(content2?.hasAttribute('hidden')).toBe(true);

    // 非 collapsible なので開いている項目をクリックしても閉じない
    if (trigger1) {
      await userEvent(trigger1, 'click');
    }
    expect(trigger1?.getAttribute('aria-expanded')).toBe('true');
    expect(trigger1?.getAttribute('aria-disabled')).toBe('true');
    expect(content1?.hasAttribute('hidden')).toBe(false);

    // 別の項目をクリックすると前の項目が閉じ、新しい項目が開く
    if (trigger2) {
      await userEvent(trigger2, 'click');
    }
    expect(trigger1?.getAttribute('aria-expanded')).toBe('false');
    expect(trigger1?.hasAttribute('aria-disabled')).toBe(false);
    expect(content1?.hasAttribute('hidden')).toBe(true);

    expect(trigger2?.getAttribute('aria-expanded')).toBe('true');
    expect(trigger2?.getAttribute('aria-disabled')).toBe('true');
    expect(content2?.hasAttribute('hidden')).toBe(false);
  });

  it('single モードで collapsible={true} の場合、開いているトリガーをクリックすると閉じることができる', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Accordion.Root type="single" collapsible defaultValue={['item-1']}>
        <Accordion.Item value="item-1" id="item-1">
          <Accordion.Header>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const trigger1 = screen.querySelector('#item-1 [data-leve-accordion-trigger]');
    const content1 = screen.querySelector('#item-1 [data-leve-accordion-content]');

    expect(trigger1?.getAttribute('aria-expanded')).toBe('true');
    expect(trigger1?.hasAttribute('aria-disabled')).toBe(false);
    expect(content1?.hasAttribute('hidden')).toBe(false);

    if (trigger1) {
      await userEvent(trigger1, 'click');
    }
    expect(trigger1?.getAttribute('aria-expanded')).toBe('false');
    expect(content1?.hasAttribute('hidden')).toBe(true);
  });

  it('multiple モード: 複数の項目を同時に開くことができ、開いている項目をクリックすると閉じることができる', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Accordion.Root type="multiple">
        <Accordion.Item value="item-1" id="item-1">
          <Accordion.Header>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2" id="item-2">
          <Accordion.Header>
            <Accordion.Trigger>Trigger 2</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content 2</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const trigger1 = screen.querySelector('#item-1 [data-leve-accordion-trigger]');
    const trigger2 = screen.querySelector('#item-2 [data-leve-accordion-trigger]');
    const content1 = screen.querySelector('#item-1 [data-leve-accordion-content]');
    const content2 = screen.querySelector('#item-2 [data-leve-accordion-content]');

    expect(trigger1?.getAttribute('aria-expanded')).toBe('false');
    expect(trigger2?.getAttribute('aria-expanded')).toBe('false');

    if (trigger1) {
      await userEvent(trigger1, 'click');
    }
    expect(trigger1?.getAttribute('aria-expanded')).toBe('true');
    expect(content1?.hasAttribute('hidden')).toBe(false);
    expect(trigger2?.getAttribute('aria-expanded')).toBe('false');

    if (trigger2) {
      await userEvent(trigger2, 'click');
    }
    expect(trigger1?.getAttribute('aria-expanded')).toBe('true');
    expect(content1?.hasAttribute('hidden')).toBe(false);
    expect(trigger2?.getAttribute('aria-expanded')).toBe('true');
    expect(content2?.hasAttribute('hidden')).toBe(false);

    if (trigger1) {
      await userEvent(trigger1, 'click');
    }
    expect(trigger1?.getAttribute('aria-expanded')).toBe('false');
    expect(content1?.hasAttribute('hidden')).toBe(true);
    expect(trigger2?.getAttribute('aria-expanded')).toBe('true');
    expect(content2?.hasAttribute('hidden')).toBe(false);
  });

  it('bind:value による制御モードと外部変更に対応し、onValueChange$ が選択値の配列で呼ばれる', async () => {
    const TestComp = component$(() => {
      const value = useSignal<string[]>(['item-1']);
      const log = useSignal<string[]>([]);

      return (
        <div>
          <button
            type="button"
            id="ext-btn"
            onClick$={() => {
              value.value = ['item-2'];
            }}
          >
            Change to Item 2
          </button>
          <Accordion.Root
            bind:value={value}
            onValueChange$={(val) => {
              log.value = [...log.value, val.join(',')];
            }}
          >
            <Accordion.Item value="item-1" id="item-1">
              <Accordion.Header>
                <Accordion.Trigger>Trigger 1</Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>Content 1</Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="item-2" id="item-2">
              <Accordion.Header>
                <Accordion.Trigger>Trigger 2</Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>Content 2</Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
          <output id="change-log">{log.value.join(';')}</output>
        </div>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<TestComp />);

    const trigger1 = screen.querySelector('#item-1 [data-leve-accordion-trigger]');
    const trigger2 = screen.querySelector('#item-2 [data-leve-accordion-trigger]');

    expect(trigger1?.getAttribute('aria-expanded')).toBe('true');
    expect(trigger2?.getAttribute('aria-expanded')).toBe('false');

    // ユーザー操作で Trigger 2 をクリック
    if (trigger2) {
      await userEvent(trigger2, 'click');
    }
    expect(screen.querySelector('#change-log')?.textContent).toBe('item-2');
    expect(trigger1?.getAttribute('aria-expanded')).toBe('false');
    expect(trigger2?.getAttribute('aria-expanded')).toBe('true');

    // 外部から Signal を更新
    await userEvent('#ext-btn', 'click');
    expect(trigger1?.getAttribute('aria-expanded')).toBe('false');
    expect(trigger2?.getAttribute('aria-expanded')).toBe('true');
  });

  it('disabled な項目および disabled な Root の挙動', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <div>
        <Accordion.Root id="root1">
          <Accordion.Item value="item-1" disabled id="disabled-item">
            <Accordion.Header id="disabled-header">
              <Accordion.Trigger>Disabled Trigger</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Disabled Content</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
        <Accordion.Root disabled id="disabled-root">
          <Accordion.Item value="item-2" id="root-disabled-item">
            <Accordion.Header id="root-disabled-header">
              <Accordion.Trigger>Trigger</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Content</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>,
    );

    const disabledItem = screen.querySelector('#disabled-item');
    const disabledHeader = screen.querySelector('#disabled-header');
    const disabledTrigger = disabledItem?.querySelector('[data-leve-accordion-trigger]');
    const disabledContent = disabledItem?.querySelector('[data-leve-accordion-content]');

    expect(disabledItem?.getAttribute('data-disabled')).toBe('');
    expect(disabledHeader?.getAttribute('data-disabled')).toBe('');
    expect(disabledTrigger?.getAttribute('data-disabled')).toBe('');
    expect(disabledTrigger?.hasAttribute('disabled')).toBe(true);
    expect(disabledContent?.getAttribute('data-disabled')).toBe('');

    if (disabledTrigger) {
      await userEvent(disabledTrigger, 'click');
      expect(disabledTrigger?.getAttribute('aria-expanded')).toBe('false');
    }

    const disabledRoot = screen.querySelector('#disabled-root');
    const rootDisabledItem = screen.querySelector('#root-disabled-item');
    const rootDisabledTrigger = rootDisabledItem?.querySelector('[data-leve-accordion-trigger]');

    expect(disabledRoot?.getAttribute('data-disabled')).toBe('');
    expect(rootDisabledItem?.getAttribute('data-disabled')).toBe('');
    expect(rootDisabledTrigger?.getAttribute('data-disabled')).toBe('');
    expect(rootDisabledTrigger?.hasAttribute('disabled')).toBe(true);
  });

  it('各パーツに任意の class や aria-* 属性がそのまま渡される', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Accordion.Root class="custom-root" aria-label="Root label">
        <Accordion.Item value="item-1" class="custom-item" data-custom="item">
          <Accordion.Header class="custom-header">
            <Accordion.Trigger class="custom-trigger" aria-describedby="desc-1">
              Trigger 1
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content class="custom-content" data-custom="content">
            Content 1
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const root = screen.querySelector('[data-leve-accordion]');
    const item = screen.querySelector('[data-leve-accordion-item]');
    const header = screen.querySelector('[data-leve-accordion-header]');
    const trigger = screen.querySelector('[data-leve-accordion-trigger]');
    const content = screen.querySelector('[data-leve-accordion-content]');

    expect(root?.classList.contains('custom-root')).toBe(true);
    expect(root?.getAttribute('aria-label')).toBe('Root label');

    expect(item?.classList.contains('custom-item')).toBe(true);
    expect(item?.getAttribute('data-custom')).toBe('item');

    expect(header?.classList.contains('custom-header')).toBe(true);

    expect(trigger?.classList.contains('custom-trigger')).toBe(true);
    expect(trigger?.getAttribute('aria-describedby')).toBe('desc-1');

    expect(content?.classList.contains('custom-content')).toBe(true);
    expect(content?.getAttribute('data-custom')).toBe('content');
  });
});
