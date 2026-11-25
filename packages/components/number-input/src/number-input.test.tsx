import { $, component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { Field } from '@leve-ui/field';
import { Fieldset } from '@leve-ui/fieldset';
import { describe, expect, it } from 'vitest';
import { NumberInput } from './index';
import { clampNumber, formatNumber, parseNumber, stepNumber } from './number-format';

describe('number-format', () => {
  it('formats numbers with locale and options', () => {
    expect(formatNumber(null)).toBe('');
    expect(formatNumber(Number.NaN)).toBe('');
    expect(formatNumber(1234.5, 'en-US')).toBe('1,234.5');
    expect(formatNumber(1234.5, 'de-DE')).toBe('1.234,5');
    expect(formatNumber(42.5, 'en-US', { style: 'currency', currency: 'USD' })).toBe('$42.50');
    expect(formatNumber(0.5, 'en-US', { style: 'percent' })).toBe('50%');
  });

  it('parses locale-formatted numbers, affixes, minus signs, and whitespace', () => {
    expect(parseNumber('')).toBeNull();
    expect(parseNumber('   ')).toBeNull();
    expect(parseNumber('abc')).toBeNull();
    expect(parseNumber('12abc')).toBeNull();

    expect(parseNumber('1,234.56', 'en-US')).toBe(1234.56);
    expect(parseNumber('1.234,56', 'de-DE')).toBe(1234.56);
    expect(parseNumber('1\u202F234,56', 'fr-FR')).toBe(1234.56);
    expect(parseNumber('1\u00A0234,56', 'fr-FR')).toBe(1234.56);
    expect(parseNumber('1 234,56', 'fr-FR')).toBe(1234.56);

    expect(parseNumber('$1,234.50', 'en-US', { style: 'currency', currency: 'USD' })).toBe(1234.5);
    expect(parseNumber('50%', 'en-US', { style: 'percent' })).toBe(0.5);
    expect(parseNumber('25', 'en-US', { style: 'percent' })).toBe(0.25);

    expect(parseNumber('\u221242', 'en-US')).toBe(-42);
    expect(parseNumber('١٢٣', 'ar-EG')).toBe(123);
  });

  it('avoids floating-point precision drift on step arithmetic', () => {
    expect(stepNumber(0.1, 0.2)).toBe(0.3);
    expect(stepNumber(0.3, -0.1)).toBe(0.2);
    expect(stepNumber(-0.1, 0.1)).toBe(0);
    expect(Object.is(stepNumber(-0.1, 0.1), -0)).toBe(false);
    expect(stepNumber(1e-7, 2e-7)).toBe(3e-7);
  });

  it('clamps numbers to finite min and max', () => {
    expect(clampNumber(5, 0, 10)).toBe(5);
    expect(clampNumber(-5, 0, 10)).toBe(0);
    expect(clampNumber(15, 0, 10)).toBe(10);
    expect(clampNumber(15, undefined, undefined)).toBe(15);
  });
});

describe('NumberInput', () => {
  it('renders parts with data-leve-* attributes and spinbutton ARIA attributes', async () => {
    const { screen, render } = await createDOM();
    await render(
      <NumberInput.Root min={0} max={100}>
        <NumberInput.DecrementTrigger>-</NumberInput.DecrementTrigger>
        <NumberInput.Input aria-label="Quantity" />
        <NumberInput.IncrementTrigger>+</NumberInput.IncrementTrigger>
      </NumberInput.Root>,
    );

    const root = screen.querySelector('[data-leve-number-input]');
    const input = screen.querySelector('[data-leve-number-input-input]') as HTMLInputElement;
    const dec = screen.querySelector('[data-leve-number-input-decrement-trigger]');
    const inc = screen.querySelector('[data-leve-number-input-increment-trigger]');

    expect(root).not.toBeNull();
    expect(root?.getAttribute('data-state')).toBe('empty');
    expect(input).not.toBeNull();
    expect(input.getAttribute('role')).toBe('spinbutton');
    expect(input.getAttribute('type')).toBe('text');
    expect(input.getAttribute('inputmode')).toBe('decimal');
    expect(input.getAttribute('autocomplete')).toBe('off');
    expect(input.getAttribute('aria-valuemin')).toBe('0');
    expect(input.getAttribute('aria-valuemax')).toBe('100');
    expect(input.hasAttribute('aria-valuenow')).toBe(false);
    expect(input.hasAttribute('aria-valuetext')).toBe(false);
    expect(input.getAttribute('data-state')).toBe('empty');

    expect(dec?.getAttribute('type')).toBe('button');
    expect(dec?.getAttribute('tabindex')).toBe('-1');
    expect(dec?.getAttribute('aria-label')).toBe('Decrement');
    expect(inc?.getAttribute('type')).toBe('button');
    expect(inc?.getAttribute('tabindex')).toBe('-1');
    expect(inc?.getAttribute('aria-label')).toBe('Increment');
  });

  it('sets aria-valuetext only when formatted string differs from plain number', async () => {
    const { screen, render } = await createDOM();
    await render(
      <>
        <NumberInput.Root defaultValue={42}>
          <NumberInput.Input aria-label="Plain" />
        </NumberInput.Root>
        <NumberInput.Root
          defaultValue={1234.5}
          formatOptions={{ style: 'currency', currency: 'USD' }}
        >
          <NumberInput.Input aria-label="Price" />
        </NumberInput.Root>
      </>,
    );

    const inputs = Array.from(screen.querySelectorAll('[data-leve-number-input-input]'));
    expect(inputs[0].getAttribute('aria-valuenow')).toBe('42');
    expect(inputs[0].hasAttribute('aria-valuetext')).toBe(false);

    expect(inputs[1].getAttribute('aria-valuenow')).toBe('1234.5');
    expect(inputs[1].getAttribute('aria-valuetext')).toBe('$1,234.50');
  });

  it('increments and decrements with triggers and avoids floating-point drift', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <NumberInput.Root defaultValue={0.1} step={0.2} min={0} max={0.5}>
        <NumberInput.DecrementTrigger>-</NumberInput.DecrementTrigger>
        <NumberInput.Input aria-label="Amount" />
        <NumberInput.IncrementTrigger>+</NumberInput.IncrementTrigger>
      </NumberInput.Root>,
    );

    const input = screen.querySelector('[data-leve-number-input-input]') as HTMLInputElement;
    const inc = screen.querySelector(
      '[data-leve-number-input-increment-trigger]',
    ) as HTMLButtonElement;
    const dec = screen.querySelector(
      '[data-leve-number-input-decrement-trigger]',
    ) as HTMLButtonElement;

    expect(input.value).toBe('0.1');

    await userEvent(inc, 'click');
    expect(input.value).toBe('0.3');
    expect(input.getAttribute('aria-valuenow')).toBe('0.3');

    await userEvent(inc, 'click');
    expect(input.value).toBe('0.5');
    expect(inc.disabled).toBe(true);
    expect(inc.hasAttribute('data-disabled')).toBe(true);

    await userEvent(dec, 'click');
    expect(input.value).toBe('0.3');
    expect(inc.disabled).toBe(false);
  });

  it('supports controlled bind:value and onValueChange$', async () => {
    const Controlled = component$(() => {
      const value = useSignal<number | null>(5);
      const lastChanged = useSignal<number | null>(null);
      return (
        <div>
          <NumberInput.Root
            bind:value={value}
            onValueChange$={$((v) => {
              lastChanged.value = v;
            })}
          >
            <NumberInput.DecrementTrigger>-</NumberInput.DecrementTrigger>
            <NumberInput.Input aria-label="Controlled" />
            <NumberInput.IncrementTrigger>+</NumberInput.IncrementTrigger>
          </NumberInput.Root>
          <span data-testid="value">{String(value.value)}</span>
          <span data-testid="changed">{String(lastChanged.value)}</span>
        </div>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Controlled />);

    await userEvent('[data-leve-number-input-increment-trigger]', 'click');
    expect(screen.querySelector('[data-testid="value"]')?.textContent).toBe('6');
    expect(screen.querySelector('[data-testid="changed"]')?.textContent).toBe('6');
  });

  it('commits, clamps, or reverts invalid text on blur', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <NumberInput.Root defaultValue={10} min={0} max={20}>
        <NumberInput.Input aria-label="Clamped" />
      </NumberInput.Root>,
    );

    const input = screen.querySelector('[data-leve-number-input-input]') as HTMLInputElement;

    input.value = '50';
    await userEvent(input, 'input');
    await userEvent(input, 'blur');
    expect(input.value).toBe('20');
    expect(input.getAttribute('aria-valuenow')).toBe('20');

    input.value = 'not-a-number';
    await userEvent(input, 'input');
    await userEvent(input, 'blur');
    expect(input.value).toBe('20');
    expect(input.getAttribute('aria-valuenow')).toBe('20');
  });

  it('respects clampValueOnBlur={false}', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <NumberInput.Root defaultValue={10} min={0} max={20} clampValueOnBlur={false}>
        <NumberInput.Input aria-label="Unclamped" />
      </NumberInput.Root>,
    );

    const input = screen.querySelector('[data-leve-number-input-input]') as HTMLInputElement;
    input.value = '50';
    await userEvent(input, 'input');
    await userEvent(input, 'blur');
    expect(input.value).toBe('50');
    expect(input.getAttribute('aria-valuenow')).toBe('50');
  });

  it('handles disabled and readOnly states', async () => {
    const { screen, render } = await createDOM();
    await render(
      <>
        <NumberInput.Root defaultValue={5} disabled>
          <NumberInput.DecrementTrigger>-</NumberInput.DecrementTrigger>
          <NumberInput.Input aria-label="Disabled" />
          <NumberInput.IncrementTrigger>+</NumberInput.IncrementTrigger>
        </NumberInput.Root>
        <NumberInput.Root defaultValue={5} readOnly>
          <NumberInput.DecrementTrigger>-</NumberInput.DecrementTrigger>
          <NumberInput.Input aria-label="ReadOnly" />
          <NumberInput.IncrementTrigger>+</NumberInput.IncrementTrigger>
        </NumberInput.Root>
      </>,
    );

    const roots = Array.from(screen.querySelectorAll('[data-leve-number-input]'));
    const inputs = Array.from(
      screen.querySelectorAll('[data-leve-number-input-input]'),
    ) as HTMLInputElement[];
    const incs = Array.from(
      screen.querySelectorAll('[data-leve-number-input-increment-trigger]'),
    ) as HTMLButtonElement[];

    expect(roots[0].hasAttribute('data-disabled')).toBe(true);
    expect(inputs[0].disabled).toBe(true);
    expect(inputs[0].getAttribute('aria-disabled')).toBe('true');
    expect(incs[0].disabled).toBe(true);

    expect(roots[1].hasAttribute('data-readonly')).toBe(true);
    expect(inputs[1].readOnly).toBe(true);
    expect(inputs[1].getAttribute('aria-readonly')).toBe('true');
    expect(incs[1].disabled).toBe(true);
  });

  it('integrates with Field and Fieldset', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Fieldset.Root disabled>
        <Field.Root invalid required hasDescription>
          <Field.Label>Age</Field.Label>
          <NumberInput.Root>
            <NumberInput.Input />
          </NumberInput.Root>
          <Field.Description>Enter your age.</Field.Description>
          <Field.ErrorMessage>Age is required.</Field.ErrorMessage>
        </Field.Root>
      </Fieldset.Root>,
    );

    const label = screen.querySelector('label');
    const input = screen.querySelector('[data-leve-number-input-input]') as HTMLInputElement;
    const desc = screen.querySelector('[data-leve-field-description]');
    const err = screen.querySelector('[data-leve-field-error-message]');

    expect(input.id).toBeTruthy();
    expect(label?.getAttribute('for')).toBe(input.id);
    expect(input.getAttribute('aria-describedby')).toBe(`${desc?.id} ${err?.id}`);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(input.disabled).toBe(true);
  });

  it('resets uncontrolled value on native form reset', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <form>
        <NumberInput.Root defaultValue={10}>
          <NumberInput.Input aria-label="Count" />
          <NumberInput.IncrementTrigger>+</NumberInput.IncrementTrigger>
        </NumberInput.Root>
      </form>,
    );

    const form = screen.querySelector('form') as HTMLFormElement;
    const input = screen.querySelector('[data-leve-number-input-input]') as HTMLInputElement;
    const inc = screen.querySelector(
      '[data-leve-number-input-increment-trigger]',
    ) as HTMLButtonElement;

    await userEvent(inc, 'click');
    expect(input.value).toBe('11');

    const resetEvent = form.ownerDocument.createEvent('Event');
    resetEvent.initEvent('reset', true, true);
    form.dispatchEvent(resetEvent);
    await new Promise((r) => setTimeout(r, 25));
    await userEvent(screen, 'noop');

    expect(input.value).toBe('10');
    expect(input.getAttribute('aria-valuenow')).toBe('10');
  });

  it('forwards arbitrary props such as class and custom aria-label', async () => {
    const { screen, render } = await createDOM();
    await render(
      <NumberInput.Root class="custom-root" data-testid="root">
        <NumberInput.Input class="custom-input" aria-label="Custom" />
        <NumberInput.IncrementTrigger class="custom-inc" aria-label="Add one">
          +
        </NumberInput.IncrementTrigger>
      </NumberInput.Root>,
    );

    const root = screen.querySelector('[data-leve-number-input]');
    const input = screen.querySelector('[data-leve-number-input-input]');
    const inc = screen.querySelector('[data-leve-number-input-increment-trigger]');

    expect(root?.classList.contains('custom-root')).toBe(true);
    expect(root?.getAttribute('data-testid')).toBe('root');
    expect(input?.classList.contains('custom-input')).toBe(true);
    expect(input?.getAttribute('aria-label')).toBe('Custom');
    expect(inc?.classList.contains('custom-inc')).toBe(true);
    expect(inc?.getAttribute('aria-label')).toBe('Add one');
  });
});
