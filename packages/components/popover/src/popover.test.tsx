import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Popover } from './index';

function query(screen: HTMLElement, part: string) {
  return screen.querySelector<HTMLElement>(
    part ? `[data-leve-popover-${part}]` : '[data-leve-popover]',
  );
}

describe('Popover', () => {
  it('各パーツが正しい要素・role・data 属性で描画される', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Popover.Root>
        <Popover.Anchor>
          <Popover.Trigger>Open</Popover.Trigger>
        </Popover.Anchor>
        <Popover.Content>
          <Popover.Title>Title</Popover.Title>
          <Popover.Description>Description</Popover.Description>
          <Popover.Close>Close</Popover.Close>
          <Popover.Arrow />
        </Popover.Content>
      </Popover.Root>,
    );

    expect(query(screen, '')?.tagName).toBe('DIV');
    expect(query(screen, 'anchor')?.tagName).toBe('DIV');
    expect(query(screen, 'trigger')?.getAttribute('type')).toBe('button');
    expect(query(screen, 'content')?.getAttribute('role')).toBe('dialog');
    expect(query(screen, 'content')?.getAttribute('popover')).toBe('manual');
    expect(query(screen, 'title')?.tagName).toBe('H2');
    expect(query(screen, 'description')?.tagName).toBe('P');
    expect(query(screen, 'close')?.getAttribute('type')).toBe('button');
    expect(query(screen, 'arrow')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('Trigger と Content の ARIA 属性が関連付けられる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Popover.Root>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>
          <Popover.Title>Title</Popover.Title>
          <Popover.Description>Description</Popover.Description>
        </Popover.Content>
      </Popover.Root>,
    );

    const trigger = query(screen, 'trigger');
    const content = query(screen, 'content');
    expect(trigger?.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(trigger?.getAttribute('aria-controls')).toBe(content?.id);
    expect(content?.getAttribute('aria-labelledby')).toBe(query(screen, 'title')?.id);
    expect(content?.getAttribute('aria-describedby')).toBe(query(screen, 'description')?.id);
    expect(content?.hasAttribute('aria-modal')).toBe(false);
  });

  it('Content に aria-label を渡すと aria-labelledby を出力しない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Popover.Root>
        <Popover.Content aria-label="Filters">Content</Popover.Content>
      </Popover.Root>,
    );

    const content = query(screen, 'content');
    expect(content?.getAttribute('aria-label')).toBe('Filters');
    expect(content?.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('Trigger で開閉し、Close で閉じる', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Popover.Root>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>
          <Popover.Close>Close</Popover.Close>
        </Popover.Content>
      </Popover.Root>,
    );

    await userEvent('[data-leve-popover-trigger]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('open');
    expect(query(screen, 'content')?.getAttribute('data-state')).toBe('open');
    expect(query(screen, 'trigger')?.getAttribute('aria-expanded')).toBe('true');

    await userEvent('[data-leve-popover-trigger]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');

    await userEvent('[data-leve-popover-trigger]', 'click');
    await userEvent('[data-leve-popover-close]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
  });

  it('Root の ids で ID を上書きでき、Content の位置の props は属性として出力されない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Popover.Root ids={{ trigger: 't', content: 'c', title: 'ti', description: 'd' }}>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content side="top" align="start" sideOffset={8} class="content">
          <Popover.Title>Title</Popover.Title>
          <Popover.Description>Description</Popover.Description>
        </Popover.Content>
      </Popover.Root>,
    );

    expect(query(screen, 'trigger')?.id).toBe('t');
    expect(query(screen, 'content')?.id).toBe('c');
    expect(query(screen, 'title')?.id).toBe('ti');
    expect(query(screen, 'description')?.id).toBe('d');
    const content = query(screen, 'content');
    expect(content?.className).toBe('content');
    expect(content?.hasAttribute('side')).toBe(false);
    expect(content?.hasAttribute('sideoffset')).toBe(false);
  });
});
