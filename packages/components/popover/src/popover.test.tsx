import { $, component$, type PropsOf, Slot, useSignal } from '@builder.io/qwik';
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
      <Popover.Root
        ids={{ trigger: 't', anchor: 'a', content: 'c', title: 'ti', description: 'd' }}
      >
        <Popover.Anchor>
          <Popover.Trigger>Open</Popover.Trigger>
        </Popover.Anchor>
        <Popover.Content side="top" align="start" sideOffset={8} class="content">
          <Popover.Title>Title</Popover.Title>
          <Popover.Description>Description</Popover.Description>
        </Popover.Content>
      </Popover.Root>,
    );

    expect(query(screen, 'trigger')?.id).toBe('t');
    expect(query(screen, 'anchor')?.id).toBe('a');
    expect(query(screen, 'content')?.id).toBe('c');
    expect(query(screen, 'title')?.id).toBe('ti');
    expect(query(screen, 'description')?.id).toBe('d');
    const content = query(screen, 'content');
    expect(content?.className).toBe('content');
    expect(content?.hasAttribute('side')).toBe(false);
    expect(content?.hasAttribute('sideoffset')).toBe(false);
  });

  it('Trigger / Close / Anchor に as で Qwik コンポーネントを渡すと属性とハンドラが合成される', async () => {
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

    const CustomAnchor = component$<PropsOf<'section'>>((props) => (
      <section {...props}>
        <Slot />
      </section>
    ));

    const { screen, render, userEvent } = await createDOM();
    await render(
      <Popover.Root>
        <Popover.Anchor as={CustomAnchor} class="custom-anchor">
          <Popover.Trigger as={CustomButton} variant="primary">
            Open
          </Popover.Trigger>
        </Popover.Anchor>
        <Popover.Content>
          <Popover.Close as={CustomButton} variant="secondary">
            Close
          </Popover.Close>
        </Popover.Content>
      </Popover.Root>,
    );

    const anchor = query(screen, 'anchor');
    const trigger = query(screen, 'trigger');
    const content = query(screen, 'content');
    const close = query(screen, 'close');

    expect(anchor?.tagName).toBe('SECTION');
    expect(anchor?.className).toBe('custom-anchor');
    expect(anchor?.id).toBeTruthy();
    expect(trigger?.getAttribute('data-variant')).toBe('primary');
    expect(trigger?.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(trigger?.getAttribute('aria-controls')).toBe(content?.id);
    expect(close?.getAttribute('data-variant')).toBe('secondary');

    await userEvent('[data-leve-popover-trigger]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('open');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(trigger?.getAttribute('data-internal-clicks')).toBe('1');

    await userEvent('[data-leve-popover-close]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
    expect(close?.getAttribute('data-internal-clicks')).toBe('1');
  });
});
