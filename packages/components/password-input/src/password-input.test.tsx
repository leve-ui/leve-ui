import { $, component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { Field } from '@leve-ui/field';
import { describe, expect, it } from 'vitest';
import { PasswordInput } from './index';

describe('PasswordInput', () => {
  it('renders all parts with expected data attributes and default hidden state', async () => {
    const { screen, render } = await createDOM();
    await render(
      <PasswordInput.Root>
        <PasswordInput.Input aria-label="Password" />
        <PasswordInput.VisibilityTrigger aria-label="Toggle visibility">
          <PasswordInput.Indicator>eye</PasswordInput.Indicator>
        </PasswordInput.VisibilityTrigger>
      </PasswordInput.Root>,
    );

    const root = screen.querySelector('[data-leve-password-input]');
    const input = screen.querySelector('[data-leve-password-input-input]');
    const trigger = screen.querySelector('[data-leve-password-input-visibility-trigger]');
    const indicator = screen.querySelector('[data-leve-password-input-indicator]');

    expect(root).not.toBeNull();
    expect(root?.getAttribute('data-state')).toBe('hidden');
    expect(input?.tagName.toLowerCase()).toBe('input');
    expect(input?.getAttribute('type')).toBe('password');
    expect(input?.getAttribute('data-state')).toBe('hidden');
    expect(trigger?.tagName.toLowerCase()).toBe('button');
    expect(trigger?.getAttribute('type')).toBe('button');
    expect(trigger?.getAttribute('aria-pressed')).toBe('false');
    expect(trigger?.getAttribute('aria-controls')).toBe(input?.getAttribute('id'));
    expect(trigger?.getAttribute('data-state')).toBe('hidden');
    expect(indicator?.tagName.toLowerCase()).toBe('span');
    expect(indicator?.getAttribute('aria-hidden')).toBe('true');
    expect(indicator?.getAttribute('data-state')).toBe('hidden');
  });

  it('toggles visibility on trigger click (uncontrolled)', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <PasswordInput.Root>
        <PasswordInput.Input aria-label="Password" />
        <PasswordInput.VisibilityTrigger aria-label="Toggle visibility">
          <PasswordInput.Indicator>eye</PasswordInput.Indicator>
        </PasswordInput.VisibilityTrigger>
      </PasswordInput.Root>,
    );

    const root = screen.querySelector('[data-leve-password-input]');
    const input = screen.querySelector('[data-leve-password-input-input]');
    const trigger = screen.querySelector('[data-leve-password-input-visibility-trigger]');
    const indicator = screen.querySelector('[data-leve-password-input-indicator]');

    await userEvent('[data-leve-password-input-visibility-trigger]', 'click');
    expect(input?.getAttribute('type')).toBe('text');
    expect(trigger?.getAttribute('aria-pressed')).toBe('true');
    expect(root?.getAttribute('data-state')).toBe('visible');
    expect(input?.getAttribute('data-state')).toBe('visible');
    expect(trigger?.getAttribute('data-state')).toBe('visible');
    expect(indicator?.getAttribute('data-state')).toBe('visible');

    await userEvent('[data-leve-password-input-visibility-trigger]', 'click');
    expect(input?.getAttribute('type')).toBe('password');
    expect(trigger?.getAttribute('aria-pressed')).toBe('false');
    expect(root?.getAttribute('data-state')).toBe('hidden');
  });

  it('respects defaultVisible', async () => {
    const { screen, render } = await createDOM();
    await render(
      <PasswordInput.Root defaultVisible>
        <PasswordInput.Input aria-label="Password" />
        <PasswordInput.VisibilityTrigger aria-label="Toggle visibility" />
      </PasswordInput.Root>,
    );

    const input = screen.querySelector('[data-leve-password-input-input]');
    const trigger = screen.querySelector('[data-leve-password-input-visibility-trigger]');
    expect(input?.getAttribute('type')).toBe('text');
    expect(trigger?.getAttribute('aria-pressed')).toBe('true');
  });

  it('supports controlled visibility with bind:visible and onVisibleChange$', async () => {
    const Controlled = component$(() => {
      const visible = useSignal(false);
      const count = useSignal(0);
      const handleChange$ = $((next: boolean) => {
        if (next) count.value += 1;
      });
      return (
        <div>
          <PasswordInput.Root bind:visible={visible} onVisibleChange$={handleChange$}>
            <PasswordInput.Input aria-label="Password" />
            <PasswordInput.VisibilityTrigger aria-label="Toggle visibility" />
          </PasswordInput.Root>
          <span data-testid="count">{count.value}</span>
        </div>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Controlled />);

    const input = screen.querySelector('[data-leve-password-input-input]');
    expect(input?.getAttribute('type')).toBe('password');

    await userEvent('[data-leve-password-input-visibility-trigger]', 'click');
    expect(input?.getAttribute('type')).toBe('text');
    expect(screen.querySelector('[data-testid="count"]')?.textContent).toBe('1');
  });

  it('handles disabled, readOnly, required, and invalid states', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <PasswordInput.Root disabled readOnly required invalid>
        <PasswordInput.Input aria-label="Password" />
        <PasswordInput.VisibilityTrigger aria-label="Toggle visibility">
          <PasswordInput.Indicator>eye</PasswordInput.Indicator>
        </PasswordInput.VisibilityTrigger>
      </PasswordInput.Root>,
    );

    const root = screen.querySelector('[data-leve-password-input]');
    const input = screen.querySelector('[data-leve-password-input-input]');
    const trigger = screen.querySelector('[data-leve-password-input-visibility-trigger]');
    const indicator = screen.querySelector('[data-leve-password-input-indicator]');

    expect(root?.hasAttribute('data-disabled')).toBe(true);
    expect(root?.hasAttribute('data-readonly')).toBe(true);
    expect(root?.hasAttribute('data-invalid')).toBe(true);

    expect(input?.hasAttribute('disabled')).toBe(true);
    expect(input?.hasAttribute('readonly')).toBe(true);
    expect(input?.hasAttribute('required')).toBe(true);
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.hasAttribute('data-disabled')).toBe(true);
    expect(input?.hasAttribute('data-readonly')).toBe(true);
    expect(input?.hasAttribute('data-invalid')).toBe(true);

    expect(trigger?.hasAttribute('disabled')).toBe(true);
    expect(trigger?.hasAttribute('data-disabled')).toBe(true);
    expect(indicator?.hasAttribute('data-disabled')).toBe(true);

    // Disabled trigger does not toggle visibility
    await userEvent('[data-leve-password-input-visibility-trigger]', 'click');
    expect(input?.getAttribute('type')).toBe('password');
  });

  it('still allows toggling visibility when readOnly (not disabled)', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <PasswordInput.Root readOnly>
        <PasswordInput.Input aria-label="Password" />
        <PasswordInput.VisibilityTrigger aria-label="Toggle visibility" />
      </PasswordInput.Root>,
    );

    const input = screen.querySelector('[data-leve-password-input-input]');
    expect(input?.hasAttribute('readonly')).toBe(true);
    expect(input?.getAttribute('type')).toBe('password');

    await userEvent('[data-leve-password-input-visibility-trigger]', 'click');
    expect(input?.getAttribute('type')).toBe('text');
  });

  it('integrates with Field for label, description, errorMessage, and states', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Field.Root hasDescription disabled readOnly required invalid>
        <Field.Label>Password</Field.Label>
        <PasswordInput.Root>
          <PasswordInput.Input />
          <PasswordInput.VisibilityTrigger aria-label="Toggle visibility" />
        </PasswordInput.Root>
        <Field.Description>Must be at least 8 characters.</Field.Description>
        <Field.ErrorMessage>Password is too short.</Field.ErrorMessage>
      </Field.Root>,
    );

    const label = screen.querySelector('[data-leve-field-label]');
    const description = screen.querySelector('[data-leve-field-description]');
    const errorMessage = screen.querySelector('[data-leve-field-error-message]');
    const input = screen.querySelector('[data-leve-password-input-input]');
    const trigger = screen.querySelector('[data-leve-password-input-visibility-trigger]');

    expect(label?.getAttribute('for')).toBe(input?.getAttribute('id'));
    expect(trigger?.getAttribute('aria-controls')).toBe(input?.getAttribute('id'));
    expect(input?.getAttribute('aria-describedby')).toBe(
      `${description?.getAttribute('id')} ${errorMessage?.getAttribute('id')}`,
    );
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.hasAttribute('disabled')).toBe(true);
    expect(input?.hasAttribute('readonly')).toBe(true);
    expect(input?.hasAttribute('required')).toBe(true);
  });

  it('supports custom ids.input outside Field, autoComplete passthrough, and bind:value', async () => {
    const WithBindValue = component$(() => {
      const value = useSignal('secret123');
      return (
        <div>
          <PasswordInput.Root ids={{ input: 'custom-pw' }} class="my-root">
            <PasswordInput.Input
              aria-label="Password"
              autoComplete="current-password"
              bind:value={value}
              class="my-input"
            />
            <PasswordInput.VisibilityTrigger aria-label="Show password" class="my-trigger" />
          </PasswordInput.Root>
          <span data-testid="val">{value.value}</span>
        </div>
      );
    });

    const { screen, render } = await createDOM();
    await render(<WithBindValue />);

    const root = screen.querySelector('[data-leve-password-input]');
    const input = screen.querySelector(
      '[data-leve-password-input-input]',
    ) as HTMLInputElement | null;
    const trigger = screen.querySelector('[data-leve-password-input-visibility-trigger]');

    expect(root?.classList.contains('my-root')).toBe(true);
    expect(input?.classList.contains('my-input')).toBe(true);
    expect(trigger?.classList.contains('my-trigger')).toBe(true);
    expect(input?.getAttribute('id')).toBe('custom-pw');
    expect(trigger?.getAttribute('aria-controls')).toBe('custom-pw');
    expect(input?.getAttribute('autocomplete')).toBe('current-password');
    expect(input?.value).toBe('secret123');
  });
});
