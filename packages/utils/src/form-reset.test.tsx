import { $, component$, type QRL, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { useFormReset } from './form-reset';

async function dispatchReset(
  form: HTMLFormElement,
  screen: HTMLElement,
  userEvent: Awaited<ReturnType<typeof createDOM>>['userEvent'],
) {
  const event = form.ownerDocument.createEvent('Event');
  event.initEvent('reset', true, true);
  form.dispatchEvent(event);
  await new Promise<void>((resolve) => setTimeout(resolve, 25));
  await userEvent(screen, 'noop');
}

const ResettableInput = component$<{ formId?: string; onReset$: QRL<() => void> }>(
  ({ formId, onReset$ }) => {
    const inputRef = useSignal<HTMLInputElement>();
    useFormReset(inputRef, onReset$);
    const formAttr = formId ? ({ form: formId } as Record<string, string>) : undefined;
    return <input ref={inputRef} type="hidden" data-testid="hidden-input" {...formAttr} />;
  },
);

describe('useFormReset', () => {
  it('祖先 form の reset イベントで onReset$ が呼ばれる', async () => {
    const Parent = component$(() => {
      const count = useSignal(0);
      return (
        <div>
          <form id="my-form">
            <ResettableInput
              onReset$={$(() => {
                count.value += 1;
              })}
            />
          </form>
          <output id="count">{count.value}</output>
        </div>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const form = screen.querySelector('#my-form') as HTMLFormElement;
    await dispatchReset(form, screen, userEvent);

    expect(screen.querySelector('#count')?.textContent).toBe('1');
  });

  it('form 属性で外部の form id を指定したときも reset イベントで onReset$ が呼ばれる', async () => {
    const Parent = component$(() => {
      const count = useSignal(0);
      return (
        <div>
          <form id="external-form" />
          <ResettableInput
            formId="external-form"
            onReset$={$(() => {
              count.value += 1;
            })}
          />
          <output id="count">{count.value}</output>
        </div>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const form = screen.querySelector('#external-form') as HTMLFormElement;
    await dispatchReset(form, screen, userEvent);

    expect(screen.querySelector('#count')?.textContent).toBe('1');
  });

  it('reset イベントで preventDefault() された場合は onReset$ を呼ばない', async () => {
    const Parent = component$(() => {
      const count = useSignal(0);
      return (
        <div>
          <form id="prevented-form">
            <ResettableInput
              onReset$={$(() => {
                count.value += 1;
              })}
            />
          </form>
          <output id="count">{count.value}</output>
        </div>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const form = screen.querySelector('#prevented-form') as HTMLFormElement;
    form.addEventListener('reset', (event) => {
      event.preventDefault();
    });
    await dispatchReset(form, screen, userEvent);

    expect(screen.querySelector('#count')?.textContent).toBe('0');
  });

  it('form の外に配置してもエラーにならず安全に動作する', async () => {
    const Parent = component$(() => {
      const count = useSignal(0);
      return (
        <div>
          <ResettableInput
            onReset$={$(() => {
              count.value += 1;
            })}
          />
          <output id="count">{count.value}</output>
        </div>
      );
    });

    const { screen, render } = await createDOM();
    await render(<Parent />);

    expect(screen.querySelector('[data-testid="hidden-input"]')).not.toBeNull();
    expect(screen.querySelector('#count')?.textContent).toBe('0');
  });

  it('コンポーネントがアンマウントされると reset リスナーが解除される', async () => {
    const Parent = component$(() => {
      const show = useSignal(true);
      const count = useSignal(0);
      return (
        <div>
          <form id="cleanup-form">
            {show.value && (
              <ResettableInput
                onReset$={$(() => {
                  count.value += 1;
                })}
              />
            )}
          </form>
          <button
            type="button"
            id="unmount"
            onClick$={() => {
              show.value = false;
            }}
          >
            unmount
          </button>
          <output id="count">{count.value}</output>
        </div>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Parent />);

    const form = screen.querySelector('#cleanup-form') as HTMLFormElement;
    await dispatchReset(form, screen, userEvent);
    expect(screen.querySelector('#count')?.textContent).toBe('1');

    await userEvent('#unmount', 'click');
    await dispatchReset(form, screen, userEvent);
    expect(screen.querySelector('#count')?.textContent).toBe('1');
  });
});
