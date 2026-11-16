import { createDOM } from '@builder.io/qwik/testing';
import { Checkbox } from '@leve-ui/checkbox';
import { Field } from '@leve-ui/field';
import { RadioGroup } from '@leve-ui/radio-group';
import { Switch } from '@leve-ui/switch';
import { Toggle } from '@leve-ui/toggle';
import { ToggleGroup } from '@leve-ui/toggle-group';
import { describe, expect, it } from 'vitest';
import { Fieldset } from './index';

describe('Fieldset', () => {
  it('<fieldset> と <legend> として描画される', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Fieldset.Root>
        <Fieldset.Legend>Shipping</Fieldset.Legend>
        <input />
      </Fieldset.Root>,
    );

    const root = screen.querySelector('[data-leve-fieldset]');
    const legend = screen.querySelector('[data-leve-fieldset-legend]');
    expect(root?.tagName).toBe('FIELDSET');
    expect(legend?.tagName).toBe('LEGEND');
    expect(legend?.textContent).toBe('Shipping');
    expect(root?.hasAttribute('disabled')).toBe(false);
    expect(root?.hasAttribute('data-disabled')).toBe(false);
    expect(legend?.hasAttribute('data-disabled')).toBe(false);
  });

  it('disabled のときは disabled と data-disabled を出力する', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Fieldset.Root disabled>
        <Fieldset.Legend>Shipping</Fieldset.Legend>
        <input />
      </Fieldset.Root>,
    );

    const root = screen.querySelector('[data-leve-fieldset]');
    expect(root?.hasAttribute('disabled')).toBe(true);
    expect(root?.getAttribute('data-disabled')).toBe('');
    expect(screen.querySelector('[data-leve-fieldset-legend]')?.getAttribute('data-disabled')).toBe(
      '',
    );
  });

  it('任意の props を要素に渡す', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Fieldset.Root class="fs" name="shipping">
        <Fieldset.Legend class="lg">Shipping</Fieldset.Legend>
      </Fieldset.Root>,
    );

    expect(screen.querySelector('[data-leve-fieldset]')?.getAttribute('name')).toBe('shipping');
    expect(screen.querySelector('[data-leve-fieldset]')?.getAttribute('class')).toBe('fs');
    expect(screen.querySelector('[data-leve-fieldset-legend]')?.getAttribute('class')).toBe('lg');
  });

  it('disabled のとき、中の leve-ui のフォームコントロールも無効になる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Fieldset.Root disabled>
        <Fieldset.Legend>Settings</Fieldset.Legend>
        <Checkbox.Root>
          <Checkbox.Control />
        </Checkbox.Root>
        <Switch.Root>
          <Switch.Control />
        </Switch.Root>
        <RadioGroup.Root aria-label="Plan">
          <RadioGroup.Item value="free">Free</RadioGroup.Item>
        </RadioGroup.Root>
        <Toggle.Root>Bold</Toggle.Root>
        <ToggleGroup.Root aria-label="Align">
          <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
        </ToggleGroup.Root>
        <Field.Root>
          <Field.Label>Name</Field.Label>
          <Field.Input />
        </Field.Root>
      </Fieldset.Root>,
    );

    const selectors = [
      '[data-leve-checkbox]',
      '[data-leve-checkbox-control]',
      '[data-leve-switch]',
      '[data-leve-switch-control]',
      '[data-leve-radio-group]',
      '[data-leve-radio-group-item]',
      '[data-leve-toggle]',
      '[data-leve-toggle-group]',
      '[data-leve-toggle-group-item]',
      '[data-leve-field]',
      '[data-leve-field-label]',
      '[data-leve-field-input]',
    ];
    for (const selector of selectors) {
      expect(screen.querySelector(selector)?.hasAttribute('data-disabled'), selector).toBe(true);
    }
    for (const selector of [
      '[data-leve-checkbox-control]',
      '[data-leve-switch-control]',
      '[data-leve-radio-group-item]',
      '[data-leve-toggle]',
      '[data-leve-toggle-group-item]',
      '[data-leve-field-input]',
    ]) {
      expect(screen.querySelector<HTMLButtonElement>(selector)?.disabled, selector).toBe(true);
    }
    expect(screen.querySelector('[data-leve-radio-group]')?.getAttribute('aria-disabled')).toBe(
      'true',
    );
  });

  it('disabled のとき、クリックしても状態が変わらない', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Fieldset.Root disabled>
        <Checkbox.Root>
          <Checkbox.Control />
        </Checkbox.Root>
        <Toggle.Root>Bold</Toggle.Root>
      </Fieldset.Root>,
    );

    await userEvent('[data-leve-checkbox-control]', 'click');
    await userEvent('[data-leve-toggle]', 'click');
    expect(screen.querySelector('[data-leve-checkbox-control]')?.getAttribute('data-state')).toBe(
      'unchecked',
    );
    expect(screen.querySelector('[data-leve-toggle]')?.getAttribute('data-state')).toBe('off');
  });

  it('disabled でない Fieldset の中ではコントロールは無効にならない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Fieldset.Root>
        <Checkbox.Root>
          <Checkbox.Control />
        </Checkbox.Root>
      </Fieldset.Root>,
    );

    const control = screen.querySelector<HTMLButtonElement>('[data-leve-checkbox-control]');
    expect(control?.disabled).toBe(false);
    expect(control?.hasAttribute('data-disabled')).toBe(false);
  });

  it('入れ子の Fieldset は祖先が disabled なら無効になり、Legend の中のコントロールはその Fieldset の disabled の影響を受けない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <>
        <Fieldset.Root disabled>
          <Fieldset.Root>
            <Toggle.Root data-testid="nested">Nested</Toggle.Root>
          </Fieldset.Root>
        </Fieldset.Root>
        <Fieldset.Root disabled>
          <Fieldset.Legend>
            <Toggle.Root data-testid="in-legend">In legend</Toggle.Root>
          </Fieldset.Legend>
        </Fieldset.Root>
      </>,
    );

    const nested = screen.querySelector<HTMLButtonElement>('[data-testid="nested"]');
    const inLegend = screen.querySelector<HTMLButtonElement>('[data-testid="in-legend"]');
    expect(nested?.disabled).toBe(true);
    expect(inLegend?.disabled).toBe(false);
    expect(inLegend?.hasAttribute('data-disabled')).toBe(false);
  });
});
