import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Fieldset } from './index';

describe('Fieldset', () => {
  it('<fieldset> と <legend> として描画される', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Fieldset.Root>
        <Fieldset.Legend>Shipping</Fieldset.Legend>
        <input />
      </Fieldset.Root>,
    );

    const root = screen.querySelector('[data-leve-fieldset]');
    const legend = screen.querySelector('[data-leve-fieldset-legend]');
    expect(root?.tagName).toBe('FIELDSET');
    expect(legend?.tagName).toBe('LEGEND');
    expect(legend?.textContent).toBe('Shipping');
    expect(root?.hasAttribute('disabled')).toBe(false);
    expect(root?.hasAttribute('data-disabled')).toBe(false);
    expect(legend?.hasAttribute('data-disabled')).toBe(false);
  });

  it('disabled のときは disabled と data-disabled を出力する', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Fieldset.Root disabled>
        <Fieldset.Legend>Shipping</Fieldset.Legend>
        <input />
      </Fieldset.Root>,
    );

    const root = screen.querySelector('[data-leve-fieldset]');
    expect(root?.hasAttribute('disabled')).toBe(true);
    expect(root?.getAttribute('data-disabled')).toBe('');
    expect(screen.querySelector('[data-leve-fieldset-legend]')?.getAttribute('data-disabled')).toBe(
      '',
    );
  });

  it('任意の props を要素に渡す', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Fieldset.Root class="fs" name="shipping">
        <Fieldset.Legend class="lg">Shipping</Fieldset.Legend>
      </Fieldset.Root>,
    );

    expect(screen.querySelector('[data-leve-fieldset]')?.getAttribute('name')).toBe('shipping');
    expect(screen.querySelector('[data-leve-fieldset]')?.getAttribute('class')).toBe('fs');
    expect(screen.querySelector('[data-leve-fieldset-legend]')?.getAttribute('class')).toBe('lg');
  });
});
