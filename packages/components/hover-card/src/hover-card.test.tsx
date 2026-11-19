import { $, component$, type PropsOf, Slot, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { HoverCard } from './index';

function query(screen: HTMLElement, part: string) {
  return screen.querySelector<HTMLElement>(
    part ? `[data-leve-hover-card-${part}]` : '[data-leve-hover-card]',
  );
}

describe('HoverCard', () => {
  it('各パーツが正しい要素・role・data 属性で描画される', async () => {
    const { screen, render } = await createDOM();
    await render(
      <HoverCard.Root>
        <HoverCard.Trigger href="#ada">@ada</HoverCard.Trigger>
        <HoverCard.Content>
          Ada Lovelace
          <HoverCard.Arrow />
        </HoverCard.Content>
      </HoverCard.Root>,
    );

    expect(query(screen, '')?.tagName).toBe('SPAN');
    expect(query(screen, 'trigger')?.tagName).toBe('A');
    expect(query(screen, 'trigger')?.getAttribute('href')).toBe('#ada');
    expect(query(screen, 'content')?.hasAttribute('role')).toBe(false);
    expect(query(screen, 'content')?.getAttribute('popover')).toBe('manual');
    expect(query(screen, 'content')?.tagName).toBe('SPAN');
    expect(query(screen, 'arrow')?.tagName).toBe('SPAN');
    expect(query(screen, 'arrow')?.getAttribute('aria-hidden')).toBe('true');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
  });

  it('Trigger と Content を ARIA で関連付けない（補足のプレビュー）', async () => {
    const { screen, render } = await createDOM();
    await render(
      <HoverCard.Root>
        <HoverCard.Trigger href="#ada">@ada</HoverCard.Trigger>
        <HoverCard.Content>Ada Lovelace</HoverCard.Content>
      </HoverCard.Root>,
    );

    expect(query(screen, 'trigger')?.hasAttribute('aria-describedby')).toBe(false);
    expect(query(screen, 'trigger')?.hasAttribute('aria-expanded')).toBe(false);
  });

  it('Root の ids で ID を上書きでき、独自の props は属性として出力されない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <HoverCard.Root ids={{ trigger: 't', content: 'c' }} openDelay={0} class="root">
        <HoverCard.Trigger href="#ada" class="trigger">
          @ada
        </HoverCard.Trigger>
        <HoverCard.Content side="top" class="content">
          Ada Lovelace
        </HoverCard.Content>
      </HoverCard.Root>,
    );

    expect(query(screen, 'trigger')?.id).toBe('t');
    expect(query(screen, 'content')?.id).toBe('c');
    expect(query(screen, '')?.className).toBe('root');
    expect(query(screen, '')?.hasAttribute('opendelay')).toBe(false);
    expect(query(screen, 'trigger')?.className).toBe('trigger');
    expect(query(screen, 'content')?.className).toBe('content');
    expect(query(screen, 'content')?.hasAttribute('side')).toBe(false);
  });

  it('Trigger に as で要素名を渡すとその要素で描画され、属性と操作が維持される', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <HoverCard.Root defaultOpen>
        <HoverCard.Trigger as="button" type="button" class="custom-trigger">
          @ada
        </HoverCard.Trigger>
        <HoverCard.Content>Ada Lovelace</HoverCard.Content>
      </HoverCard.Root>,
    );

    const trigger = query(screen, 'trigger');
    expect(trigger?.tagName).toBe('BUTTON');
    expect(trigger?.getAttribute('type')).toBe('button');
    expect(trigger?.className).toBe('custom-trigger');
    expect(trigger?.getAttribute('data-state')).toBe('open');

    await userEvent('[data-leve-hover-card-trigger]', 'blur');
    expect(trigger?.getAttribute('data-state')).toBe('closed');
  });

  it('Trigger に as で Qwik コンポーネントを渡すと属性とハンドラが合成される', async () => {
    type CustomLinkProps = PropsOf<'a'> & {
      prefetch?: boolean;
    };

    const CustomLink = component$<CustomLinkProps>(({ prefetch, onBlur$, onClick$, ...props }) => {
      const internalBlurs = useSignal(0);
      const internalClicks = useSignal(0);

      return (
        <a
          {...props}
          data-prefetch={prefetch ? 'true' : undefined}
          data-internal-blurs={internalBlurs.value}
          data-internal-clicks={internalClicks.value}
          onBlur$={[
            $(() => {
              internalBlurs.value += 1;
            }),
            onBlur$,
          ]}
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
      const consumerClicks = useSignal(0);

      return (
        <HoverCard.Root defaultOpen>
          <HoverCard.Trigger
            as={CustomLink}
            href="/users/ada"
            prefetch
            onClick$={() => {
              consumerClicks.value += 1;
            }}
          >
            @ada ({consumerClicks.value})
          </HoverCard.Trigger>
          <HoverCard.Content>Ada Lovelace</HoverCard.Content>
        </HoverCard.Root>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const trigger = query(screen, 'trigger');
    expect(trigger?.tagName).toBe('A');
    expect(trigger?.getAttribute('href')).toBe('/users/ada');
    expect(trigger?.getAttribute('data-prefetch')).toBe('true');
    expect(trigger?.getAttribute('data-state')).toBe('open');

    await userEvent('[data-leve-hover-card-trigger]', 'blur');
    expect(trigger?.getAttribute('data-state')).toBe('closed');
    expect(trigger?.getAttribute('data-internal-blurs')).toBe('1');

    await userEvent('[data-leve-hover-card-trigger]', 'click');
    expect(trigger?.getAttribute('data-internal-clicks')).toBe('1');
    expect(trigger?.textContent).toBe('@ada (1)');
  });
});
