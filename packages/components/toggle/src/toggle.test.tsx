import { component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Toggle } from './index';

describe('Toggle', () => {
  it('button 要素として描画され、初期状態は未押下（off）となる', async () => {
    const { screen, render } = await createDOM();
    await render(<Toggle.Root>Bold</Toggle.Root>);

    const button = screen.querySelector('button');
    expect(button).not.toBeNull();
    expect(button?.tagName).toBe('BUTTON');
    expect(button?.getAttribute('type')).toBe('button');
    expect(button?.hasAttribute('data-leve-toggle')).toBe(true);
    expect(button?.getAttribute('aria-pressed')).toBe('false');
    expect(button?.getAttribute('data-state')).toBe('off');
    expect(button?.hasAttribute('data-disabled')).toBe(false);
  });

  it('defaultPressed を指定すると初期状態で押下状態（on）になる', async () => {
    const { screen, render } = await createDOM();
    await render(<Toggle.Root defaultPressed>Bold</Toggle.Root>);

    const button = screen.querySelector('button');
    expect(button?.getAttribute('aria-pressed')).toBe('true');
    expect(button?.getAttribute('data-state')).toBe('on');
  });

  it('クリックで押下状態が切り替わり、onPressedChange$ と onClick$ が呼ばれる', async () => {
    const Parent = component$(() => {
      const pressedLog = useSignal<boolean[]>([]);
      const clickCount = useSignal(0);

      return (
        <>
          <Toggle.Root
            onPressedChange$={(pressed) => {
              pressedLog.value = [...pressedLog.value, pressed];
            }}
            onClick$={() => {
              clickCount.value++;
            }}
          >
            Bold
          </Toggle.Root>
          <output id="pressed-log">{pressedLog.value.map(String).join(',')}</output>
          <output id="click-count">{clickCount.value}</output>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const button = screen.querySelector('button');
    expect(button).not.toBeNull();
    expect(button?.getAttribute('aria-pressed')).toBe('false');
    expect(button?.getAttribute('data-state')).toBe('off');

    await userEvent('button', 'click');
    expect(button?.getAttribute('aria-pressed')).toBe('true');
    expect(button?.getAttribute('data-state')).toBe('on');
    expect(screen.querySelector('#pressed-log')?.textContent).toBe('true');
    expect(screen.querySelector('#click-count')?.textContent).toBe('1');

    await userEvent('button', 'click');
    expect(button?.getAttribute('aria-pressed')).toBe('false');
    expect(button?.getAttribute('data-state')).toBe('off');
    expect(screen.querySelector('#pressed-log')?.textContent).toBe('true,false');
    expect(screen.querySelector('#click-count')?.textContent).toBe('2');
  });

  it('bind:pressed で渡した Signal と双方向で同期する', async () => {
    const Parent = component$(() => {
      const pressed = useSignal(false);
      return (
        <>
          <Toggle.Root bind:pressed={pressed}>Italic</Toggle.Root>
          <output id="signal-state">{pressed.value ? 'true' : 'false'}</output>
          <button
            type="button"
            id="external"
            onClick$={() => {
              pressed.value = true;
            }}
          >
            External
          </button>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const toggleButton = screen.querySelector('[data-leve-toggle]');
    expect(toggleButton).not.toBeNull();
    expect(toggleButton?.getAttribute('aria-pressed')).toBe('false');
    expect(screen.querySelector('#signal-state')?.textContent).toBe('false');

    await userEvent('[data-leve-toggle]', 'click');
    expect(toggleButton?.getAttribute('aria-pressed')).toBe('true');
    expect(toggleButton?.getAttribute('data-state')).toBe('on');
    expect(screen.querySelector('#signal-state')?.textContent).toBe('true');

    await userEvent('[data-leve-toggle]', 'click');
    expect(toggleButton?.getAttribute('aria-pressed')).toBe('false');
    expect(screen.querySelector('#signal-state')?.textContent).toBe('false');

    await userEvent('#external', 'click');
    expect(toggleButton?.getAttribute('aria-pressed')).toBe('true');
    expect(toggleButton?.getAttribute('data-state')).toBe('on');
    expect(screen.querySelector('#signal-state')?.textContent).toBe('true');
  });

  it('disabled のときは disabled 属性と data-disabled が付き、クリックしても状態が変わらない', async () => {
    const Parent = component$(() => {
      const changed = useSignal(false);
      return (
        <>
          <Toggle.Root
            disabled
            onPressedChange$={() => {
              changed.value = true;
            }}
          >
            Underline
          </Toggle.Root>
          <output id="changed">{changed.value ? 'yes' : 'no'}</output>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const button = screen.querySelector('button');
    expect(button).not.toBeNull();
    expect(button?.hasAttribute('disabled')).toBe(true);
    expect(button?.hasAttribute('data-disabled')).toBe(true);
    expect(button?.getAttribute('aria-pressed')).toBe('false');
    expect(button?.getAttribute('data-state')).toBe('off');

    await userEvent('button', 'click');
    expect(button?.getAttribute('aria-pressed')).toBe('false');
    expect(button?.getAttribute('data-state')).toBe('off');
    expect(screen.querySelector('#changed')?.textContent).toBe('no');
  });

  it('任意の props を渡し、aria-pressed や type は props で上書きさせない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Toggle.Root class="custom-toggle" aria-label="Toggle mute" type="submit" aria-pressed="true">
        Mute
      </Toggle.Root>,
    );

    const button = screen.querySelector('button');
    expect(button).not.toBeNull();
    expect(button?.getAttribute('class')).toBe('custom-toggle');
    expect(button?.getAttribute('aria-label')).toBe('Toggle mute');
    expect(button?.getAttribute('type')).toBe('button');
    expect(button?.getAttribute('aria-pressed')).toBe('false');
  });
});
