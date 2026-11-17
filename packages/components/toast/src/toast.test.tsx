import { component$ } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Toast, type ToastOptions, type ToastProviderProps } from './index';

async function waitFor(condition: () => boolean) {
  for (let i = 0; i < 20 && !condition(); i++)
    await new Promise((resolve) => setTimeout(resolve, 10));
}

function query(screen: HTMLElement, part: string) {
  return screen.querySelector<HTMLElement>(
    part ? `[data-leve-toast-${part}]` : '[data-leve-toast]',
  );
}

const Toaster = component$(() => {
  const toaster = Toast.useToaster<{ undo?: boolean }>();
  return (
    <Toast.Region class="region">
      <Toast.List class="list">
        {toaster.toasts.value.map((toast) => (
          <Toast.Root key={toast.id} toast={toast} class="toast" aria-describedby="hint">
            <Toast.Title class="title">{toast.title}</Toast.Title>
            {toast.description && <Toast.Description>{toast.description}</Toast.Description>}
            {toast.data?.undo && <Toast.Action>Undo</Toast.Action>}
            <Toast.Close aria-label="Close">×</Toast.Close>
          </Toast.Root>
        ))}
      </Toast.List>
    </Toast.Region>
  );
});

const Add = component$<{ options: ToastOptions<{ undo?: boolean }>; class: string }>((props) => {
  const toaster = Toast.useToaster<{ undo?: boolean }>();
  return (
    <button type="button" class={props.class} onClick$={() => toaster.add$(props.options)}>
      Add
    </button>
  );
});

const App = component$<ToastProviderProps>((props) => (
  <Toast.Provider {...props}>
    <Add class="add" options={{ title: 'Saved', description: 'Your changes were saved.' }} />
    <Add
      class="add-action"
      options={{ title: 'Deleted', type: 'background', data: { undo: true } }}
    />
    <Toaster />
  </Toast.Provider>
));

describe('Toast', () => {
  it('Region は section と aria-label（ホットキー付き）、List は ol で描画される', async () => {
    const { screen, render } = await createDOM();
    await render(<App />);

    const region = query(screen, 'region');
    expect(region?.tagName).toBe('SECTION');
    expect(region?.getAttribute('aria-label')).toBe('Notifications (F8)');
    expect(region?.getAttribute('tabindex')).toBe('-1');
    expect(region?.getAttribute('class')).toBe('region');
    expect(region?.getAttribute('data-placement')).toBe('bottom-end');
    expect(region?.hasAttribute('data-expanded')).toBe(false);
    expect(query(screen, 'list')?.tagName).toBe('OL');
    expect(query(screen, '')).toBeFalsy();
  });

  it('label・placement・hotkey を変えられる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Toast.Provider placement="top" hotkey={['altKey', 'KeyT']}>
        <Toast.Region label="Alerts, {hotkey}">
          <Toast.List />
        </Toast.Region>
      </Toast.Provider>,
    );

    const region = query(screen, 'region');
    expect(region?.getAttribute('aria-label')).toBe('Alerts, alt+T');
    expect(region?.getAttribute('data-placement')).toBe('top');
  });

  it('add$ で通知が追加され、パーツと data 属性・CSS 変数が出力される', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<App />);

    await userEvent('.add', 'click');
    const toast = query(screen, '');
    expect(toast?.tagName).toBe('LI');
    expect(toast?.getAttribute('tabindex')).toBe('0');
    expect(toast?.hasAttribute('role')).toBe(false);
    expect(toast?.getAttribute('class')).toBe('toast');
    expect(toast?.getAttribute('aria-describedby')).toBe('hint');
    expect(toast?.getAttribute('data-state')).toBe('open');
    expect(toast?.getAttribute('data-type')).toBe('foreground');
    expect(toast?.getAttribute('data-placement')).toBe('bottom-end');
    expect(toast?.getAttribute('data-swipe-direction')).toBe('right');
    expect(toast?.hasAttribute('data-front')).toBe(true);
    expect(toast?.getAttribute('style')).toContain('--leve-toast-index:0');
    expect(toast?.getAttribute('style')).toContain('--leve-toast-count:1');
    expect(query(screen, 'title')?.textContent).toBe('Saved');
    expect(query(screen, 'description')?.textContent).toBe('Your changes were saved.');
    expect(query(screen, 'close')?.getAttribute('type')).toBe('button');
    expect(query(screen, 'close')?.getAttribute('aria-label')).toBe('Close');
  });

  it('新しい通知が手前（index 0）になり、古い通知の index が増える', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<App />);

    await userEvent('.add', 'click');
    await userEvent('.add-action', 'click');
    const [older, newer] = Array.from(screen.querySelectorAll('[data-leve-toast]'));
    expect(older.getAttribute('style')).toContain('--leve-toast-index:1');
    expect(older.hasAttribute('data-front')).toBe(false);
    expect(newer.getAttribute('style')).toContain('--leve-toast-index:0');
    expect(newer.getAttribute('style')).toContain('--leve-toast-count:2');
    expect(newer.getAttribute('data-type')).toBe('background');
    expect(newer.querySelector('[data-leve-toast-action]')?.getAttribute('type')).toBe('button');
  });

  it('Close と Action で閉じ、一覧から消える', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<App />);

    await userEvent('.add', 'click');
    await userEvent('[data-leve-toast-close]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
    await waitFor(() => !query(screen, ''));
    expect(query(screen, '')).toBeFalsy();

    await userEvent('.add-action', 'click');
    await userEvent('[data-leve-toast-action]', 'click');
    await waitFor(() => !query(screen, ''));
    expect(query(screen, '')).toBeFalsy();
  });

  it('swipeDirection は placement から決まり、明示もできる', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<App placement="top" />);
    await userEvent('.add', 'click');
    expect(query(screen, '')?.getAttribute('data-swipe-direction')).toBe('up');

    const second = await createDOM();
    await second.render(<App placement="bottom-start" swipeDirection="down" />);
    await second.userEvent('.add', 'click');
    expect(query(second.screen, '')?.getAttribute('data-swipe-direction')).toBe('down');
  });
});
