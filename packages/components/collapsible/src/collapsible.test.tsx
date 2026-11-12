import { component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Collapsible } from './index';

describe('Collapsible', () => {
  it('全パーツが正しい要素と data 属性で描画され、Trigger に type="button"、aria-expanded="false"、aria-controls が付き、Content に id と hidden が付く', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Collapsible.Root>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content body</Collapsible.Content>
      </Collapsible.Root>,
    );

    const root = screen.querySelector('[data-leve-collapsible]');
    const trigger = screen.querySelector('[data-leve-collapsible-trigger]');
    const content = screen.querySelector('[data-leve-collapsible-content]');

    expect(root).not.toBeNull();
    expect(root?.tagName).toBe('DIV');
    expect(root?.hasAttribute('data-leve-collapsible')).toBe(true);
    expect(root?.getAttribute('data-state')).toBe('closed');
    expect(root?.hasAttribute('data-disabled')).toBe(false);

    expect(trigger).not.toBeNull();
    expect(trigger?.tagName).toBe('BUTTON');
    expect(trigger?.getAttribute('type')).toBe('button');
    expect(trigger?.hasAttribute('data-leve-collapsible-trigger')).toBe(true);
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(trigger?.getAttribute('data-state')).toBe('closed');
    expect(trigger?.hasAttribute('data-disabled')).toBe(false);
    expect(trigger?.hasAttribute('disabled')).toBe(false);

    expect(content).not.toBeNull();
    expect(content?.tagName).toBe('DIV');
    expect(content?.hasAttribute('data-leve-collapsible-content')).toBe(true);
    expect(content?.getAttribute('data-state')).toBe('closed');
    expect(content?.hasAttribute('data-disabled')).toBe(false);
    expect(content?.hasAttribute('hidden')).toBe(true);

    const triggerId = trigger?.getAttribute('id');
    const contentId = content?.getAttribute('id');
    const ariaControls = trigger?.getAttribute('aria-controls');

    expect(triggerId).toBeTruthy();
    expect(contentId).toBeTruthy();
    expect(ariaControls).toBe(contentId);
  });

  it('defaultOpen を指定すると初期状態で aria-expanded="true"、data-state="open" となり、Content に hidden が付かない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content body</Collapsible.Content>
      </Collapsible.Root>,
    );

    const root = screen.querySelector('[data-leve-collapsible]');
    const trigger = screen.querySelector('[data-leve-collapsible-trigger]');
    const content = screen.querySelector('[data-leve-collapsible-content]');

    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(root?.getAttribute('data-state')).toBe('open');
    expect(trigger?.getAttribute('data-state')).toBe('open');
    expect(content?.getAttribute('data-state')).toBe('open');
    expect(content?.hasAttribute('hidden')).toBe(false);
  });

  it('Trigger のクリックで非制御トグルし、aria-expanded、全パーツの data-state、Content の hidden が更新される', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Collapsible.Root>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Content body</Collapsible.Content>
      </Collapsible.Root>,
    );

    const root = screen.querySelector('[data-leve-collapsible]');
    const trigger = screen.querySelector('[data-leve-collapsible-trigger]');
    const content = screen.querySelector('[data-leve-collapsible-content]');

    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(content?.hasAttribute('hidden')).toBe(true);

    await userEvent('[data-leve-collapsible-trigger]', 'click');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(root?.getAttribute('data-state')).toBe('open');
    expect(trigger?.getAttribute('data-state')).toBe('open');
    expect(content?.getAttribute('data-state')).toBe('open');
    expect(content?.hasAttribute('hidden')).toBe(false);

    await userEvent('[data-leve-collapsible-trigger]', 'click');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(root?.getAttribute('data-state')).toBe('closed');
    expect(trigger?.getAttribute('data-state')).toBe('closed');
    expect(content?.getAttribute('data-state')).toBe('closed');
    expect(content?.hasAttribute('hidden')).toBe(true);
  });

  it('bind:open で初期値が反映され、クリックで Signal が更新され、外部からの Signal 変更で開閉状態が更新される', async () => {
    const Parent = component$(() => {
      const open = useSignal(false);
      return (
        <>
          <Collapsible.Root bind:open={open}>
            <Collapsible.Trigger>Toggle</Collapsible.Trigger>
            <Collapsible.Content>Body</Collapsible.Content>
          </Collapsible.Root>
          <span id="signal-value">{open.value ? 'open' : 'closed'}</span>
          <button
            type="button"
            id="external-toggle"
            onClick$={() => {
              open.value = true;
            }}
          >
            Open Externally
          </button>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const trigger = screen.querySelector('[data-leve-collapsible-trigger]');
    const content = screen.querySelector('[data-leve-collapsible-content]');

    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(screen.querySelector('#signal-value')?.textContent).toBe('closed');
    expect(content?.hasAttribute('hidden')).toBe(true);

    await userEvent('[data-leve-collapsible-trigger]', 'click');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(screen.querySelector('#signal-value')?.textContent).toBe('open');
    expect(content?.hasAttribute('hidden')).toBe(false);

    await userEvent('[data-leve-collapsible-trigger]', 'click');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(screen.querySelector('#signal-value')?.textContent).toBe('closed');
    expect(content?.hasAttribute('hidden')).toBe(true);

    await userEvent('#external-toggle', 'click');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(screen.querySelector('#signal-value')?.textContent).toBe('open');
    expect(content?.hasAttribute('hidden')).toBe(false);
  });

  it('クリック時に onOpenChange$ が新しい値で呼ばれる', async () => {
    const Parent = component$(() => {
      const log = useSignal<boolean[]>([]);
      return (
        <>
          <Collapsible.Root
            onOpenChange$={(open) => {
              log.value = [...log.value, open];
            }}
          >
            <Collapsible.Trigger>Toggle</Collapsible.Trigger>
            <Collapsible.Content>Body</Collapsible.Content>
          </Collapsible.Root>
          <output id="change-log">{log.value.map(String).join(',')}</output>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    await userEvent('[data-leve-collapsible-trigger]', 'click');
    expect(screen.querySelector('#change-log')?.textContent).toBe('true');

    await userEvent('[data-leve-collapsible-trigger]', 'click');
    expect(screen.querySelector('#change-log')?.textContent).toBe('true,false');
  });

  it('disabled のときは Trigger に disabled が付き、全パーツに data-disabled が付き、クリックしても開かない', async () => {
    const Parent = component$(() => {
      const changed = useSignal(false);
      return (
        <>
          <Collapsible.Root
            disabled
            onOpenChange$={() => {
              changed.value = true;
            }}
          >
            <Collapsible.Trigger>Toggle</Collapsible.Trigger>
            <Collapsible.Content>Body</Collapsible.Content>
          </Collapsible.Root>
          <output id="changed-output">{changed.value ? 'yes' : 'no'}</output>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const root = screen.querySelector('[data-leve-collapsible]');
    const trigger = screen.querySelector('[data-leve-collapsible-trigger]');
    const content = screen.querySelector('[data-leve-collapsible-content]');

    expect(trigger?.hasAttribute('disabled')).toBe(true);
    expect(root?.hasAttribute('data-disabled')).toBe(true);
    expect(trigger?.hasAttribute('data-disabled')).toBe(true);
    expect(content?.hasAttribute('data-disabled')).toBe(true);

    await userEvent('[data-leve-collapsible-trigger]', 'click');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(content?.hasAttribute('hidden')).toBe(true);
    expect(screen.querySelector('#changed-output')?.textContent).toBe('no');
  });

  it('ids で Trigger と Content の id を上書きでき、Root div には ids 属性が出力されない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Collapsible.Root ids={{ trigger: 'custom-trig', content: 'custom-cont' }}>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Body</Collapsible.Content>
      </Collapsible.Root>,
    );

    const root = screen.querySelector('[data-leve-collapsible]');
    const trigger = screen.querySelector('[data-leve-collapsible-trigger]');
    const content = screen.querySelector('[data-leve-collapsible-content]');

    expect(trigger?.getAttribute('id')).toBe('custom-trig');
    expect(content?.getAttribute('id')).toBe('custom-cont');
    expect(trigger?.getAttribute('aria-controls')).toBe('custom-cont');
    expect(root?.hasAttribute('ids')).toBe(false);
  });

  it('class や aria-label などの任意 props が各要素に渡り、Root の独自 props は Root div の DOM 属性にならない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Collapsible.Root class="root-cls" defaultOpen disabled data-testid="root-el">
        <Collapsible.Trigger class="trigger-cls" aria-label="Toggle section">
          Toggle
        </Collapsible.Trigger>
        <Collapsible.Content class="content-cls" title="Section content">
          Body
        </Collapsible.Content>
      </Collapsible.Root>,
    );

    const root = screen.querySelector('[data-leve-collapsible]');
    const trigger = screen.querySelector('[data-leve-collapsible-trigger]');
    const content = screen.querySelector('[data-leve-collapsible-content]');

    expect(root?.getAttribute('class')).toBe('root-cls');
    expect(root?.getAttribute('data-testid')).toBe('root-el');
    expect(root?.hasAttribute('defaultopen')).toBe(false);
    expect(root?.hasAttribute('disabled')).toBe(false);

    expect(trigger?.getAttribute('class')).toBe('trigger-cls');
    expect(trigger?.getAttribute('aria-label')).toBe('Toggle section');

    expect(content?.getAttribute('class')).toBe('content-cls');
    expect(content?.getAttribute('title')).toBe('Section content');
  });

  it('Trigger に渡した利用者の onClick$ が呼ばれる（イベント合成）', async () => {
    const Parent = component$(() => {
      const clicked = useSignal(false);
      return (
        <>
          <Collapsible.Root>
            <Collapsible.Trigger
              onClick$={() => {
                clicked.value = true;
              }}
            >
              Toggle
            </Collapsible.Trigger>
            <Collapsible.Content>Body</Collapsible.Content>
          </Collapsible.Root>
          <output id="clicked-state">{clicked.value ? 'yes' : 'no'}</output>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const trigger = screen.querySelector('[data-leve-collapsible-trigger]');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(screen.querySelector('#clicked-state')?.textContent).toBe('no');

    await userEvent('[data-leve-collapsible-trigger]', 'click');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(screen.querySelector('#clicked-state')?.textContent).toBe('yes');
  });
});
