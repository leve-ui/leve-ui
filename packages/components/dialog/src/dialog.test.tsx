import { component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Dialog } from './index';

function query(screen: HTMLElement, part: string) {
  return screen.querySelector<HTMLElement>(
    part ? `[data-leve-dialog-${part}]` : '[data-leve-dialog]',
  );
}

describe('Dialog', () => {
  it('各パーツが正しい要素と data 属性で描画される', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Description>Description</Dialog.Description>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>,
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
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Description>Description</Dialog.Description>
        </Dialog.Content>
      </Dialog.Root>,
    );

    const trigger = query(screen, 'trigger');
    const content = query(screen, 'content');
    const title = query(screen, 'title');
    const description = query(screen, 'description');

    expect(trigger?.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(trigger?.getAttribute('aria-controls')).toBe(content?.id);
    expect(content?.getAttribute('aria-modal')).toBe('true');
    expect(content?.getAttribute('aria-labelledby')).toBe(title?.id);
    expect(content?.getAttribute('aria-describedby')).toBe(description?.id);
  });

  it('閉じた状態では data-state="closed" で、<dialog> に open 属性が付かない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content>Content</Dialog.Content>
      </Dialog.Root>,
    );

    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
    expect(query(screen, 'trigger')?.getAttribute('data-state')).toBe('closed');
    expect(query(screen, 'content')?.getAttribute('data-state')).toBe('closed');
    expect(query(screen, 'content')?.hasAttribute('open')).toBe(false);
  });

  it('Trigger のクリックで開き、Close のクリックで閉じる', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>,
    );

    await userEvent('[data-leve-dialog-trigger]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('open');
    expect(query(screen, 'trigger')?.getAttribute('aria-expanded')).toBe('true');
    expect(query(screen, 'content')?.getAttribute('data-state')).toBe('open');

    await userEvent('[data-leve-dialog-close]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
  });

  it('defaultOpen で開いた状態から始まる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Dialog.Root defaultOpen>
        <Dialog.Content>Content</Dialog.Content>
      </Dialog.Root>,
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
          <Dialog.Root bind:open={open} onOpenChange$={(value) => changes.push(value)}>
            <Dialog.Trigger>Open</Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Close>Close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Root>
        </>
      );
    });
    const { screen, render, userEvent } = await createDOM();
    await render(<Controlled />);

    await userEvent('#external', 'click');
    expect(query(screen, 'content')?.getAttribute('data-state')).toBe('open');

    await userEvent('[data-leve-dialog-close]', 'click');
    expect(screen.querySelector('#value')?.textContent).toBe('false');
    expect(changes).toEqual([false]);
  });

  it('Root の ids で各パーツの ID を上書きできる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Dialog.Root ids={{ trigger: 't', content: 'c', title: 'ti', description: 'd' }}>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Description>Description</Dialog.Description>
        </Dialog.Content>
      </Dialog.Root>,
    );

    expect(query(screen, 'trigger')?.id).toBe('t');
    expect(query(screen, 'content')?.id).toBe('c');
    expect(query(screen, 'title')?.id).toBe('ti');
    expect(query(screen, 'description')?.id).toBe('d');
  });

  it('任意の props が要素に渡り、独自の props は属性として出力されない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Dialog.Root class="root">
        <Dialog.Trigger class="trigger">Open</Dialog.Trigger>
        <Dialog.Content class="content" closeOnEscape={false}>
          <Dialog.Title class="title">Title</Dialog.Title>
          <Dialog.Close aria-label="Close">x</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>,
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
      <Dialog.Root>
        <Dialog.Trigger aria-haspopup="menu">Open</Dialog.Trigger>
        <Dialog.Content aria-modal="false">Content</Dialog.Content>
      </Dialog.Root>,
    );

    expect(query(screen, 'trigger')?.getAttribute('aria-haspopup')).toBe('dialog');
    expect(query(screen, 'content')?.getAttribute('aria-modal')).toBe('true');
  });
});
