import { $, component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { Field } from '@leve-ui/field';
import { describe, expect, it } from 'vitest';
import { Slider } from './index';
import { clampThumbValue, findNearestThumbIndex, snapToStep } from './slider-utils';

describe('Slider', () => {
  it('renders all parts with data-leve-slider* attributes and default ARIA attributes', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Slider.Root defaultValue={[40]}>
        <Slider.Track>
          <Slider.Range />
          <Slider.Thumb aria-label="Volume" />
        </Slider.Track>
        <Slider.HiddenInput name="volume" />
      </Slider.Root>,
    );

    const root = screen.querySelector('[data-leve-slider]');
    const track = screen.querySelector('[data-leve-slider-track]');
    const range = screen.querySelector('[data-leve-slider-range]');
    const thumb = screen.querySelector('[data-leve-slider-thumb]');
    const hiddenInput = screen.querySelector('[data-leve-slider-hidden-input]');

    expect(root).not.toBeNull();
    expect(root?.getAttribute('data-state')).toBe('idle');
    expect(root?.getAttribute('data-orientation')).toBe('horizontal');

    expect(track).not.toBeNull();
    expect(track?.getAttribute('data-orientation')).toBe('horizontal');

    expect(range).not.toBeNull();
    expect(range?.getAttribute('style')).toContain('--leve-slider-range-start:0%');
    expect(range?.getAttribute('style')).toContain('--leve-slider-range-size:40%');

    expect(thumb).not.toBeNull();
    expect(thumb?.getAttribute('role')).toBe('slider');
    expect(thumb?.getAttribute('tabindex')).toBe('0');
    expect(thumb?.getAttribute('aria-valuenow')).toBe('40');
    expect(thumb?.getAttribute('aria-valuemin')).toBe('0');
    expect(thumb?.getAttribute('aria-valuemax')).toBe('100');
    expect(thumb?.getAttribute('aria-orientation')).toBe('horizontal');
    expect(thumb?.getAttribute('aria-label')).toBe('Volume');
    expect(thumb?.getAttribute('data-state')).toBe('idle');
    expect(thumb?.getAttribute('data-index')).toBe('0');
    expect(thumb?.getAttribute('style')).toContain('--leve-slider-thumb-percent:40%');

    expect(hiddenInput).not.toBeNull();
    expect(hiddenInput?.getAttribute('type')).toBe('number');
    expect(hiddenInput?.getAttribute('aria-hidden')).toBe('true');
    expect(hiddenInput?.getAttribute('tabindex')).toBe('-1');
    expect((hiddenInput as HTMLInputElement).value).toBe('40');
  });

  it('supports multi-thumb dynamic bounds and range CSS variables', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Slider.Root defaultValue={[20, 80]} min={0} max={100} step={5} minStepsBetweenThumbs={2}>
        <Slider.Track>
          <Slider.Range />
          <Slider.Thumb index={0} aria-label="Minimum price" />
          <Slider.Thumb index={1} aria-label="Maximum price" />
        </Slider.Track>
      </Slider.Root>,
    );

    const thumbs = Array.from(screen.querySelectorAll('[data-leve-slider-thumb]'));
    expect(thumbs).toHaveLength(2);

    expect(thumbs[0]?.getAttribute('aria-valuenow')).toBe('20');
    expect(thumbs[0]?.getAttribute('aria-valuemin')).toBe('0');
    expect(thumbs[0]?.getAttribute('aria-valuemax')).toBe('70');

    expect(thumbs[1]?.getAttribute('aria-valuenow')).toBe('80');
    expect(thumbs[1]?.getAttribute('aria-valuemin')).toBe('30');
    expect(thumbs[1]?.getAttribute('aria-valuemax')).toBe('100');

    const range = screen.querySelector('[data-leve-slider-range]');
    expect(range?.getAttribute('style')).toContain('--leve-slider-range-start:20%');
    expect(range?.getAttribute('style')).toContain('--leve-slider-range-size:60%');
  });

  it('applies disabled, readOnly, invalid, and vertical orientation attributes', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Slider.Root defaultValue={[50]} orientation="vertical" disabled readOnly invalid>
        <Slider.Track>
          <Slider.Range />
          <Slider.Thumb aria-label="Level" />
        </Slider.Track>
        <Slider.HiddenInput name="level" />
      </Slider.Root>,
    );

    const root = screen.querySelector('[data-leve-slider]');
    const track = screen.querySelector('[data-leve-slider-track]');
    const range = screen.querySelector('[data-leve-slider-range]');
    const thumb = screen.querySelector('[data-leve-slider-thumb]');
    const hiddenInput = screen.querySelector('[data-leve-slider-hidden-input]');

    expect(root?.getAttribute('data-orientation')).toBe('vertical');
    expect(root?.hasAttribute('data-disabled')).toBe(true);
    expect(root?.hasAttribute('data-readonly')).toBe(true);
    expect(root?.hasAttribute('data-invalid')).toBe(true);

    expect(track?.getAttribute('data-orientation')).toBe('vertical');
    expect(track?.hasAttribute('data-disabled')).toBe(true);
    expect(track?.hasAttribute('data-readonly')).toBe(true);

    expect(range?.getAttribute('data-orientation')).toBe('vertical');
    expect(range?.hasAttribute('data-disabled')).toBe(true);

    expect(thumb?.getAttribute('tabindex')).toBe('-1');
    expect(thumb?.getAttribute('aria-orientation')).toBe('vertical');
    expect(thumb?.getAttribute('aria-disabled')).toBe('true');
    expect(thumb?.getAttribute('aria-readonly')).toBe('true');
    expect(thumb?.getAttribute('aria-invalid')).toBe('true');
    expect(thumb?.hasAttribute('data-disabled')).toBe(true);
    expect(thumb?.hasAttribute('data-readonly')).toBe(true);
    expect(thumb?.hasAttribute('data-invalid')).toBe(true);

    expect((hiddenInput as HTMLInputElement).disabled).toBe(true);
  });

  it('supports controlled bind:value', async () => {
    const Controlled = component$(() => {
      const value = useSignal([25]);
      return (
        <>
          <Slider.Root bind:value={value}>
            <Slider.Track>
              <Slider.Range />
              <Slider.Thumb aria-label="Controlled" />
            </Slider.Track>
          </Slider.Root>
          <button
            type="button"
            data-testid="update"
            onClick$={$(() => {
              value.value = [75];
            })}
          >
            Set 75
          </button>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Controlled />);

    const thumb = screen.querySelector('[data-leve-slider-thumb]');
    expect(thumb?.getAttribute('aria-valuenow')).toBe('25');

    await userEvent('[data-testid="update"]', 'click');
    expect(thumb?.getAttribute('aria-valuenow')).toBe('75');
    expect(thumb?.getAttribute('style')).toContain('--leve-slider-thumb-percent:75%');
  });

  it('integrates with Field for label, description, error message, and state', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Field.Root invalid required hasDescription>
        <Field.Label>Brightness</Field.Label>
        <Slider.Root defaultValue={[60]}>
          <Slider.Track>
            <Slider.Range />
            <Slider.Thumb />
          </Slider.Track>
          <Slider.HiddenInput name="brightness" />
        </Slider.Root>
        <Field.Description>Adjust screen brightness.</Field.Description>
        <Field.ErrorMessage>Value is out of range.</Field.ErrorMessage>
      </Field.Root>,
    );

    const label = screen.querySelector('[data-leve-field-label]');
    const description = screen.querySelector('[data-leve-field-description]');
    const error = screen.querySelector('[data-leve-field-error-message]');
    const thumb = screen.querySelector('[data-leve-slider-thumb]');
    const hiddenInput = screen.querySelector('[data-leve-slider-hidden-input]');

    expect(thumb?.getAttribute('aria-labelledby')).toBe(label?.getAttribute('id'));
    const describedBy = thumb?.getAttribute('aria-describedby') ?? '';
    expect(describedBy).toContain(description?.getAttribute('id') ?? '');
    expect(describedBy).toContain(error?.getAttribute('id') ?? '');
    expect(thumb?.getAttribute('aria-invalid')).toBe('true');
    expect((hiddenInput as HTMLInputElement).required).toBe(true);
  });

  it('passes arbitrary props while preserving required ARIA and data attributes', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Slider.Root class="custom-root" data-testid="slider-root" defaultValue={[30]}>
        <Slider.Track class="custom-track">
          <Slider.Range class="custom-range" />
          <Slider.Thumb class="custom-thumb" aria-label="Custom" />
        </Slider.Track>
      </Slider.Root>,
    );

    const root = screen.querySelector('[data-leve-slider]');
    const thumb = screen.querySelector('[data-leve-slider-thumb]');
    expect(root?.getAttribute('class')).toBe('custom-root');
    expect(root?.getAttribute('data-testid')).toBe('slider-root');
    expect(thumb?.getAttribute('class')).toBe('custom-thumb');
    expect(thumb?.getAttribute('role')).toBe('slider');
  });
});

describe('slider-utils', () => {
  it('snaps to fractional steps without floating-point drift', () => {
    expect(snapToStep(0.30000000000000004, 0, 1, 0.1)).toBe(0.3);
    expect(snapToStep(0.67, 0, 1, 0.05)).toBe(0.65);
    expect(snapToStep(98, 0, 95, 10)).toBe(90);
  });

  it('clamps thumb values respecting minStepsBetweenThumbs', () => {
    expect(clampThumbValue(65, [20, 70], 0, 0, 100, 5, 2)).toBe(60);
    expect(clampThumbValue(25, [20, 70], 1, 0, 100, 5, 2)).toBe(30);
  });

  it('breaks ties in the direction of movement when thumbs overlap', () => {
    expect(findNearestThumbIndex([50, 50], 70)).toBe(1);
    expect(findNearestThumbIndex([50, 50], 30)).toBe(0);
  });
});
