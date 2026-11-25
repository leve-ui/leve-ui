import { $ } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { screen: announcerScreen } = await createDOM();
(globalThis as unknown as { document: Document }).document =
  announcerScreen.ownerDocument as unknown as Document;

const { destroyAnnouncer } = await import('@leve-ui/utils');
const { Clipboard } = await import('./index');

const copyCalls: string[] = [];
const statusCalls: boolean[] = [];

async function waitFor(condition: () => boolean, maxAttempts = 50) {
  for (let i = 0; i < maxAttempts && !condition(); i++) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

describe('Clipboard', () => {
  afterEach(() => {
    copyCalls.length = 0;
    statusCalls.length = 0;
    destroyAnnouncer();
    vi.restoreAllMocks();
  });

  it('renders all parts with data attributes and idle initial state', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Clipboard.Root value="https://leve-ui.dev">
        <Clipboard.Input />
        <Clipboard.Trigger>
          <Clipboard.Indicator>Copy</Clipboard.Indicator>
        </Clipboard.Trigger>
      </Clipboard.Root>,
    );

    const root = screen.querySelector('[data-leve-clipboard]');
    const trigger = screen.querySelector('[data-leve-clipboard-trigger]');
    const indicator = screen.querySelector('[data-leve-clipboard-indicator]');
    const input = screen.querySelector('[data-leve-clipboard-input]') as HTMLInputElement | null;

    expect(root).not.toBeNull();
    expect(trigger).not.toBeNull();
    expect(indicator).not.toBeNull();
    expect(input).not.toBeNull();

    expect(root?.getAttribute('data-state')).toBe('idle');
    expect(root?.hasAttribute('data-copied')).toBe(false);
    expect(trigger?.getAttribute('type')).toBe('button');
    expect(trigger?.getAttribute('data-state')).toBe('idle');
    expect(indicator?.getAttribute('aria-hidden')).toBe('true');
    expect(indicator?.getAttribute('data-state')).toBe('idle');
    expect(input?.readOnly).toBe(true);
    expect(input?.value).toBe('https://leve-ui.dev');
    expect(input?.getAttribute('data-state')).toBe('idle');
  });

  it('copies value, updates data-state, announces, and invokes callbacks on click', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    const onCopy$ = $((val: string) => {
      copyCalls.push(val);
    });
    const onStatusChange$ = $((copied: boolean) => {
      statusCalls.push(copied);
    });

    const { screen, render, userEvent } = await createDOM();
    (globalThis as unknown as { document: Document }).document =
      screen.ownerDocument as unknown as Document;

    await render(
      <Clipboard.Root
        value="pnpm add @leve-ui/clipboard"
        copiedAnnouncement="Command copied"
        onCopy$={onCopy$}
        onStatusChange$={onStatusChange$}
      >
        <Clipboard.Input />
        <Clipboard.Trigger>
          <Clipboard.Indicator>Copy</Clipboard.Indicator>
        </Clipboard.Trigger>
      </Clipboard.Root>,
    );

    await userEvent('[data-leve-clipboard-trigger]', 'click');

    expect(writeText).toHaveBeenCalledWith('pnpm add @leve-ui/clipboard');
    expect(copyCalls).toEqual(['pnpm add @leve-ui/clipboard']);
    expect(statusCalls).toEqual([true]);

    const root = screen.querySelector('[data-leve-clipboard]');
    const trigger = screen.querySelector('[data-leve-clipboard-trigger]');
    const indicator = screen.querySelector('[data-leve-clipboard-indicator]');
    const input = screen.querySelector('[data-leve-clipboard-input]');

    expect(root?.getAttribute('data-state')).toBe('copied');
    expect(root?.getAttribute('data-copied')).toBe('');
    expect(trigger?.getAttribute('data-state')).toBe('copied');
    expect(trigger?.getAttribute('data-copied')).toBe('');
    expect(indicator?.getAttribute('data-state')).toBe('copied');
    expect(input?.getAttribute('data-state')).toBe('copied');

    await waitFor(
      () =>
        document.querySelector('[data-leve-announcer-region="polite"]')?.textContent ===
        'Command copied',
    );
    const region = document.querySelector('[data-leve-announcer-region="polite"]');
    expect(region?.textContent).toBe('Command copied');
  });

  it('resets copied state after timeout', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    const onStatusChange$ = $((copied: boolean) => {
      statusCalls.push(copied);
    });

    const { screen, render, userEvent } = await createDOM();
    await render(
      <Clipboard.Root value="hello" timeout={30} onStatusChange$={onStatusChange$}>
        <Clipboard.Trigger>Copy</Clipboard.Trigger>
      </Clipboard.Root>,
    );

    await userEvent('[data-leve-clipboard-trigger]', 'click');

    const root = screen.querySelector('[data-leve-clipboard]');
    expect(root?.getAttribute('data-state')).toBe('copied');

    await waitFor(() => statusCalls.length === 2);
    expect(statusCalls).toEqual([true, false]);

    // Trigger a Qwik flush in createDOM after the external setTimeout updates the signal
    await userEvent('[data-leve-clipboard]', 'mouseenter');
    expect(root?.getAttribute('data-state')).toBe('idle');
    expect(root?.hasAttribute('data-copied')).toBe(false);
  });

  it('does not leak custom props onto the Root element and forwards standard props', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Clipboard.Root
        value="secret"
        timeout={1000}
        copiedAnnouncement="Done"
        class="custom-clipboard"
        aria-label="Copy API key"
      >
        <Clipboard.Trigger>Copy</Clipboard.Trigger>
      </Clipboard.Root>,
    );

    const root = screen.querySelector('[data-leve-clipboard]');
    expect(root?.className).toContain('custom-clipboard');
    expect(root?.getAttribute('aria-label')).toBe('Copy API key');
    expect(root?.hasAttribute('value')).toBe(false);
    expect(root?.hasAttribute('timeout')).toBe(false);
    expect(root?.hasAttribute('copiedAnnouncement')).toBe(false);
  });
});
