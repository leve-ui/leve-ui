import { component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Progress, type ProgressRootProps } from './index';

const Example = component$<ProgressRootProps>((props) => (
  <Progress.Root {...props}>
    <Progress.Label>Uploading</Progress.Label>
    <Progress.ValueText />
    <Progress.Track>
      <Progress.Indicator />
    </Progress.Track>
  </Progress.Root>
));

const parts = ['', '-label', '-value-text', '-track', '-indicator'].map(
  (suffix) => `[data-leve-progress${suffix}]`,
);

describe('Progress', () => {
  it('すべてのパーツが data 属性付きで描画される', async () => {
    const { screen, render } = await createDOM();
    await render(<Example value={30} />);

    for (const selector of parts) {
      expect(screen.querySelector(selector), selector).not.toBeNull();
    }
  });

  it('Root に role="progressbar" と aria-value* が付く', async () => {
    const { screen, render } = await createDOM();
    await render(<Example value={30} />);

    const root = screen.querySelector('[data-leve-progress]');
    expect(root?.getAttribute('role')).toBe('progressbar');
    expect(root?.getAttribute('aria-valuenow')).toBe('30');
    expect(root?.getAttribute('aria-valuemin')).toBe('0');
    expect(root?.getAttribute('aria-valuemax')).toBe('100');
    expect(root?.hasAttribute('aria-valuetext')).toBe(false);
  });

  it('Root は Label と aria-labelledby で関連付けられる', async () => {
    const { screen, render } = await createDOM();
    await render(<Example value={30} />);

    const root = screen.querySelector('[data-leve-progress]');
    const label = screen.querySelector('[data-leve-progress-label]');
    expect(label?.id).toBeTruthy();
    expect(root?.getAttribute('aria-labelledby')).toBe(label?.id);
  });

  it('aria-label を渡すと aria-labelledby を出力しない', async () => {
    const { screen, render } = await createDOM();
    await render(<Progress.Root value={30} aria-label="Upload" />);

    const root = screen.querySelector('[data-leve-progress]');
    expect(root?.getAttribute('aria-label')).toBe('Upload');
    expect(root?.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('進行中は data-state="loading" で、ValueText に割合を表示する', async () => {
    const { screen, render } = await createDOM();
    await render(<Example value={1} max={3} />);

    for (const selector of parts) {
      const el = screen.querySelector(selector);
      expect(el?.getAttribute('data-state'), selector).toBe('loading');
      expect(el?.getAttribute('data-value'), selector).toBe('1');
      expect(el?.getAttribute('data-max'), selector).toBe('3');
    }
    expect(screen.querySelector('[data-leve-progress-value-text]')?.textContent).toBe('33%');
  });

  it('最大値に達すると data-state="complete" になる', async () => {
    const { screen, render } = await createDOM();
    await render(<Example value={100} />);

    expect(screen.querySelector('[data-leve-progress]')?.getAttribute('data-state')).toBe(
      'complete',
    );
  });

  it('value が null のときは不確定になり、aria-valuenow を出力しない', async () => {
    const { screen, render } = await createDOM();
    await render(<Example value={null} />);

    const root = screen.querySelector('[data-leve-progress]');
    expect(root?.getAttribute('data-state')).toBe('indeterminate');
    expect(root?.hasAttribute('aria-valuenow')).toBe(false);
    expect(root?.hasAttribute('data-value')).toBe(false);
    expect(screen.querySelector('[data-leve-progress-value-text]')?.textContent).toBe('');
  });

  it('value を省略すると不確定になる', async () => {
    const { screen, render } = await createDOM();
    await render(<Example />);

    expect(screen.querySelector('[data-leve-progress]')?.getAttribute('data-state')).toBe(
      'indeterminate',
    );
  });

  it('範囲外の value は min / max に丸める', async () => {
    const { screen, render } = await createDOM();
    await render(<Example value={150} min={10} max={110} />);

    const root = screen.querySelector('[data-leve-progress]');
    expect(root?.getAttribute('aria-valuenow')).toBe('110');
    expect(root?.getAttribute('aria-valuemin')).toBe('10');
    expect(root?.getAttribute('aria-valuemax')).toBe('110');
  });

  it('valueText を aria-valuetext と ValueText に使う', async () => {
    const { screen, render } = await createDOM();
    await render(<Example value={3} max={10} valueText="3 of 10 files" />);

    expect(screen.querySelector('[data-leve-progress]')?.getAttribute('aria-valuetext')).toBe(
      '3 of 10 files',
    );
    expect(screen.querySelector('[data-leve-progress-value-text]')?.textContent).toBe(
      '3 of 10 files',
    );
  });

  it('value の変更に追従する', async () => {
    const Controlled = component$(() => {
      const value = useSignal(10);
      return (
        <>
          <button type="button" onClick$={() => (value.value = 100)}>
            finish
          </button>
          <Example value={value.value} />
        </>
      );
    });
    const { screen, render, userEvent } = await createDOM();
    await render(<Controlled />);

    await userEvent('button', 'click');

    const root = screen.querySelector('[data-leve-progress]');
    expect(root?.getAttribute('aria-valuenow')).toBe('100');
    expect(root?.getAttribute('data-state')).toBe('complete');
    expect(screen.querySelector('[data-leve-progress-value-text]')?.textContent).toBe('100%');
  });

  it('任意の props を要素に渡し、role は上書きさせない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Progress.Root value={1} class="root" role="meter">
        <Progress.Label class="label" />
        <Progress.ValueText class="text" />
        <Progress.Track class="track">
          <Progress.Indicator class="indicator" />
        </Progress.Track>
      </Progress.Root>,
    );

    const root = screen.querySelector('[data-leve-progress]');
    expect(root?.getAttribute('role')).toBe('progressbar');
    expect(root?.getAttribute('class')).toBe('root');
    for (const name of ['label', 'value-text', 'track', 'indicator']) {
      expect(screen.querySelector(`[data-leve-progress-${name}]`)?.hasAttribute('class')).toBe(
        true,
      );
    }
  });
});
