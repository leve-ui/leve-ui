import { component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Meter, type MeterRootProps } from './index';

const Example = component$<MeterRootProps>((props) => (
  <Meter.Root {...props}>
    <Meter.Label>Storage</Meter.Label>
    <Meter.ValueText />
    <Meter.Track>
      <Meter.Indicator />
    </Meter.Track>
  </Meter.Root>
));

const parts = ['', '-label', '-value-text', '-track', '-indicator'].map(
  (suffix) => `[data-leve-meter${suffix}]`,
);

describe('Meter', () => {
  it('すべてのパーツが data 属性付きで描画される', async () => {
    const { screen, render } = await createDOM();
    await render(<Example value={25} />);

    for (const selector of parts) {
      const el = screen.querySelector(selector);
      expect(el, selector).not.toBeNull();
      expect(el?.getAttribute('data-value'), selector).toBe('25');
      expect(el?.getAttribute('data-min'), selector).toBe('0');
      expect(el?.getAttribute('data-max'), selector).toBe('100');
    }
  });

  it('Root に role="meter" と aria-value* が付く', async () => {
    const { screen, render } = await createDOM();
    await render(<Example value={25} />);

    const root = screen.querySelector('[data-leve-meter]');
    expect(root?.getAttribute('role')).toBe('meter');
    expect(root?.getAttribute('aria-valuenow')).toBe('25');
    expect(root?.getAttribute('aria-valuemin')).toBe('0');
    expect(root?.getAttribute('aria-valuemax')).toBe('100');
    expect(root?.hasAttribute('aria-valuetext')).toBe(false);
  });

  it('Root は Label と aria-labelledby で関連付けられる', async () => {
    const { screen, render } = await createDOM();
    await render(<Example value={25} />);

    const label = screen.querySelector('[data-leve-meter-label]');
    expect(label?.id).toBeTruthy();
    expect(screen.querySelector('[data-leve-meter]')?.getAttribute('aria-labelledby')).toBe(
      label?.id,
    );
  });

  it('aria-label を渡すと aria-labelledby を出力しない', async () => {
    const { screen, render } = await createDOM();
    await render(<Meter.Root value={25} aria-label="Battery" />);

    const root = screen.querySelector('[data-leve-meter]');
    expect(root?.getAttribute('aria-label')).toBe('Battery');
    expect(root?.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('ValueText に割合を表示する', async () => {
    const { screen, render } = await createDOM();
    await render(<Example value={50} max={200} />);

    expect(screen.querySelector('[data-leve-meter-value-text]')?.textContent).toBe('25%');
  });

  it('valueText を aria-valuetext と ValueText に使う', async () => {
    const { screen, render } = await createDOM();
    await render(<Example value={50} max={200} valueText="50 GB of 200 GB" />);

    expect(screen.querySelector('[data-leve-meter]')?.getAttribute('aria-valuetext')).toBe(
      '50 GB of 200 GB',
    );
    expect(screen.querySelector('[data-leve-meter-value-text]')?.textContent).toBe(
      '50 GB of 200 GB',
    );
  });

  it('範囲外の value は min / max に丸める', async () => {
    const { screen, render } = await createDOM();
    await render(<Example value={-5} min={0} max={10} />);

    expect(screen.querySelector('[data-leve-meter]')?.getAttribute('aria-valuenow')).toBe('0');
  });

  it('value の変更に追従する', async () => {
    const Controlled = component$(() => {
      const value = useSignal(10);
      return (
        <>
          <button type="button" onClick$={() => (value.value = 80)}>
            change
          </button>
          <Example value={value.value} />
        </>
      );
    });
    const { screen, render, userEvent } = await createDOM();
    await render(<Controlled />);

    await userEvent('button', 'click');

    expect(screen.querySelector('[data-leve-meter]')?.getAttribute('aria-valuenow')).toBe('80');
    expect(screen.querySelector('[data-leve-meter-indicator]')?.getAttribute('data-value')).toBe(
      '80',
    );
    expect(screen.querySelector('[data-leve-meter-value-text]')?.textContent).toBe('80%');
  });

  it('任意の props を要素に渡し、role は上書きさせない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Meter.Root value={1} class="root" role="progressbar">
        <Meter.Label class="label" />
        <Meter.ValueText class="text" />
        <Meter.Track class="track">
          <Meter.Indicator class="indicator" />
        </Meter.Track>
      </Meter.Root>,
    );

    const root = screen.querySelector('[data-leve-meter]');
    expect(root?.getAttribute('role')).toBe('meter');
    expect(root?.getAttribute('class')).toBe('root');
    for (const name of ['label', 'value-text', 'track', 'indicator']) {
      expect(screen.querySelector(`[data-leve-meter-${name}]`)?.hasAttribute('class')).toBe(true);
    }
  });
});
