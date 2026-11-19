import { $, component$, type PropsOf, Slot, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Drawer } from './index';

function query(screen: HTMLElement, part: string) {
  return screen.querySelector<HTMLElement>(
    part ? `[data-leve-drawer-${part}]` : '[data-leve-drawer]',
  );
}

describe('Drawer', () => {
  it('各パーツが正しい要素と data 属性で描画される', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Drawer.Root>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Title</Drawer.Title>
          <Drawer.Description>Description</Drawer.Description>
          <Drawer.Close>Close</Drawer.Close>
        </Drawer.Content>
      </Drawer.Root>,
    );

    expect(query(screen, '')?.tagName).toBe('DIV');
    expect(query(screen, 'trigger')?.tagName).toBe('BUTTON');
    expect(query(screen, 'content')?.tagName).toBe('DIALOG');
    expect(query(screen, 'title')?.tagName).toBe('H2');
    expect(query(screen, 'description')?.tagName).toBe('P');
    expect(query(screen, 'close')?.tagName).toBe('BUTTON');
    expect(query(screen, 'trigger')?.getAttribute('type')).toBe('button');
    expect(query(screen, 'close')?.getAttribute('type')).toBe('button');
  });

  it('Trigger と Content の ARIA 属性が関連付けられる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Drawer.Root>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Title</Drawer.Title>
          <Drawer.Description>Description</Drawer.Description>
        </Drawer.Content>
      </Drawer.Root>,
    );

    const trigger = query(screen, 'trigger');
    const content = query(screen, 'content');
    const title = query(screen, 'title');
    const description = query(screen, 'description');

    expect(trigger?.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(trigger?.getAttribute('aria-controls')).toBe(content?.id);
    expect(content?.hasAttribute('aria-modal')).toBe(false);
    expect(content?.getAttribute('aria-labelledby')).toBe(title?.id);
    expect(content?.getAttribute('aria-describedby')).toBe(description?.id);
  });

  it('閉じた状態では data-state="closed" で、<dialog> に open 属性が付かない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Drawer.Root>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Content>Content</Drawer.Content>
      </Drawer.Root>,
    );

    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
    expect(query(screen, 'trigger')?.getAttribute('data-state')).toBe('closed');
    expect(query(screen, 'content')?.getAttribute('data-state')).toBe('closed');
    expect(query(screen, 'content')?.hasAttribute('open')).toBe(false);
  });

  it('Trigger のクリックで開き、Close のクリックで閉じる', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Drawer.Root>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Close>Close</Drawer.Close>
        </Drawer.Content>
      </Drawer.Root>,
    );

    await userEvent('[data-leve-drawer-trigger]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('open');
    expect(query(screen, 'trigger')?.getAttribute('aria-expanded')).toBe('true');
    expect(query(screen, 'content')?.getAttribute('data-state')).toBe('open');

    await userEvent('[data-leve-drawer-close]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
  });

  it('開いているときに Trigger を押すと閉じる', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Drawer.Root defaultOpen>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Content>Content</Drawer.Content>
      </Drawer.Root>,
    );

    await userEvent('[data-leve-drawer-trigger]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
  });

  it('既定は非モーダルで popover="manual" を、modal では aria-modal="true" を出力する', async () => {
    const { screen, render } = await createDOM();
    await render(
      <>
        <Drawer.Root>
          <Drawer.Content>Non-modal</Drawer.Content>
        </Drawer.Root>
        <Drawer.Root modal>
          <Drawer.Content>Modal</Drawer.Content>
        </Drawer.Root>
      </>,
    );

    const [nonModal, modal] = screen.querySelectorAll('[data-leve-drawer-content]');
    expect(nonModal.getAttribute('popover')).toBe('manual');
    expect(nonModal.hasAttribute('aria-modal')).toBe(false);
    expect(modal.hasAttribute('popover')).toBe(false);
    expect(modal.getAttribute('aria-modal')).toBe('true');
  });

  it('side を Root と Content の data-side に出力する（既定は right）', async () => {
    const { screen, render } = await createDOM();
    await render(
      <>
        <Drawer.Root>
          <Drawer.Content>Right</Drawer.Content>
        </Drawer.Root>
        <Drawer.Root side="left">
          <Drawer.Content>Left</Drawer.Content>
        </Drawer.Root>
      </>,
    );

    const [right, left] = screen.querySelectorAll('[data-leve-drawer]');
    const [rightContent, leftContent] = screen.querySelectorAll('[data-leve-drawer-content]');
    expect(right.getAttribute('data-side')).toBe('right');
    expect(rightContent.getAttribute('data-side')).toBe('right');
    expect(left.getAttribute('data-side')).toBe('left');
    expect(leftContent.getAttribute('data-side')).toBe('left');
    expect(left.hasAttribute('side')).toBe(false);
  });

  it('defaultOpen で開いた状態から始まる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Drawer.Root defaultOpen>
        <Drawer.Content>Content</Drawer.Content>
      </Drawer.Root>,
    );

    expect(query(screen, 'content')?.getAttribute('data-state')).toBe('open');
  });

  it('bind:open で制御でき、onOpenChange$ が呼ばれる', async () => {
    const changes: boolean[] = [];
    const Controlled = component$(() => {
      const open = useSignal(false);
      return (
        <>
          <button type="button" id="external" onClick$={() => (open.value = true)}>
            External
          </button>
          <span id="value">{String(open.value)}</span>
          <Drawer.Root bind:open={open} onOpenChange$={(value) => changes.push(value)}>
            <Drawer.Trigger>Open</Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Close>Close</Drawer.Close>
            </Drawer.Content>
          </Drawer.Root>
        </>
      );
    });
    const { screen, render, userEvent } = await createDOM();
    await render(<Controlled />);

    await userEvent('#external', 'click');
    expect(query(screen, 'content')?.getAttribute('data-state')).toBe('open');

    await userEvent('[data-leve-drawer-close]', 'click');
    expect(screen.querySelector('#value')?.textContent).toBe('false');
    expect(changes).toEqual([false]);
  });

  it('Root の ids で各パーツの ID を上書きできる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Drawer.Root ids={{ trigger: 't', content: 'c', title: 'ti', description: 'd' }}>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Title</Drawer.Title>
          <Drawer.Description>Description</Drawer.Description>
        </Drawer.Content>
      </Drawer.Root>,
    );

    expect(query(screen, 'trigger')?.id).toBe('t');
    expect(query(screen, 'content')?.id).toBe('c');
    expect(query(screen, 'title')?.id).toBe('ti');
    expect(query(screen, 'description')?.id).toBe('d');
  });

  it('任意の props が要素に渡り、独自の props は属性として出力されない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Drawer.Root class="root">
        <Drawer.Trigger class="trigger">Open</Drawer.Trigger>
        <Drawer.Content class="content" closeOnEscape={false}>
          <Drawer.Title class="title">Title</Drawer.Title>
          <Drawer.Close aria-label="Close">x</Drawer.Close>
        </Drawer.Content>
      </Drawer.Root>,
    );

    expect(query(screen, '')?.className).toBe('root');
    expect(query(screen, 'trigger')?.className).toBe('trigger');
    expect(query(screen, 'content')?.className).toBe('content');
    expect(query(screen, 'title')?.className).toBe('title');
    expect(query(screen, 'close')?.getAttribute('aria-label')).toBe('Close');
    expect(query(screen, 'content')?.hasAttribute('closeonescape')).toBe(false);
    expect(query(screen, '')?.hasAttribute('defaultopen')).toBe(false);
  });

  it('利用者が指定しても role 関連の必須属性は上書きされない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Drawer.Root modal>
        <Drawer.Trigger aria-haspopup="menu">Open</Drawer.Trigger>
        <Drawer.Content aria-modal="false">Content</Drawer.Content>
      </Drawer.Root>,
    );

    expect(query(screen, 'trigger')?.getAttribute('aria-haspopup')).toBe('dialog');
    expect(query(screen, 'content')?.getAttribute('aria-modal')).toBe('true');
  });

  it('Trigger / Close に as で Qwik コンポーネントを渡すと属性とハンドラが合成される', async () => {
    type CustomButtonProps = PropsOf<'button'> & {
      variant?: string;
    };

    const CustomButton = component$<CustomButtonProps>(({ variant, onClick$, ...props }) => {
      const internalClicks = useSignal(0);

      return (
        <button
          type="button"
          {...props}
          data-variant={variant}
          data-internal-clicks={internalClicks.value}
          onClick$={[
            $(() => {
              internalClicks.value += 1;
            }),
            onClick$,
          ]}
        >
          <Slot />
        </button>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(
      <Drawer.Root>
        <Drawer.Trigger as={CustomButton} variant="primary">
          Open
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Close as={CustomButton} variant="secondary">
            Close
          </Drawer.Close>
        </Drawer.Content>
      </Drawer.Root>,
    );

    const trigger = query(screen, 'trigger');
    const content = query(screen, 'content');
    const close = query(screen, 'close');
    expect(trigger?.getAttribute('data-variant')).toBe('primary');
    expect(trigger?.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger?.getAttribute('aria-controls')).toBe(content?.id);
    expect(close?.getAttribute('data-variant')).toBe('secondary');

    await userEvent('[data-leve-drawer-trigger]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('open');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(trigger?.getAttribute('data-internal-clicks')).toBe('1');

    await userEvent('[data-leve-drawer-close]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
    expect(close?.getAttribute('data-internal-clicks')).toBe('1');
  });
});
