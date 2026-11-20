import { $, component$, type PropsOf, Slot, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { Toggle } from '@leve-ui/toggle';
import { ToggleGroup } from '@leve-ui/toggle-group';
import { describe, expect, it } from 'vitest';
import { Toolbar } from './index';

describe('Toolbar', () => {
  it('各パーツが正しい要素・role・data 属性で描画される', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Toolbar.Root aria-label="Formatting">
        <Toolbar.Button>Bold</Toolbar.Button>
        <Toolbar.Separator />
        <Toolbar.Link href="#help">Help</Toolbar.Link>
      </Toolbar.Root>,
    );

    const root = screen.querySelector('[data-leve-toolbar]');
    const button = screen.querySelector('[data-leve-toolbar-button]');
    const separator = screen.querySelector('[data-leve-toolbar-separator]');
    const link = screen.querySelector('[data-leve-toolbar-link]');

    expect(root?.tagName).toBe('DIV');
    expect(root?.getAttribute('role')).toBe('toolbar');
    expect(root?.getAttribute('aria-orientation')).toBe('horizontal');
    expect(root?.getAttribute('data-orientation')).toBe('horizontal');
    expect(button?.tagName).toBe('BUTTON');
    expect(button?.getAttribute('type')).toBe('button');
    expect(link?.tagName).toBe('A');
    expect(separator?.getAttribute('role')).toBe('separator');
    expect(button?.hasAttribute('data-leve-toolbar-item')).toBe(true);
    expect(link?.hasAttribute('data-leve-toolbar-item')).toBe(true);
  });

  it('Separator の向きはツールバーと直交する', async () => {
    const { screen, render } = await createDOM();
    await render(
      <>
        <Toolbar.Root aria-label="Horizontal">
          <Toolbar.Separator />
        </Toolbar.Root>
        <Toolbar.Root aria-label="Vertical" orientation="vertical">
          <Toolbar.Separator />
        </Toolbar.Root>
      </>,
    );

    const [horizontal, vertical] = screen.querySelectorAll('[data-leve-toolbar-separator]');
    expect(horizontal.getAttribute('aria-orientation')).toBe('vertical');
    expect(horizontal.getAttribute('data-orientation')).toBe('vertical');
    expect(vertical.getAttribute('aria-orientation')).toBe('horizontal');
    expect(screen.querySelectorAll('[data-leve-toolbar]')[1].getAttribute('aria-orientation')).toBe(
      'vertical',
    );
  });

  it('最初の有効な項目だけ tabIndex=0 になり、ほかは -1 になる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Toolbar.Root aria-label="Edit">
        <Toolbar.Button disabled>Undo</Toolbar.Button>
        <Toolbar.Button>Cut</Toolbar.Button>
        <Toolbar.Link href="#help">Help</Toolbar.Link>
      </Toolbar.Root>,
    );

    const items = screen.querySelectorAll<HTMLElement>('[data-leve-toolbar-item]');
    expect(items[0].getAttribute('tabindex')).toBe('-1');
    expect(items[0].hasAttribute('data-disabled')).toBe(true);
    expect(items[1].getAttribute('tabindex')).toBe('0');
    expect(items[2].getAttribute('tabindex')).toBe('-1');
  });

  it('中の Toggle と Toggle Group の項目がツールバーの項目になる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Toolbar.Root aria-label="Formatting">
        <ToggleGroup.Root type="multiple" aria-label="Style">
          <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
          <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
        </ToggleGroup.Root>
        <Toggle.Root>Pin</Toggle.Root>
      </Toolbar.Root>,
    );

    const items = screen.querySelectorAll<HTMLElement>('[data-leve-toolbar-item]');
    expect(items).toHaveLength(3);
    expect([...items].map((el) => el.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
  });

  it('Toolbar の外の Toggle と Toggle Group は今までどおり動く', async () => {
    const { screen, render } = await createDOM();
    await render(
      <>
        <ToggleGroup.Root aria-label="Style">
          <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
          <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
        </ToggleGroup.Root>
        <Toggle.Root>Pin</Toggle.Root>
      </>,
    );

    expect(screen.querySelectorAll('[data-leve-toolbar-item]')).toHaveLength(0);
    const groupItems = screen.querySelectorAll('[data-leve-toggle-group-item]');
    expect(groupItems[0].getAttribute('tabindex')).toBe('0');
    expect(groupItems[1].getAttribute('tabindex')).toBe('-1');
    expect(screen.querySelector('[data-leve-toggle]')?.hasAttribute('tabindex')).toBe(false);
  });

  it('任意の props が要素に渡り、Root の独自 props は属性として出力されない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Toolbar.Root aria-label="Edit" class="root" orientation="vertical" loop={false}>
        <Toolbar.Button class="button">Cut</Toolbar.Button>
        <Toolbar.Separator class="separator" />
        <Toolbar.Link href="#help" class="link">
          Help
        </Toolbar.Link>
      </Toolbar.Root>,
    );

    const root = screen.querySelector('[data-leve-toolbar]');
    expect(root?.className).toBe('root');
    expect(root?.getAttribute('aria-label')).toBe('Edit');
    expect(root?.hasAttribute('orientation')).toBe(false);
    expect(root?.hasAttribute('loop')).toBe(false);
    expect(screen.querySelector('[data-leve-toolbar-button]')?.className).toBe('button');
    expect(screen.querySelector('[data-leve-toolbar-separator]')?.className).toBe('separator');
    expect(screen.querySelector('[data-leve-toolbar-link]')?.getAttribute('href')).toBe('#help');
  });

  it('Button に as で要素名や Qwik コンポーネントを渡すと属性とハンドラが合成される', async () => {
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

    const Parent = component$(() => {
      const clicks = useSignal(0);

      return (
        <Toolbar.Root aria-label="Actions">
          <Toolbar.Button as="a" href="#export" class="anchor-btn">
            Export
          </Toolbar.Button>
          <Toolbar.Button
            as={CustomButton}
            variant="ghost"
            class="custom-btn"
            onClick$={() => {
              clicks.value += 1;
            }}
          >
            Save ({clicks.value})
          </Toolbar.Button>
        </Toolbar.Root>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const anchorBtn = screen.querySelector('.anchor-btn');
    const customBtn = screen.querySelector('.custom-btn');

    expect(anchorBtn?.tagName).toBe('A');
    expect(anchorBtn?.hasAttribute('type')).toBe(false);
    expect(anchorBtn?.getAttribute('href')).toBe('#export');
    expect(anchorBtn?.hasAttribute('data-leve-toolbar-button')).toBe(true);
    expect(anchorBtn?.hasAttribute('data-leve-toolbar-item')).toBe(true);
    expect(anchorBtn?.getAttribute('tabindex')).toBe('0');

    expect(customBtn?.tagName).toBe('BUTTON');
    expect(customBtn?.getAttribute('data-variant')).toBe('ghost');
    expect(customBtn?.hasAttribute('data-leve-toolbar-button')).toBe(true);
    expect(customBtn?.hasAttribute('data-leve-toolbar-item')).toBe(true);
    expect(customBtn?.getAttribute('tabindex')).toBe('-1');

    await userEvent('.custom-btn', 'focus');
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(anchorBtn?.getAttribute('tabindex')).toBe('-1');
    expect(customBtn?.getAttribute('tabindex')).toBe('0');

    await userEvent('.custom-btn', 'click');
    expect(customBtn?.getAttribute('data-internal-clicks')).toBe('1');
    expect(customBtn?.textContent).toBe('Save (1)');
  });

  it('Link に as で Qwik コンポーネントを渡すと属性・タブストップ・ハンドラが維持される', async () => {
    type CustomLinkProps = PropsOf<'a'> & {
      prefetch?: boolean;
    };

    const CustomLink = component$<CustomLinkProps>(({ prefetch, onClick$, ...props }) => {
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
        <Toolbar.Root aria-label="Links">
          <Toolbar.Button class="first-btn">Cut</Toolbar.Button>
          <Toolbar.Link
            as={CustomLink}
            href="/docs"
            prefetch
            class="custom-link"
            onClick$={() => {
              clicks.value += 1;
            }}
          >
            Docs ({clicks.value})
          </Toolbar.Link>
        </Toolbar.Root>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const firstBtn = screen.querySelector('.first-btn');
    const customLink = screen.querySelector('.custom-link');

    expect(customLink?.tagName).toBe('A');
    expect(customLink?.getAttribute('href')).toBe('/docs');
    expect(customLink?.getAttribute('data-prefetch')).toBe('true');
    expect(customLink?.hasAttribute('data-leve-toolbar-link')).toBe(true);
    expect(customLink?.hasAttribute('data-leve-toolbar-item')).toBe(true);
    expect(customLink?.getAttribute('tabindex')).toBe('-1');

    await userEvent('.custom-link', 'focus');
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(firstBtn?.getAttribute('tabindex')).toBe('-1');
    expect(customLink?.getAttribute('tabindex')).toBe('0');

    await userEvent('.custom-link', 'click');
    expect(customLink?.getAttribute('data-internal-clicks')).toBe('1');
    expect(customLink?.textContent).toBe('Docs (1)');
  });
});
