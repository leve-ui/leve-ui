import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Tooltip } from './index';

function query(screen: HTMLElement, part: string) {
  return screen.querySelector<HTMLElement>(
    part ? `[data-leve-tooltip-${part}]` : '[data-leve-tooltip]',
  );
}

describe('Tooltip', () => {
  it('各パーツが正しい要素・role・data 属性で描画される', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Tooltip.Root>
        <Tooltip.Trigger>Save</Tooltip.Trigger>
        <Tooltip.Content>
          Save the document
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip.Root>,
    );

    expect(query(screen, '')?.tagName).toBe('SPAN');
    expect(query(screen, 'trigger')?.tagName).toBe('BUTTON');
    expect(query(screen, 'trigger')?.getAttribute('type')).toBe('button');
    expect(query(screen, 'content')?.getAttribute('role')).toBe('tooltip');
    expect(query(screen, 'content')?.getAttribute('popover')).toBe('manual');
    expect(query(screen, 'arrow')?.getAttribute('aria-hidden')).toBe('true');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
  });

  it('Trigger の aria-describedby が Content を指す', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Tooltip.Root>
        <Tooltip.Trigger>Save</Tooltip.Trigger>
        <Tooltip.Content>Save the document</Tooltip.Content>
      </Tooltip.Root>,
    );

    const content = query(screen, 'content');
    expect(query(screen, 'trigger')?.getAttribute('aria-describedby')).toBe(content?.id);
  });

  it('フォーカスで開き、フォーカスが外れると閉じる', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Tooltip.Root>
        <Tooltip.Trigger>Save</Tooltip.Trigger>
        <Tooltip.Content>Save the document</Tooltip.Content>
      </Tooltip.Root>,
    );

    await userEvent('[data-leve-tooltip-trigger]', 'focus');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('open');
    expect(query(screen, 'trigger')?.getAttribute('data-state')).toBe('open');
    expect(query(screen, 'content')?.getAttribute('data-state')).toBe('open');

    await userEvent('[data-leve-tooltip-trigger]', 'blur');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
  });

  it('Root の ids で ID を上書きでき、独自の props は属性として出力されない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Tooltip.Root ids={{ trigger: 't', content: 'c' }} openDelay={0} class="root">
        <Tooltip.Trigger class="trigger">Save</Tooltip.Trigger>
        <Tooltip.Content side="bottom" class="content">
          Save the document
        </Tooltip.Content>
      </Tooltip.Root>,
    );

    expect(query(screen, 'trigger')?.id).toBe('t');
    expect(query(screen, 'content')?.id).toBe('c');
    expect(query(screen, '')?.className).toBe('root');
    expect(query(screen, '')?.hasAttribute('opendelay')).toBe(false);
    expect(query(screen, 'trigger')?.className).toBe('trigger');
    expect(query(screen, 'content')?.className).toBe('content');
    expect(query(screen, 'content')?.hasAttribute('side')).toBe(false);
  });
});
