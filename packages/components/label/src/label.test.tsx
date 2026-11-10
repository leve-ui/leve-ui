import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Label } from './index';

describe('Label', () => {
  it('<label> として data 属性付きで描画される', async () => {
    const { screen, render } = await createDOM();
    await render(<Label.Root>Email</Label.Root>);

    const root = screen.querySelector('[data-leve-label]');
    expect(root?.tagName).toBe('LABEL');
    expect(root?.textContent).toBe('Email');
  });

  it('for や class などの props を要素に渡す', async () => {
    const { screen, render } = await createDOM();
    await render(
      <>
        <Label.Root for="email" class="label">
          Email
        </Label.Root>
        <input id="email" />
      </>,
    );

    const root = screen.querySelector('[data-leve-label]');
    expect(root?.getAttribute('for')).toBe('email');
    expect(root?.getAttribute('class')).toBe('label');
  });
});
