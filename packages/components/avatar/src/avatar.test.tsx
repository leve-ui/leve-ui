import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Avatar } from './index';

describe('Avatar', () => {
  it('src が無い場合はフォールバックを表示する', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Avatar.Root>
        <Avatar.Image alt="user" />
        <Avatar.Fallback>LU</Avatar.Fallback>
      </Avatar.Root>,
    );

    const fallback = screen.querySelector('[data-levis-avatar-fallback]');
    expect(fallback?.getAttribute('data-state')).toBe('error');
    expect(fallback?.textContent).toBe('LU');
    expect(screen.querySelector('img')?.hasAttribute('hidden')).toBe(true);
  });

  it('src がある場合は読み込み中としてフォールバックを表示する', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Avatar.Root>
        <Avatar.Image src="/avatar.png" alt="user" />
        <Avatar.Fallback>LU</Avatar.Fallback>
      </Avatar.Root>,
    );

    const image = screen.querySelector('[data-levis-avatar-image]');
    expect(image?.getAttribute('data-state')).toBe('loading');
    expect(image?.hasAttribute('hidden')).toBe(true);
    expect(screen.querySelector('[data-levis-avatar-fallback]')).not.toBeNull();
  });
});
