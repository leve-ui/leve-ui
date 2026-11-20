import { $, component$, type PropsOf, Slot, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Tabs } from './index';

describe('Tabs', () => {
  it('全パーツが正しい要素と属性で描画される', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Tabs.Root defaultValue="tab1">
        <Tabs.List aria-label="Settings tabs">
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Panel 1</Tabs.Content>
        <Tabs.Content value="tab2">Panel 2</Tabs.Content>
      </Tabs.Root>,
    );

    const root = screen.querySelector('[data-leve-tabs]');
    const list = screen.querySelector('[data-leve-tabs-list]');
    const triggers = screen.querySelectorAll('[data-leve-tabs-trigger]');
    const contents = screen.querySelectorAll('[data-leve-tabs-content]');

    expect(root?.tagName).toBe('DIV');
    expect(root?.getAttribute('data-orientation')).toBe('horizontal');

    expect(list?.tagName).toBe('DIV');
    expect(list?.getAttribute('role')).toBe('tablist');
    expect(list?.getAttribute('aria-orientation')).toBe('horizontal');
    expect(list?.getAttribute('data-orientation')).toBe('horizontal');

    expect(triggers.length).toBe(2);
    expect(triggers[0]?.tagName).toBe('BUTTON');
    expect(triggers[0]?.getAttribute('type')).toBe('button');
    expect(triggers[0]?.getAttribute('role')).toBe('tab');
    expect(triggers[0]?.getAttribute('data-orientation')).toBe('horizontal');

    expect(contents.length).toBe(2);
    expect(contents[0]?.tagName).toBe('DIV');
    expect(contents[0]?.getAttribute('role')).toBe('tabpanel');
    expect(contents[0]?.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('role / aria-selected / aria-controls ⇔ Content id / aria-labelledby ⇔ Trigger id が正しく関連付けられる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Tabs.Root defaultValue="tab1">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Panel 1</Tabs.Content>
        <Tabs.Content value="tab2">Panel 2</Tabs.Content>
      </Tabs.Root>,
    );

    const trigger1 = screen.querySelector('[data-leve-tabs-trigger][value="tab1"]');
    const trigger2 = screen.querySelector('[data-leve-tabs-trigger][value="tab2"]');
    const content1 = screen.querySelector('[data-leve-tabs-content]:not([hidden])');
    const content2 = screen.querySelector('[data-leve-tabs-content][hidden]');

    expect(trigger1?.getAttribute('role')).toBe('tab');
    expect(trigger1?.getAttribute('aria-selected')).toBe('true');
    expect(trigger2?.getAttribute('aria-selected')).toBe('false');

    const trigger1Id = trigger1?.getAttribute('id');
    const trigger2Id = trigger2?.getAttribute('id');
    const content1Id = content1?.getAttribute('id');
    const content2Id = content2?.getAttribute('id');

    expect(trigger1Id).toBeTruthy();
    expect(trigger2Id).toBeTruthy();
    expect(content1Id).toBeTruthy();
    expect(content2Id).toBeTruthy();

    expect(trigger1?.getAttribute('aria-controls')).toBe(content1Id);
    expect(trigger2?.getAttribute('aria-controls')).toBe(content2Id);
    expect(content1?.getAttribute('aria-labelledby')).toBe(trigger1Id);
    expect(content2?.getAttribute('aria-labelledby')).toBe(trigger2Id);
  });

  it('orientation="vertical" で aria-orientation と data-orientation が vertical になる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Tabs.Root orientation="vertical" defaultValue="tab1">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Panel 1</Tabs.Content>
      </Tabs.Root>,
    );

    const root = screen.querySelector('[data-leve-tabs]');
    const list = screen.querySelector('[data-leve-tabs-list]');
    const trigger = screen.querySelector('[data-leve-tabs-trigger]');
    const content = screen.querySelector('[data-leve-tabs-content]');

    expect(root?.getAttribute('data-orientation')).toBe('vertical');
    expect(list?.getAttribute('aria-orientation')).toBe('vertical');
    expect(list?.getAttribute('data-orientation')).toBe('vertical');
    expect(trigger?.getAttribute('data-orientation')).toBe('vertical');
    expect(content?.getAttribute('data-orientation')).toBe('vertical');
  });

  it('Root の orientation / activationMode / loop は HTML 属性として出力されない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Tabs.Root orientation="vertical" activationMode="manual" loop={false} defaultValue="tab1">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Panel 1</Tabs.Content>
      </Tabs.Root>,
    );

    const root = screen.querySelector('[data-leve-tabs]');
    expect(root?.hasAttribute('orientation')).toBe(false);
    expect(root?.hasAttribute('activationmode')).toBe(false);
    expect(root?.hasAttribute('activationMode')).toBe(false);
    expect(root?.hasAttribute('loop')).toBe(false);
    expect(root?.getAttribute('data-orientation')).toBe('vertical');
  });

  it('選択中パーツに data-state="active"、非選択パーツに data-state="inactive" が付く', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Tabs.Root defaultValue="tab1">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Panel 1</Tabs.Content>
        <Tabs.Content value="tab2">Panel 2</Tabs.Content>
      </Tabs.Root>,
    );

    const trigger1 = screen.querySelector('[value="tab1"]');
    const trigger2 = screen.querySelector('[value="tab2"]');
    const contents = screen.querySelectorAll('[data-leve-tabs-content]');

    expect(trigger1?.getAttribute('data-state')).toBe('active');
    expect(trigger2?.getAttribute('data-state')).toBe('inactive');
    expect(contents[0]?.getAttribute('data-state')).toBe('active');
    expect(contents[1]?.getAttribute('data-state')).toBe('inactive');
  });

  it('選択されていない Content に hidden 属性が付き、選択中の Content には付かない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Tabs.Root defaultValue="tab1">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Panel 1</Tabs.Content>
        <Tabs.Content value="tab2">Panel 2</Tabs.Content>
      </Tabs.Root>,
    );

    const contents = screen.querySelectorAll('[data-leve-tabs-content]');
    expect(contents[0]?.hasAttribute('hidden')).toBe(false);
    expect(contents[1]?.hasAttribute('hidden')).toBe(true);
  });

  it('全 Content に tabIndex=0 が付く', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Tabs.Root defaultValue="tab1">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Panel 1</Tabs.Content>
        <Tabs.Content value="tab2">Panel 2</Tabs.Content>
      </Tabs.Root>,
    );

    const contents = screen.querySelectorAll('[data-leve-tabs-content]');
    expect(contents[0]?.getAttribute('tabindex')).toBe('0');
    expect(contents[1]?.getAttribute('tabindex')).toBe('0');
  });

  it('選択中の Trigger だけ tabIndex=0、他は -1 となる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Tabs.Root defaultValue="tab2">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Panel 1</Tabs.Content>
        <Tabs.Content value="tab2">Panel 2</Tabs.Content>
        <Tabs.Content value="tab3">Panel 3</Tabs.Content>
      </Tabs.Root>,
    );

    await new Promise((resolve) => setTimeout(resolve, 10));

    const triggers = screen.querySelectorAll('[data-leve-tabs-trigger]');
    expect(triggers[0]?.getAttribute('tabindex')).toBe('-1');
    expect(triggers[1]?.getAttribute('tabindex')).toBe('0');
    expect(triggers[2]?.getAttribute('tabindex')).toBe('-1');
  });

  it('未選択時は最初の有効な Trigger だけ tabIndex=0 となり、他は -1 となる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Tabs.Root>
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Panel 1</Tabs.Content>
        <Tabs.Content value="tab2">Panel 2</Tabs.Content>
      </Tabs.Root>,
    );

    const triggers = screen.querySelectorAll('[data-leve-tabs-trigger]');
    expect(triggers[0]?.getAttribute('tabindex')).toBe('0');
    expect(triggers[1]?.getAttribute('tabindex')).toBe('-1');
  });

  it('未選択時かつ先頭の Trigger が disabled の場合、最初の有効な Trigger が tabIndex=0 となる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Tabs.Root>
        <Tabs.List>
          <Tabs.Trigger value="tab1" disabled>
            Tab 1
          </Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Panel 1</Tabs.Content>
        <Tabs.Content value="tab2">Panel 2</Tabs.Content>
        <Tabs.Content value="tab3">Panel 3</Tabs.Content>
      </Tabs.Root>,
    );

    await new Promise((resolve) => setTimeout(resolve, 10));

    const triggers = screen.querySelectorAll('[data-leve-tabs-trigger]');
    expect(triggers[0]?.getAttribute('tabindex')).toBe('-1');
    expect(triggers[1]?.getAttribute('tabindex')).toBe('0');
    expect(triggers[2]?.getAttribute('tabindex')).toBe('-1');
  });

  it('クリックで選択が切り替わり、パネルの表示が更新される', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Tabs.Root defaultValue="tab1">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Panel 1</Tabs.Content>
        <Tabs.Content value="tab2">Panel 2</Tabs.Content>
      </Tabs.Root>,
    );

    const trigger1 = screen.querySelector('[value="tab1"]');
    const trigger2 = screen.querySelector('[value="tab2"]');
    const contents = screen.querySelectorAll('[data-leve-tabs-content]');

    expect(trigger1?.getAttribute('aria-selected')).toBe('true');
    expect(contents[0]?.hasAttribute('hidden')).toBe(false);

    await userEvent('[value="tab2"]', 'click');

    expect(trigger1?.getAttribute('aria-selected')).toBe('false');
    expect(trigger2?.getAttribute('aria-selected')).toBe('true');
    expect(contents[0]?.hasAttribute('hidden')).toBe(true);
    expect(contents[1]?.hasAttribute('hidden')).toBe(false);
  });

  it('bind:value で制御モードとして動作し、クリックで Signal が更新され、Signal 変更で表示が更新される', async () => {
    const Parent = component$(() => {
      const selected = useSignal<string | null>('tab1');
      return (
        <>
          <Tabs.Root bind:value={selected}>
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="tab1">Panel 1</Tabs.Content>
            <Tabs.Content value="tab2">Panel 2</Tabs.Content>
          </Tabs.Root>
          <span id="current-val">{selected.value}</span>
          <button
            type="button"
            id="external-btn"
            onClick$={() => {
              selected.value = 'tab2';
            }}
          >
            Select Tab 2
          </button>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const trigger1 = screen.querySelector('[value="tab1"]');
    const trigger2 = screen.querySelector('[value="tab2"]');
    const currentVal = screen.querySelector('#current-val');

    expect(currentVal?.textContent).toBe('tab1');
    expect(trigger1?.getAttribute('aria-selected')).toBe('true');

    await userEvent('[value="tab2"]', 'click');
    expect(currentVal?.textContent).toBe('tab2');
    expect(trigger2?.getAttribute('aria-selected')).toBe('true');

    await userEvent('#external-btn', 'click');
    expect(currentVal?.textContent).toBe('tab2');
  });

  it('タブ変更時に onValueChange$ が呼ばれる', async () => {
    const Parent = component$(() => {
      const log = useSignal<string[]>([]);
      return (
        <>
          <Tabs.Root
            defaultValue="tab1"
            onValueChange$={(val) => {
              log.value = [...log.value, val];
            }}
          >
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="tab1">Panel 1</Tabs.Content>
            <Tabs.Content value="tab2">Panel 2</Tabs.Content>
          </Tabs.Root>
          <span id="change-log">{log.value.join(',')}</span>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const log = screen.querySelector('#change-log');
    expect(log?.textContent).toBe('');

    await userEvent('[value="tab2"]', 'click');
    expect(log?.textContent).toBe('tab2');

    // 既に選択中のタブをクリックしても onValueChange$ は呼ばれない
    await userEvent('[value="tab2"]', 'click');
    expect(log?.textContent).toBe('tab2');
  });

  it('disabled の Trigger に disabled 属性と data-disabled が付き、クリックしても選択されない', async () => {
    const Parent = component$(() => {
      const selected = useSignal<string | null>('tab1');
      return (
        <Tabs.Root bind:value={selected}>
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2" disabled>
              Tab 2
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Panel 1</Tabs.Content>
          <Tabs.Content value="tab2">Panel 2</Tabs.Content>
        </Tabs.Root>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const trigger2 = screen.querySelector('[value="tab2"]');
    expect(trigger2?.hasAttribute('disabled')).toBe(true);
    expect(trigger2?.hasAttribute('data-disabled')).toBe(true);

    await userEvent('[value="tab2"]', 'click');
    expect(trigger2?.getAttribute('aria-selected')).toBe('false');
  });

  it('value に空白や記号を含む場合に安全な ID が生成され、Trigger と Content が一致する', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Tabs.Root defaultValue="tab / 1 with space!">
        <Tabs.List>
          <Tabs.Trigger value="tab / 1 with space!">Tab 1</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab / 1 with space!">Panel 1</Tabs.Content>
      </Tabs.Root>,
    );

    const trigger = screen.querySelector('[data-leve-tabs-trigger]');
    const content = screen.querySelector('[data-leve-tabs-content]');

    const triggerId = trigger?.getAttribute('id');
    const contentId = content?.getAttribute('id');

    expect(triggerId).toContain('-trigger-tab---1-with-space-');
    expect(contentId).toContain('-content-tab---1-with-space-');
    expect(trigger?.getAttribute('aria-controls')).toBe(contentId);
    expect(content?.getAttribute('aria-labelledby')).toBe(triggerId);
  });

  it('各パーツに任意の props（class, aria-label など）が渡る', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Tabs.Root class="custom-root" data-custom="root">
        <Tabs.List class="custom-list" aria-label="Custom tablist">
          <Tabs.Trigger value="t1" class="custom-trigger" aria-label="First tab">
            Tab 1
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="t1" class="custom-content" data-panel="1">
          Content 1
        </Tabs.Content>
      </Tabs.Root>,
    );

    const root = screen.querySelector('.custom-root');
    const list = screen.querySelector('.custom-list');
    const trigger = screen.querySelector('.custom-trigger');
    const content = screen.querySelector('.custom-content');

    expect(root?.getAttribute('data-custom')).toBe('root');
    expect(list?.getAttribute('aria-label')).toBe('Custom tablist');
    expect(trigger?.getAttribute('aria-label')).toBe('First tab');
    expect(content?.getAttribute('data-panel')).toBe('1');
  });

  it('Root の orientation 変更が List / Trigger / Content にリアクティブに反映される', async () => {
    const Parent = component$(() => {
      const orientation = useSignal<'horizontal' | 'vertical'>('horizontal');
      return (
        <>
          <Tabs.Root orientation={orientation.value}>
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="tab1">Panel 1</Tabs.Content>
          </Tabs.Root>
          <button
            type="button"
            id="toggle-orientation"
            onClick$={() => {
              orientation.value = orientation.value === 'horizontal' ? 'vertical' : 'horizontal';
            }}
          >
            Toggle Orientation
          </button>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const root = screen.querySelector('[data-leve-tabs]');
    const list = screen.querySelector('[data-leve-tabs-list]');
    const trigger = screen.querySelector('[data-leve-tabs-trigger]');
    const content = screen.querySelector('[data-leve-tabs-content]');

    expect(root?.getAttribute('data-orientation')).toBe('horizontal');
    expect(list?.getAttribute('aria-orientation')).toBe('horizontal');
    expect(list?.getAttribute('data-orientation')).toBe('horizontal');
    expect(trigger?.getAttribute('data-orientation')).toBe('horizontal');
    expect(content?.getAttribute('data-orientation')).toBe('horizontal');

    await userEvent('#toggle-orientation', 'click');

    expect(root?.getAttribute('data-orientation')).toBe('vertical');
    expect(list?.getAttribute('aria-orientation')).toBe('vertical');
    expect(list?.getAttribute('data-orientation')).toBe('vertical');
    expect(trigger?.getAttribute('data-orientation')).toBe('vertical');
    expect(content?.getAttribute('data-orientation')).toBe('vertical');
  });

  it('Trigger がアンマウントされたとき登録が解除され、後続の有効な Trigger がタブストップになる', async () => {
    const Parent = component$(() => {
      const showFirst = useSignal(true);
      return (
        <>
          <Tabs.Root>
            <Tabs.List>
              {showFirst.value && <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>}
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="tab1">Panel 1</Tabs.Content>
            <Tabs.Content value="tab2">Panel 2</Tabs.Content>
          </Tabs.Root>
          <button
            type="button"
            id="remove-tab1"
            onClick$={() => {
              showFirst.value = false;
            }}
          >
            Remove Tab 1
          </button>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const triggersBefore = screen.querySelectorAll('[data-leve-tabs-trigger]');
    expect(triggersBefore[0]?.getAttribute('value')).toBe('tab1');
    expect(triggersBefore[0]?.getAttribute('tabindex')).toBe('0');
    expect(triggersBefore[1]?.getAttribute('tabindex')).toBe('-1');

    await userEvent('#remove-tab1', 'click');
    await new Promise((resolve) => setTimeout(resolve, 50));

    const triggersAfter = screen.querySelectorAll('[data-leve-tabs-trigger]');
    expect(triggersAfter.length).toBe(1);
    expect(triggersAfter[0]?.getAttribute('value')).toBe('tab2');
    expect(triggersAfter[0]?.getAttribute('tabindex')).toBe('0');
  });

  it('Trigger の value が変更されたとき古い登録が解除され、新しい value が登録される', async () => {
    const Parent = component$(() => {
      const firstVal = useSignal('tab1');
      return (
        <>
          <Tabs.Root defaultValue="tab1-renamed">
            <Tabs.List>
              <Tabs.Trigger value={firstVal.value}>Tab 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="tab1-renamed">Panel 1</Tabs.Content>
            <Tabs.Content value="tab2">Panel 2</Tabs.Content>
          </Tabs.Root>
          <button
            type="button"
            id="rename-tab1"
            onClick$={() => {
              firstVal.value = 'tab1-renamed';
            }}
          >
            Rename Tab 1
          </button>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    // 最初は tab1-renamed は未登録なので fallback で先頭（tab1）がタブストップ
    const triggersBefore = screen.querySelectorAll('[data-leve-tabs-trigger]');
    expect(triggersBefore[0]?.getAttribute('value')).toBe('tab1');
    expect(triggersBefore[0]?.getAttribute('tabindex')).toBe('0');
    expect(triggersBefore[0]?.getAttribute('aria-selected')).toBe('false');

    await userEvent('#rename-tab1', 'click');
    await new Promise((resolve) => setTimeout(resolve, 50));

    const triggersAfter = screen.querySelectorAll('[data-leve-tabs-trigger]');
    expect(triggersAfter[0]?.getAttribute('value')).toBe('tab1-renamed');
    expect(triggersAfter[0]?.getAttribute('tabindex')).toBe('0');
    expect(triggersAfter[0]?.getAttribute('aria-selected')).toBe('true');
  });

  it('存在しない defaultValue が指定された場合、最初の有効な Trigger が tabIndex=0 になる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Tabs.Root defaultValue="nonexistent">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Panel 1</Tabs.Content>
        <Tabs.Content value="tab2">Panel 2</Tabs.Content>
      </Tabs.Root>,
    );

    const triggers = screen.querySelectorAll('[data-leve-tabs-trigger]');
    expect(triggers[0]?.getAttribute('tabindex')).toBe('0');
    expect(triggers[0]?.getAttribute('aria-selected')).toBe('false');
    expect(triggers[1]?.getAttribute('tabindex')).toBe('-1');
    expect(triggers[1]?.getAttribute('aria-selected')).toBe('false');
  });

  it('選択中の Trigger が disabled の場合、最初の有効な Trigger が tabIndex=0 になる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Tabs.Root defaultValue="tab1">
        <Tabs.List>
          <Tabs.Trigger value="tab1" disabled>
            Tab 1
          </Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Panel 1</Tabs.Content>
        <Tabs.Content value="tab2">Panel 2</Tabs.Content>
        <Tabs.Content value="tab3">Panel 3</Tabs.Content>
      </Tabs.Root>,
    );

    await new Promise((resolve) => setTimeout(resolve, 10));

    const triggers = screen.querySelectorAll('[data-leve-tabs-trigger]');
    expect(triggers[0]?.getAttribute('tabindex')).toBe('-1');
    expect(triggers[0]?.getAttribute('aria-selected')).toBe('true');
    expect(triggers[1]?.getAttribute('tabindex')).toBe('0');
    expect(triggers[1]?.getAttribute('aria-selected')).toBe('false');
    expect(triggers[2]?.getAttribute('tabindex')).toBe('-1');
    expect(triggers[2]?.getAttribute('aria-selected')).toBe('false');
  });

  it('Trigger に as="a" を渡すと type を出力せず、aria 属性・aria-disabled・矢印キー自動選択が動く', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Tabs.Root defaultValue="t1">
        <Tabs.List aria-label="Link tabs">
          <Tabs.Trigger as="a" href="#t1" value="t1" class="tab-a">
            Tab 1
          </Tabs.Trigger>
          <Tabs.Trigger as="a" href="#t2" value="t2" disabled class="tab-disabled-a">
            Tab 2
          </Tabs.Trigger>
          <Tabs.Trigger as="a" href="#t3" value="t3" class="tab-c">
            Tab 3
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="t1">Panel 1</Tabs.Content>
        <Tabs.Content value="t2">Panel 2</Tabs.Content>
        <Tabs.Content value="t3">Panel 3</Tabs.Content>
      </Tabs.Root>,
    );

    const tab1 = screen.querySelector('.tab-a');
    const tab2 = screen.querySelector('.tab-disabled-a');
    const tab3 = screen.querySelector('.tab-c');

    expect(tab1?.tagName).toBe('A');
    expect(tab1?.hasAttribute('type')).toBe(false);
    expect(tab1?.getAttribute('role')).toBe('tab');
    expect(tab1?.getAttribute('href')).toBe('#t1');
    expect(tab1?.getAttribute('aria-selected')).toBe('true');
    expect(tab1?.getAttribute('tabindex')).toBe('0');

    expect(tab2?.tagName).toBe('A');
    expect(tab2?.hasAttribute('disabled')).toBe(false);
    expect(tab2?.getAttribute('aria-disabled')).toBe('true');
    expect(tab2?.hasAttribute('data-disabled')).toBe(true);
    expect(tab2?.getAttribute('tabindex')).toBe('-1');

    await userEvent('.tab-disabled-a', 'click');
    expect(tab1?.getAttribute('aria-selected')).toBe('true');

    await userEvent('.tab-a', 'keydown', { key: 'ArrowRight', target: tab1 });
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(tab3?.getAttribute('aria-selected')).toBe('true');
    expect(tab3?.getAttribute('data-state')).toBe('active');
    expect(tab1?.getAttribute('aria-selected')).toBe('false');
  });

  it('Trigger に as で Qwik コンポーネントを渡すと属性とハンドラが合成され、選択状態が追従する', async () => {
    type CustomTabProps = PropsOf<'a'> & {
      prefetch?: boolean;
    };

    const CustomTab = component$<CustomTabProps>(({ prefetch, onClick$, ...props }) => {
      const internalClicks = useSignal(0);

      return (
        <a
          {...props}
          data-prefetch={prefetch ? 'true' : undefined}
          data-internal-clicks={internalClicks.value}
          onClick$={[
            $(() => {
              internalClicks.value += 1;
            }),
            onClick$,
          ]}
        >
          <Slot />
        </a>
      );
    });

    const Parent = component$(() => {
      const clicks = useSignal(0);

      return (
        <Tabs.Root defaultValue="first">
          <Tabs.List aria-label="Custom tabs">
            <Tabs.Trigger as={CustomTab} href="/first" value="first" prefetch class="custom-first">
              First
            </Tabs.Trigger>
            <Tabs.Trigger
              as={CustomTab}
              href="/second"
              value="second"
              prefetch
              class="custom-second"
              onClick$={() => {
                clicks.value += 1;
              }}
            >
              Second ({clicks.value})
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="first">Panel 1</Tabs.Content>
          <Tabs.Content value="second">Panel 2</Tabs.Content>
        </Tabs.Root>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const first = screen.querySelector('.custom-first');
    const second = screen.querySelector('.custom-second');
    expect(first?.tagName).toBe('A');
    expect(first?.getAttribute('role')).toBe('tab');
    expect(first?.getAttribute('data-prefetch')).toBe('true');
    expect(first?.getAttribute('aria-selected')).toBe('true');
    expect(first?.getAttribute('tabindex')).toBe('0');

    expect(second?.tagName).toBe('A');
    expect(second?.getAttribute('aria-selected')).toBe('false');
    expect(second?.getAttribute('tabindex')).toBe('-1');

    await userEvent('.custom-second', 'click');
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(second?.getAttribute('data-internal-clicks')).toBe('1');
    expect(second?.textContent).toBe('Second (1)');
    expect(second?.getAttribute('aria-selected')).toBe('true');
    expect(second?.getAttribute('data-state')).toBe('active');
    expect(second?.getAttribute('tabindex')).toBe('0');
    expect(first?.getAttribute('aria-selected')).toBe('false');
    expect(first?.getAttribute('data-state')).toBe('inactive');
    expect(first?.getAttribute('tabindex')).toBe('-1');
  });
});
