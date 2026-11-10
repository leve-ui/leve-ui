import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Alert } from './index';

describe('Alert', () => {
  it('すべてのパーツが data 属性付きで描画され、Root に role="alert" が付く', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Alert.Root>
        <Alert.Title>Error</Alert.Title>
        <Alert.Description>Something went wrong.</Alert.Description>
      </Alert.Root>,
    );

    const root = screen.querySelector('[data-leve-alert]');
    expect(root?.getAttribute('role')).toBe('alert');
    expect(screen.querySelector('[data-leve-alert-title]')?.textContent).toBe('Error');
    expect(screen.querySelector('[data-leve-alert-description]')?.textContent).toBe(
      'Something went wrong.',
    );
  });

  it('任意の props を要素に渡し、role は上書きさせない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Alert.Root class="alert" role="status">
        <Alert.Title class="title">Error</Alert.Title>
        <Alert.Description class="desc">Body</Alert.Description>
      </Alert.Root>,
    );

    const root = screen.querySelector('[data-leve-alert]');
    expect(root?.getAttribute('role')).toBe('alert');
    expect(root?.getAttribute('class')).toBe('alert');
    expect(screen.querySelector('[data-leve-alert-title]')?.getAttribute('class')).toBe('title');
    expect(screen.querySelector('[data-leve-alert-description]')?.getAttribute('class')).toBe(
      'desc',
    );
  });
});
