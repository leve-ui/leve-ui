import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Separator } from './index';

describe('Separator', () => {
  it('既定では横向きの separator として描画される', async () => {
    const { screen, render } = await createDOM();
    await render(<Separator.Root />);

    const root = screen.querySelector('[data-leve-separator]');
    expect(root?.getAttribute('role')).toBe('separator');
    expect(root?.getAttribute('data-orientation')).toBe('horizontal');
    expect(root?.hasAttribute('aria-orientation')).toBe(false);
  });

  it('縦向きのときは aria-orientation="vertical" を出力する', async () => {
    const { screen, render } = await createDOM();
    await render(<Separator.Root orientation="vertical" />);

    const root = screen.querySelector('[data-leve-separator]');
    expect(root?.getAttribute('aria-orientation')).toBe('vertical');
    expect(root?.getAttribute('data-orientation')).toBe('vertical');
  });

  it('decorative のときは role="none" にし、aria-orientation を出力しない', async () => {
    const { screen, render } = await createDOM();
    await render(<Separator.Root decorative orientation="vertical" />);

    const root = screen.querySelector('[data-leve-separator]');
    expect(root?.getAttribute('role')).toBe('none');
    expect(root?.hasAttribute('aria-orientation')).toBe(false);
    expect(root?.getAttribute('data-orientation')).toBe('vertical');
  });

  it('任意の props を要素に渡し、role は上書きさせない', async () => {
    const { screen, render } = await createDOM();
    await render(<Separator.Root class="sep" id="s" role="button" />);

    const root = screen.querySelector('[data-leve-separator]');
    expect(root?.getAttribute('class')).toBe('sep');
    expect(root?.id).toBe('s');
    expect(root?.getAttribute('role')).toBe('separator');
  });
});
