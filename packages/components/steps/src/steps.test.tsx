import { $, component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Steps } from './index';

function requireEl<T extends Element>(el: T | null | undefined, label: string): T {
  if (!el) throw new Error(`Expected ${label} to be present`);
  return el;
}

describe('Steps', () => {
  it('renders all parts with semantic elements and data-leve-steps* attributes', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Steps.Root count={3}>
        <Steps.List>
          <Steps.Item index={0}>
            <Steps.Trigger>
              <Steps.Indicator>1</Steps.Indicator>
              Step 1
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
          <Steps.Item index={1}>
            <Steps.Trigger>
              <Steps.Indicator>2</Steps.Indicator>
              Step 2
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
          <Steps.Item index={2}>
            <Steps.Trigger>
              <Steps.Indicator>3</Steps.Indicator>
              Step 3
            </Steps.Trigger>
          </Steps.Item>
        </Steps.List>
        <Steps.Content index={0}>Content 1</Steps.Content>
        <Steps.Content index={1}>Content 2</Steps.Content>
        <Steps.Content index={2}>Content 3</Steps.Content>
        <Steps.PrevTrigger>Prev</Steps.PrevTrigger>
        <Steps.NextTrigger>Next</Steps.NextTrigger>
      </Steps.Root>,
    );

    const root = screen.querySelector('[data-leve-steps]');
    const list = screen.querySelector('[data-leve-steps-list]');
    const items = screen.querySelectorAll('[data-leve-steps-item]');
    const triggers = screen.querySelectorAll('[data-leve-steps-trigger]');
    const indicators = screen.querySelectorAll('[data-leve-steps-indicator]');
    const separators = screen.querySelectorAll('[data-leve-steps-separator]');
    const contents = screen.querySelectorAll('[data-leve-steps-content]');
    const prev = screen.querySelector('[data-leve-steps-prev-trigger]');
    const next = screen.querySelector('[data-leve-steps-next-trigger]');

    expect(root?.tagName).toBe('DIV');
    expect(list?.tagName).toBe('OL');
    expect(items).toHaveLength(3);
    expect(items[0]?.tagName).toBe('LI');
    expect(triggers).toHaveLength(3);
    expect(triggers[0]?.tagName).toBe('BUTTON');
    expect(triggers[0]?.getAttribute('type')).toBe('button');
    expect(indicators).toHaveLength(3);
    expect(indicators[0]?.tagName).toBe('SPAN');
    expect(indicators[0]?.getAttribute('aria-hidden')).toBe('true');
    expect(separators).toHaveLength(2);
    expect(separators[0]?.tagName).toBe('DIV');
    expect(separators[0]?.getAttribute('aria-hidden')).toBe('true');
    expect(contents).toHaveLength(3);
    expect(prev?.tagName).toBe('BUTTON');
    expect(prev?.getAttribute('type')).toBe('button');
    expect(next?.tagName).toBe('BUTTON');
    expect(next?.getAttribute('type')).toBe('button');
  });

  it('sets aria-current="step", data-state, and content hidden attributes correctly', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Steps.Root count={3} defaultStep={1}>
        <Steps.List>
          <Steps.Item index={0}>
            <Steps.Trigger>
              <Steps.Indicator>1</Steps.Indicator>
              Step 1
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
          <Steps.Item index={1}>
            <Steps.Trigger>
              <Steps.Indicator>2</Steps.Indicator>
              Step 2
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
          <Steps.Item index={2}>
            <Steps.Trigger>
              <Steps.Indicator>3</Steps.Indicator>
              Step 3
            </Steps.Trigger>
          </Steps.Item>
        </Steps.List>
        <Steps.Content index={0}>Content 1</Steps.Content>
        <Steps.Content index={1}>Content 2</Steps.Content>
        <Steps.Content index={2}>Content 3</Steps.Content>
      </Steps.Root>,
    );

    const items = screen.querySelectorAll('[data-leve-steps-item]');
    const triggers = screen.querySelectorAll('[data-leve-steps-trigger]');
    const indicators = screen.querySelectorAll('[data-leve-steps-indicator]');
    const separators = screen.querySelectorAll('[data-leve-steps-separator]');
    const contents = screen.querySelectorAll('[data-leve-steps-content]');

    expect(items[0]?.getAttribute('aria-current')).toBeNull();
    expect(items[1]?.getAttribute('aria-current')).toBe('step');
    expect(items[2]?.getAttribute('aria-current')).toBeNull();

    expect(items[0]?.getAttribute('data-state')).toBe('complete');
    expect(items[1]?.getAttribute('data-state')).toBe('current');
    expect(items[2]?.getAttribute('data-state')).toBe('upcoming');

    expect(triggers[0]?.getAttribute('data-state')).toBe('complete');
    expect(triggers[1]?.getAttribute('data-state')).toBe('current');
    expect(triggers[2]?.getAttribute('data-state')).toBe('upcoming');

    expect(indicators[0]?.getAttribute('data-state')).toBe('complete');
    expect(indicators[1]?.getAttribute('data-state')).toBe('current');
    expect(indicators[2]?.getAttribute('data-state')).toBe('upcoming');

    expect(separators[0]?.getAttribute('data-state')).toBe('complete');
    expect(separators[1]?.getAttribute('data-state')).toBe('current');

    expect(contents[0]?.getAttribute('data-state')).toBe('closed');
    expect(contents[0]?.hasAttribute('hidden')).toBe(true);
    expect(contents[1]?.getAttribute('data-state')).toBe('open');
    expect(contents[1]?.hasAttribute('hidden')).toBe(false);
    expect(contents[2]?.getAttribute('data-state')).toBe('closed');
    expect(contents[2]?.hasAttribute('hidden')).toBe(true);
  });

  it('navigates between steps using Trigger, NextTrigger, and PrevTrigger and updates boundary disabled states', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Steps.Root count={3}>
        <Steps.List>
          <Steps.Item index={0}>
            <Steps.Trigger>Step 1</Steps.Trigger>
          </Steps.Item>
          <Steps.Item index={1}>
            <Steps.Trigger>Step 2</Steps.Trigger>
          </Steps.Item>
          <Steps.Item index={2}>
            <Steps.Trigger>Step 3</Steps.Trigger>
          </Steps.Item>
        </Steps.List>
        <Steps.Content index={0}>Content 1</Steps.Content>
        <Steps.Content index={1}>Content 2</Steps.Content>
        <Steps.Content index={2}>Content 3</Steps.Content>
        <Steps.PrevTrigger>Prev</Steps.PrevTrigger>
        <Steps.NextTrigger>Next</Steps.NextTrigger>
      </Steps.Root>,
    );

    const items = screen.querySelectorAll('[data-leve-steps-item]');
    const triggers = screen.querySelectorAll('[data-leve-steps-trigger]');
    const prev = screen.querySelector<HTMLButtonElement>('[data-leve-steps-prev-trigger]');
    const next = screen.querySelector<HTMLButtonElement>('[data-leve-steps-next-trigger]');

    expect(prev?.disabled).toBe(true);
    expect(prev?.hasAttribute('data-disabled')).toBe(true);
    expect(next?.disabled).toBe(false);
    expect(next?.hasAttribute('data-disabled')).toBe(false);
    expect(items[0]?.getAttribute('aria-current')).toBe('step');

    await userEvent('[data-leve-steps-next-trigger]', 'click');
    expect(items[0]?.getAttribute('data-state')).toBe('complete');
    expect(items[1]?.getAttribute('aria-current')).toBe('step');
    expect(prev?.disabled).toBe(false);
    expect(next?.disabled).toBe(false);

    await userEvent(requireEl(triggers[2], 'step 3 trigger'), 'click');
    expect(items[2]?.getAttribute('aria-current')).toBe('step');
    expect(prev?.disabled).toBe(false);
    expect(next?.disabled).toBe(true);
    expect(next?.hasAttribute('data-disabled')).toBe(true);

    await userEvent('[data-leve-steps-prev-trigger]', 'click');
    expect(items[1]?.getAttribute('aria-current')).toBe('step');
    expect(next?.disabled).toBe(false);
  });

  it('prevents jumping ahead to upcoming steps in linear mode while allowing backward navigation', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Steps.Root count={3} linear>
        <Steps.List>
          <Steps.Item index={0}>
            <Steps.Trigger>Step 1</Steps.Trigger>
          </Steps.Item>
          <Steps.Item index={1}>
            <Steps.Trigger>Step 2</Steps.Trigger>
          </Steps.Item>
          <Steps.Item index={2}>
            <Steps.Trigger>Step 3</Steps.Trigger>
          </Steps.Item>
        </Steps.List>
        <Steps.PrevTrigger>Prev</Steps.PrevTrigger>
        <Steps.NextTrigger>Next</Steps.NextTrigger>
      </Steps.Root>,
    );

    const items = screen.querySelectorAll('[data-leve-steps-item]');
    const triggers = screen.querySelectorAll<HTMLButtonElement>('[data-leve-steps-trigger]');

    // Upcoming triggers are disabled, but their parent items do not receive data-disabled
    expect(triggers[0]?.disabled).toBe(false);
    expect(triggers[1]?.disabled).toBe(true);
    expect(triggers[1]?.hasAttribute('data-disabled')).toBe(true);
    expect(triggers[2]?.disabled).toBe(true);
    expect(items[1]?.hasAttribute('data-disabled')).toBe(false);

    // Clicking an upcoming trigger has no effect
    await userEvent(requireEl(triggers[2], 'upcoming trigger'), 'click');
    expect(items[0]?.getAttribute('aria-current')).toBe('step');

    // Advancing via NextTrigger makes step 1 current and step 0 complete
    await userEvent('[data-leve-steps-next-trigger]', 'click');
    expect(items[1]?.getAttribute('aria-current')).toBe('step');
    expect(triggers[0]?.disabled).toBe(false);
    expect(triggers[1]?.disabled).toBe(false);
    expect(triggers[2]?.disabled).toBe(true);

    // Clicking a completed trigger moves back to step 0
    await userEvent(requireEl(triggers[0], 'completed trigger'), 'click');
    expect(items[0]?.getAttribute('aria-current')).toBe('step');
  });

  it('disables item and trigger when item disabled prop is true', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Steps.Root count={3}>
        <Steps.List>
          <Steps.Item index={0}>
            <Steps.Trigger>Step 1</Steps.Trigger>
          </Steps.Item>
          <Steps.Item index={1} disabled>
            <Steps.Trigger>Step 2</Steps.Trigger>
          </Steps.Item>
          <Steps.Item index={2}>
            <Steps.Trigger>Step 3</Steps.Trigger>
          </Steps.Item>
        </Steps.List>
      </Steps.Root>,
    );

    const items = screen.querySelectorAll('[data-leve-steps-item]');
    const triggers = screen.querySelectorAll<HTMLButtonElement>('[data-leve-steps-trigger]');

    expect(items[1]?.hasAttribute('data-disabled')).toBe(true);
    expect(triggers[1]?.disabled).toBe(true);
    expect(triggers[1]?.hasAttribute('data-disabled')).toBe(true);

    await userEvent(requireEl(triggers[1], 'disabled trigger'), 'click');
    expect(items[0]?.getAttribute('aria-current')).toBe('step');
    expect(items[1]?.getAttribute('aria-current')).toBeNull();
  });

  it('supports orientation="horizontal" by default and orientation="vertical"', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Steps.Root count={2} orientation="vertical">
        <Steps.List>
          <Steps.Item index={0}>
            <Steps.Trigger>Step 1</Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
          <Steps.Item index={1}>
            <Steps.Trigger>Step 2</Steps.Trigger>
          </Steps.Item>
        </Steps.List>
      </Steps.Root>,
    );

    expect(screen.querySelector('[data-leve-steps]')?.getAttribute('data-orientation')).toBe(
      'vertical',
    );
    expect(screen.querySelector('[data-leve-steps-list]')?.getAttribute('data-orientation')).toBe(
      'vertical',
    );
    expect(screen.querySelector('[data-leve-steps-item]')?.getAttribute('data-orientation')).toBe(
      'vertical',
    );
    expect(
      screen.querySelector('[data-leve-steps-separator]')?.getAttribute('data-orientation'),
    ).toBe('vertical');
  });

  it('supports controlled mode with bind:step and fires onStepChange$', async () => {
    const ControlledExample = component$(() => {
      const step = useSignal(1);
      const changes = useSignal<number[]>([]);

      return (
        <div>
          <span data-testid="step-value">{step.value}</span>
          <span data-testid="changes">{changes.value.join(',')}</span>
          <button
            type="button"
            data-testid="external-set"
            onClick$={() => {
              step.value = 2;
            }}
          >
            Jump
          </button>
          <Steps.Root
            count={3}
            bind:step={step}
            onStepChange$={$((next: number) => {
              changes.value = [...changes.value, next];
            })}
          >
            <Steps.List>
              <Steps.Item index={0}>
                <Steps.Trigger>Step 1</Steps.Trigger>
              </Steps.Item>
              <Steps.Item index={1}>
                <Steps.Trigger>Step 2</Steps.Trigger>
              </Steps.Item>
              <Steps.Item index={2}>
                <Steps.Trigger>Step 3</Steps.Trigger>
              </Steps.Item>
            </Steps.List>
            <Steps.PrevTrigger>Prev</Steps.PrevTrigger>
            <Steps.NextTrigger>Next</Steps.NextTrigger>
          </Steps.Root>
        </div>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<ControlledExample />);

    const items = screen.querySelectorAll('[data-leve-steps-item]');
    const triggers = screen.querySelectorAll('[data-leve-steps-trigger]');
    expect(items[1]?.getAttribute('aria-current')).toBe('step');

    // Clicking the current step trigger does not fire onStepChange$
    await userEvent(requireEl(triggers[1], 'current step trigger'), 'click');
    expect(screen.querySelector('[data-testid="changes"]')?.textContent).toBe('');

    await userEvent('[data-leve-steps-next-trigger]', 'click');
    expect(screen.querySelector('[data-testid="step-value"]')?.textContent).toBe('2');
    expect(screen.querySelector('[data-testid="changes"]')?.textContent).toBe('2');
    expect(items[2]?.getAttribute('aria-current')).toBe('step');

    await userEvent('[data-leve-steps-prev-trigger]', 'click');
    expect(screen.querySelector('[data-testid="step-value"]')?.textContent).toBe('1');
    expect(screen.querySelector('[data-testid="changes"]')?.textContent).toBe('2,1');

    await userEvent('[data-testid="external-set"]', 'click');
    expect(items[2]?.getAttribute('aria-current')).toBe('step');
  });

  it('clamps out-of-range defaultStep and handles count=0 safely', async () => {
    const { screen, render } = await createDOM();
    await render(
      <div>
        <Steps.Root count={3} defaultStep={10} data-testid="clamped-high">
          <Steps.List>
            <Steps.Item index={0}>
              <Steps.Trigger>1</Steps.Trigger>
            </Steps.Item>
            <Steps.Item index={1}>
              <Steps.Trigger>2</Steps.Trigger>
            </Steps.Item>
            <Steps.Item index={2}>
              <Steps.Trigger>3</Steps.Trigger>
            </Steps.Item>
          </Steps.List>
        </Steps.Root>
        <Steps.Root count={3} defaultStep={-5} data-testid="clamped-low">
          <Steps.List>
            <Steps.Item index={0}>
              <Steps.Trigger>1</Steps.Trigger>
            </Steps.Item>
            <Steps.Item index={1}>
              <Steps.Trigger>2</Steps.Trigger>
            </Steps.Item>
            <Steps.Item index={2}>
              <Steps.Trigger>3</Steps.Trigger>
            </Steps.Item>
          </Steps.List>
        </Steps.Root>
        <Steps.Root count={0} data-testid="empty">
          <Steps.PrevTrigger>Prev</Steps.PrevTrigger>
          <Steps.NextTrigger>Next</Steps.NextTrigger>
        </Steps.Root>
      </div>,
    );

    const highItems = requireEl(
      screen.querySelector('[data-testid="clamped-high"]'),
      'clamped-high root',
    ).querySelectorAll('[data-leve-steps-item]');
    expect(highItems[2]?.getAttribute('aria-current')).toBe('step');

    const lowItems = requireEl(
      screen.querySelector('[data-testid="clamped-low"]'),
      'clamped-low root',
    ).querySelectorAll('[data-leve-steps-item]');
    expect(lowItems[0]?.getAttribute('aria-current')).toBe('step');

    const emptyRoot = requireEl(screen.querySelector('[data-testid="empty"]'), 'empty root');
    expect(
      emptyRoot.querySelector<HTMLButtonElement>('[data-leve-steps-prev-trigger]')?.disabled,
    ).toBe(true);
    expect(
      emptyRoot.querySelector<HTMLButtonElement>('[data-leve-steps-next-trigger]')?.disabled,
    ).toBe(true);
  });

  it('forwards custom props without leaking internal props and composes onClick$ handlers', async () => {
    const Wrapper = component$(() => {
      const clicks = useSignal(0);
      return (
        <div>
          <span data-testid="clicks">{clicks.value}</span>
          <Steps.Root count={2} class="custom-root" aria-label="Checkout steps">
            <Steps.List class="custom-list">
              <Steps.Item index={0} class="custom-item">
                <Steps.Trigger
                  class="custom-trigger"
                  onClick$={() => {
                    clicks.value++;
                  }}
                >
                  <Steps.Indicator class="custom-indicator">1</Steps.Indicator>
                  Account
                </Steps.Trigger>
                <Steps.Separator class="custom-separator" />
              </Steps.Item>
              <Steps.Item index={1}>
                <Steps.Trigger>Review</Steps.Trigger>
              </Steps.Item>
            </Steps.List>
            <Steps.Content index={0} class="custom-content">
              Step 1 content
            </Steps.Content>
            <Steps.PrevTrigger class="custom-prev">Prev</Steps.PrevTrigger>
            <Steps.NextTrigger
              class="custom-next"
              onClick$={() => {
                clicks.value++;
              }}
            >
              Next
            </Steps.NextTrigger>
          </Steps.Root>
        </div>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Wrapper />);

    const root = requireEl(screen.querySelector('[data-leve-steps]'), 'root');
    expect(root.classList.contains('custom-root')).toBe(true);
    expect(root.getAttribute('aria-label')).toBe('Checkout steps');
    expect(root.hasAttribute('count')).toBe(false);
    expect(root.hasAttribute('linear')).toBe(false);
    expect(root.hasAttribute('orientation')).toBe(false);

    expect(screen.querySelector('[data-leve-steps-list]')?.classList.contains('custom-list')).toBe(
      true,
    );
    const item = requireEl(screen.querySelector('[data-leve-steps-item]'), 'item');
    expect(item.classList.contains('custom-item')).toBe(true);
    expect(item.hasAttribute('index')).toBe(false);

    expect(
      screen.querySelector('[data-leve-steps-trigger]')?.classList.contains('custom-trigger'),
    ).toBe(true);
    expect(
      screen.querySelector('[data-leve-steps-indicator]')?.classList.contains('custom-indicator'),
    ).toBe(true);
    expect(
      screen.querySelector('[data-leve-steps-separator]')?.classList.contains('custom-separator'),
    ).toBe(true);
    const content = requireEl(screen.querySelector('[data-leve-steps-content]'), 'content');
    expect(content.classList.contains('custom-content')).toBe(true);
    expect(content.hasAttribute('index')).toBe(false);
    expect(
      screen.querySelector('[data-leve-steps-prev-trigger]')?.classList.contains('custom-prev'),
    ).toBe(true);
    expect(
      screen.querySelector('[data-leve-steps-next-trigger]')?.classList.contains('custom-next'),
    ).toBe(true);

    await userEvent('[data-leve-steps-next-trigger]', 'click');
    expect(screen.querySelector('[data-testid="clicks"]')?.textContent).toBe('1');
    expect(screen.querySelectorAll('[data-leve-steps-item]')[1]?.getAttribute('aria-current')).toBe(
      'step',
    );

    await userEvent('.custom-trigger', 'click');
    expect(screen.querySelector('[data-testid="clicks"]')?.textContent).toBe('2');
    expect(screen.querySelectorAll('[data-leve-steps-item]')[0]?.getAttribute('aria-current')).toBe(
      'step',
    );
  });
});
