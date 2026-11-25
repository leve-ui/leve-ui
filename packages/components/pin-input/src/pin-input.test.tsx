import { component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { Field } from '@leve-ui/field';
import { describe, expect, it } from 'vitest';
import { PinInput } from './index';

function getInputs(screen: HTMLElement): HTMLInputElement[] {
  return Array.from(screen.querySelectorAll<HTMLInputElement>('[data-leve-pin-input-input]'));
}

describe('PinInput', () => {
  it('renders Root, Input, and HiddenInput with expected roles, ARIA, and data attributes', async () => {
    const { screen, render } = await createDOM();
    await render(
      <PinInput.Root length={4} aria-label="Verification code">
        <PinInput.Input index={0} />
        <PinInput.Input index={1} />
        <PinInput.Input index={2} />
        <PinInput.Input index={3} />
        <PinInput.HiddenInput name="code" />
      </PinInput.Root>,
    );

    const root = screen.querySelector('[data-leve-pin-input]');
    expect(root?.getAttribute('role')).toBe('group');
    expect(root?.getAttribute('aria-label')).toBe('Verification code');
    expect(root?.getAttribute('data-state')).toBe('incomplete');

    const inputs = getInputs(screen);
    expect(inputs).toHaveLength(4);
    expect(inputs[0].getAttribute('aria-label')).toBe('Digit 1 of 4');
    expect(inputs[3].getAttribute('aria-label')).toBe('Digit 4 of 4');
    expect(inputs[0].getAttribute('autocomplete')).toBe('one-time-code');
    expect(inputs[1].getAttribute('autocomplete')).toBe('off');
    expect(inputs[0].getAttribute('inputmode')).toBe('numeric');
    expect(inputs[0].getAttribute('type')).toBe('text');
    expect(inputs[0].getAttribute('data-state')).toBe('empty');

    const hidden = screen.querySelector<HTMLInputElement>('[data-leve-pin-input-hidden-input]');
    expect(hidden?.getAttribute('aria-hidden')).toBe('true');
    expect(hidden?.getAttribute('tabindex')).toBe('-1');
    expect(hidden?.getAttribute('name')).toBe('code');
    expect(hidden?.getAttribute('data-state')).toBe('incomplete');
    expect(hidden?.style.position).toBe('absolute');
    expect(hidden?.style.opacity).toBe('0');
  });

  it('supports mask, otp={false}, alphanumeric type, and custom aria-label', async () => {
    const { screen, render } = await createDOM();
    await render(
      <PinInput.Root type="alphanumeric" mask otp={false} placeholder="*">
        <PinInput.Input index={0} aria-label="First char" />
        <PinInput.Input index={1} />
      </PinInput.Root>,
    );

    const inputs = getInputs(screen);
    expect(inputs[0].getAttribute('type')).toBe('password');
    expect(inputs[0].getAttribute('inputmode')).toBe('text');
    expect(inputs[0].getAttribute('autocomplete')).toBe('off');
    expect(inputs[0].getAttribute('aria-label')).toBe('First char');
    expect(inputs[1].getAttribute('aria-label')).toBe('Digit 2');
    expect(inputs[0].getAttribute('placeholder')).toBe('*');
  });

  it('forwards arbitrary props and protects library attributes', async () => {
    const { screen, render } = await createDOM();
    await render(
      <PinInput.Root class="my-pin" data-testid="pin-root" role="region" length={2}>
        <PinInput.Input index={0} class="my-input" />
        <PinInput.Input index={1} />
      </PinInput.Root>,
    );

    const root = screen.querySelector('[data-leve-pin-input]');
    expect(root?.getAttribute('class')).toBe('my-pin');
    expect(root?.getAttribute('data-testid')).toBe('pin-root');
    expect(root?.getAttribute('role')).toBe('group');

    const inputs = getInputs(screen);
    expect(inputs[0].getAttribute('class')).toBe('my-input');
  });

  it('handles defaultValue, onValueChange$, and onComplete$', async () => {
    const Demo = component$(() => {
      const lastChange = useSignal('');
      const completed = useSignal('');
      return (
        <div>
          <PinInput.Root
            length={4}
            defaultValue={['1', '2', '3', '']}
            onValueChange$={(val) => {
              lastChange.value = val.join(',');
            }}
            onComplete$={(val) => {
              completed.value = val;
            }}
          >
            <PinInput.Input index={0} />
            <PinInput.Input index={1} />
            <PinInput.Input index={2} />
            <PinInput.Input index={3} />
            <PinInput.HiddenInput />
          </PinInput.Root>
          <span data-testid="last-change">{lastChange.value}</span>
          <span data-testid="completed">{completed.value}</span>
        </div>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Demo />);

    const root = screen.querySelector('[data-leve-pin-input]');
    expect(root?.getAttribute('data-state')).toBe('incomplete');

    const inputs = getInputs(screen);
    expect(inputs[0].getAttribute('data-state')).toBe('filled');
    expect(inputs[3].getAttribute('data-state')).toBe('empty');

    // Reject invalid char in numeric mode
    inputs[3].value = 'a';
    await userEvent(inputs[3], 'input');
    expect(inputs[3].value).toBe('');
    expect(screen.querySelector('[data-testid="last-change"]')?.textContent).toBe('');

    // Accept valid digit and complete
    inputs[3].value = '4';
    await userEvent(inputs[3], 'input');
    expect(screen.querySelector('[data-testid="last-change"]')?.textContent).toBe('1,2,3,4');
    expect(screen.querySelector('[data-testid="completed"]')?.textContent).toBe('1234');
    expect(root?.getAttribute('data-state')).toBe('complete');

    const hidden = screen.querySelector<HTMLInputElement>('[data-leve-pin-input-hidden-input]');
    expect(hidden?.value).toBe('1234');
  });

  it('supports controlled mode with bind:value', async () => {
    const Demo = component$(() => {
      const code = useSignal(['9', '8']);
      return (
        <div>
          <PinInput.Root length={2} bind:value={code}>
            <PinInput.Input index={0} />
            <PinInput.Input index={1} />
          </PinInput.Root>
          <button
            type="button"
            data-testid="clear"
            onClick$={() => {
              code.value = ['', ''];
            }}
          >
            Clear
          </button>
        </div>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Demo />);

    const root = screen.querySelector('[data-leve-pin-input]');
    expect(root?.getAttribute('data-state')).toBe('complete');

    await userEvent('[data-testid="clear"]', 'click');
    expect(root?.getAttribute('data-state')).toBe('incomplete');
    expect(getInputs(screen)[0].getAttribute('data-state')).toBe('empty');
  });

  it('exposes disabled, readOnly, and invalid data attributes', async () => {
    const { screen, render } = await createDOM();
    await render(
      <PinInput.Root length={2} disabled readOnly invalid>
        <PinInput.Input index={0} />
        <PinInput.Input index={1} />
        <PinInput.HiddenInput />
      </PinInput.Root>,
    );

    const root = screen.querySelector('[data-leve-pin-input]');
    expect(root?.hasAttribute('data-disabled')).toBe(true);
    expect(root?.hasAttribute('data-readonly')).toBe(true);
    expect(root?.hasAttribute('data-invalid')).toBe(true);

    const inputs = getInputs(screen);
    expect(inputs[0].disabled).toBe(true);
    expect(inputs[0].readOnly).toBe(true);
    expect(inputs[0].getAttribute('aria-invalid')).toBe('true');
    expect(inputs[0].hasAttribute('data-disabled')).toBe(true);
    expect(inputs[0].hasAttribute('data-readonly')).toBe(true);
    expect(inputs[0].hasAttribute('data-invalid')).toBe(true);

    const hidden = screen.querySelector<HTMLInputElement>('[data-leve-pin-input-hidden-input]');
    expect(hidden?.disabled).toBe(true);
  });

  it('wires Field context to Root and first Input without duplicate IDs', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Field.Root hasDescription invalid required>
        <Field.Label>Security PIN</Field.Label>
        <PinInput.Root length={3}>
          <PinInput.Input index={0} />
          <PinInput.Input index={1} />
          <PinInput.Input index={2} />
          <PinInput.HiddenInput name="pin" />
        </PinInput.Root>
        <Field.Description>Enter your 3-digit PIN.</Field.Description>
        <Field.ErrorMessage>PIN is required.</Field.ErrorMessage>
      </Field.Root>,
    );

    const label = screen.querySelector('[data-leve-field-label]');
    const root = screen.querySelector('[data-leve-pin-input]');
    const desc = screen.querySelector('[data-leve-field-description]');
    const err = screen.querySelector('[data-leve-field-error-message]');
    const inputs = getInputs(screen);
    const hidden = screen.querySelector<HTMLInputElement>('[data-leve-pin-input-hidden-input]');

    expect(label?.getAttribute('for')).toBe(inputs[0].id);
    expect(inputs[0].id).toBeTruthy();
    expect(inputs[1].id).toBe('');
    expect(root?.id).not.toBe(inputs[0].id);
    expect(root?.getAttribute('aria-labelledby')).toBe(label?.id);
    expect(root?.getAttribute('aria-describedby')).toBe(`${desc?.id} ${err?.id}`);
    expect(root?.hasAttribute('data-invalid')).toBe(true);
    expect(inputs[0].getAttribute('aria-invalid')).toBe('true');
    expect(hidden?.required).toBe(true);
  });

  it('resets signal and syncs DOM inputs on native form reset', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <form>
        <PinInput.Root length={3} defaultValue={['1', '2', '3']}>
          <PinInput.Input index={0} />
          <PinInput.Input index={1} />
          <PinInput.Input index={2} />
          <PinInput.HiddenInput name="pin" />
        </PinInput.Root>
      </form>,
    );

    const inputs = getInputs(screen);
    inputs[0].value = '9';
    await userEvent(inputs[0], 'input');
    expect(inputs[0].value).toBe('9');

    const form = screen.querySelector('form');
    const resetEvent = form?.ownerDocument.createEvent('Event');
    resetEvent?.initEvent('reset', true, true);
    if (resetEvent) {
      form?.dispatchEvent(resetEvent);
    }
    await new Promise((r) => setTimeout(r, 25));
    await userEvent(screen, 'noop');

    expect(getInputs(screen)[0].value).toBe('1');
    const hidden = screen.querySelector<HTMLInputElement>('[data-leve-pin-input-hidden-input]');
    expect(hidden?.value).toBe('123');
  });
});
