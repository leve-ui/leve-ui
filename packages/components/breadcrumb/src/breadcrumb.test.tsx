import { component$ } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Breadcrumb } from './index';

const Example = component$(() => (
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator>/</Breadcrumb.Separator>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/docs" current>
          Docs
        </Breadcrumb.Link>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
));

describe('Breadcrumb', () => {
  it('nav > ol > li > a の構造で、data 属性付きで描画される', async () => {
    const { screen, render } = await createDOM();
    await render(<Example />);

    expect(screen.querySelector('[data-leve-breadcrumb]')?.tagName).toBe('NAV');
    expect(screen.querySelector('[data-leve-breadcrumb-list]')?.tagName).toBe('OL');
    expect(screen.querySelectorAll('[data-leve-breadcrumb-item]')).toHaveLength(2);
    expect(screen.querySelectorAll('[data-leve-breadcrumb-link]')).toHaveLength(2);
    expect(screen.querySelector('[data-leve-breadcrumb-separator]')?.tagName).toBe('LI');
  });

  it('Root に既定の aria-label="Breadcrumb" が付く', async () => {
    const { screen, render } = await createDOM();
    await render(<Example />);

    expect(screen.querySelector('nav')?.getAttribute('aria-label')).toBe('Breadcrumb');
  });

  it('aria-label / aria-labelledby を渡すとそちらを使う', async () => {
    const { screen, render } = await createDOM();
    await render(
      <>
        <Breadcrumb.Root aria-label="パンくずリスト" />
        <Breadcrumb.Root aria-labelledby="heading" />
      </>,
    );

    const [labelled, labelledBy] = Array.from(screen.querySelectorAll('[data-leve-breadcrumb]'));
    expect(labelled.getAttribute('aria-label')).toBe('パンくずリスト');
    expect(labelledBy.getAttribute('aria-labelledby')).toBe('heading');
    expect(labelledBy.hasAttribute('aria-label')).toBe(false);
  });

  it('current の Link にだけ aria-current="page" と data-current が付く', async () => {
    const { screen, render } = await createDOM();
    await render(<Example />);

    const [home, docs] = screen.querySelectorAll('[data-leve-breadcrumb-link]');
    expect(home.hasAttribute('aria-current')).toBe(false);
    expect(home.hasAttribute('data-current')).toBe(false);
    expect(docs.getAttribute('aria-current')).toBe('page');
    expect(docs.getAttribute('data-current')).toBe('');
  });

  it('Separator は支援技術から隠される', async () => {
    const { screen, render } = await createDOM();
    await render(<Example />);

    const separator = screen.querySelector('[data-leve-breadcrumb-separator]');
    expect(separator?.getAttribute('aria-hidden')).toBe('true');
    expect(separator?.getAttribute('role')).toBe('presentation');
  });

  it('href や class などの props を要素に渡す', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Breadcrumb.Root class="root">
        <Breadcrumb.List class="list">
          <Breadcrumb.Item class="item">
            <Breadcrumb.Link href="/" class="link">
              Home
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    );

    expect(screen.querySelector('[data-leve-breadcrumb]')?.getAttribute('class')).toBe('root');
    expect(screen.querySelector('[data-leve-breadcrumb-list]')?.getAttribute('class')).toBe('list');
    expect(screen.querySelector('[data-leve-breadcrumb-item]')?.getAttribute('class')).toBe('item');
    const link = screen.querySelector('[data-leve-breadcrumb-link]');
    expect(link?.getAttribute('class')).toBe('link');
    expect(link?.getAttribute('href')).toBe('/');
  });
});
