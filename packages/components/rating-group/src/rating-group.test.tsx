import { $, component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { Field } from '@leve-ui/field';
import { describe, expect, it } from 'vitest';
import { RatingGroup } from './index';

function getItems(screen: HTMLElement): HTMLElement[] {
  return Array.from(screen.querySelectorAll('[data-leve-rating-group-item]'));
}

describe('RatingGroup', () => {
  it('renders Root, Item, and HiddenInput with expected roles, data attributes, and roving tabindex', async () => {
    const { screen, render } = await createDOM();
    await render(
      <RatingGroup.Root aria-label="Product rating" defaultValue={3}>
        {[1, 2, 3, 4, 5].map((index) => (
          <RatingGroup.Item key={index} index={index}>
            ★
          </RatingGroup.Item>
        ))}
        <RatingGroup.HiddenInput name="rating" />
      </RatingGroup.Root>,
    );

    const root = screen.querySelector('[data-leve-rating-group]');
    const items = getItems(screen);
    const hiddenInput = screen.querySelector<HTMLInputElement>(
      '[data-leve-rating-group-hidden-input]',
    );

    expect(root).not.toBeNull();
    expect(root?.tagName).toBe('DIV');
    expect(root?.getAttribute('role')).toBe('radiogroup');
    expect(root?.getAttribute('aria-label')).toBe('Product rating');

    expect(items).toHaveLength(5);
    expect(items[0]?.tagName).toBe('SPAN');
    expect(items[0]?.getAttribute('role')).toBe('radio');
    expect(items[0]?.getAttribute('aria-label')).toBe('1 star');
    expect(items[0]?.getAttribute('aria-checked')).toBe('false');
    expect(items[0]?.getAttribute('data-state')).toBe('checked');
    expect(items[0]?.hasAttribute('data-checked')).toBe(false);
    expect(items[0]?.hasAttribute('data-highlighted')).toBe(true);
    expect(items[0]?.getAttribute('tabindex')).toBe('-1');

    expect(items[2]?.getAttribute('aria-label')).toBe('3 stars');
    expect(items[2]?.getAttribute('aria-checked')).toBe('true');
    expect(items[2]?.getAttribute('data-state')).toBe('checked');
    expect(items[2]?.hasAttribute('data-checked')).toBe(true);
    expect(items[2]?.getAttribute('tabindex')).toBe('0');

    expect(items[3]?.getAttribute('aria-checked')).toBe('false');
    expect(items[3]?.getAttribute('data-state')).toBe('unchecked');
    expect(items[3]?.hasAttribute('data-highlighted')).toBe(false);
    expect(items[3]?.getAttribute('tabindex')).toBe('-1');

    expect(hiddenInput).not.toBeNull();
    expect(hiddenInput?.tagName).toBe('INPUT');
    expect(hiddenInput?.getAttribute('type')).toBe('text');
    expect(hiddenInput?.getAttribute('aria-hidden')).toBe('true');
    expect(hiddenInput?.getAttribute('tabindex')).toBe('-1');
    expect(hiddenInput?.value).toBe('3');
    expect(hiddenInput?.getAttribute('data-state')).toBe('checked');
  });

  it('sets tabIndex 0 on item 1 when value is 0 and leaves HiddenInput value empty', async () => {
    const { screen, render } = await createDOM();
    await render(
      <RatingGroup.Root aria-label="Rating">
        {[1, 2, 3].map((index) => (
          <RatingGroup.Item key={index} index={index}>
            ★
          </RatingGroup.Item>
        ))}
        <RatingGroup.HiddenInput name="rating" />
      </RatingGroup.Root>,
    );

    const items = getItems(screen);
    expect(items[0]?.getAttribute('tabindex')).toBe('0');
    expect(items[1]?.getAttribute('tabindex')).toBe('-1');
    expect(items[2]?.getAttribute('tabindex')).toBe('-1');

    const hiddenInput = screen.querySelector<HTMLInputElement>(
      '[data-leve-rating-group-hidden-input]',
    );
    expect(hiddenInput?.value).toBe('');
    expect(hiddenInput?.getAttribute('data-state')).toBe('unchecked');
  });

  it('selects on click and supports allowClear', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <RatingGroup.Root aria-label="Rating" allowClear>
        {[1, 2, 3, 4, 5].map((index) => (
          <RatingGroup.Item key={index} index={index}>
            ★
          </RatingGroup.Item>
        ))}
        <RatingGroup.HiddenInput name="rating" />
      </RatingGroup.Root>,
    );

    await userEvent('[data-leve-rating-group-item]:nth-child(4)', 'click');
    let items = getItems(screen);
    expect(items[3]?.getAttribute('aria-checked')).toBe('true');
    expect(items[3]?.getAttribute('tabindex')).toBe('0');
    expect(
      screen.querySelector<HTMLInputElement>('[data-leve-rating-group-hidden-input]')?.value,
    ).toBe('4');

    // Clicking the already-selected item clears back to 0
    await userEvent('[data-leve-rating-group-item]:nth-child(4)', 'click');
    items = getItems(screen);
    expect(items[3]?.getAttribute('aria-checked')).toBe('false');
    expect(items[0]?.getAttribute('tabindex')).toBe('0');
    expect(
      screen.querySelector<HTMLInputElement>('[data-leve-rating-group-hidden-input]')?.value,
    ).toBe('');
  });

  it('updates hover preview without changing aria-checked', async () => {
    const hoveredValues: Array<number | null> = [];
    const { screen, render, userEvent } = await createDOM();
    await render(
      <RatingGroup.Root
        aria-label="Rating"
        defaultValue={2}
        onHoverChange$={$((val: number | null) => {
          hoveredValues.push(val);
        })}
      >
        {[1, 2, 3, 4, 5].map((index) => (
          <RatingGroup.Item key={index} index={index}>
            ★
          </RatingGroup.Item>
        ))}
      </RatingGroup.Root>,
    );

    await userEvent('[data-leve-rating-group-item]:nth-child(4)', 'pointermove');
    const items = getItems(screen);
    // Visual state reflects hover (4)
    expect(items[3]?.getAttribute('data-state')).toBe('checked');
    expect(items[3]?.hasAttribute('data-highlighted')).toBe(true);
    // aria-checked MUST still reflect committed value (2)
    expect(items[1]?.getAttribute('aria-checked')).toBe('true');
    expect(items[3]?.getAttribute('aria-checked')).toBe('false');
    expect(hoveredValues).toEqual([4]);

    await userEvent('[data-leve-rating-group]', 'pointerleave');
    expect(getItems(screen)[3]?.getAttribute('data-state')).toBe('unchecked');
    expect(hoveredValues).toEqual([4, null]);
  });

  it('supports controlled bind:value and onValueChange$', async () => {
    const ControlledHost = component$(() => {
      const rating = useSignal(2);
      const lastChanged = useSignal(0);

      return (
        <div>
          <RatingGroup.Root
            aria-label="Controlled rating"
            bind:value={rating}
            onValueChange$={$((v: number) => {
              lastChanged.value = v;
            })}
          >
            {[1, 2, 3, 4, 5].map((index) => (
              <RatingGroup.Item key={index} index={index}>
                ★
              </RatingGroup.Item>
            ))}
          </RatingGroup.Root>
          <button
            type="button"
            data-testid="set-five"
            onClick$={() => {
              rating.value = 5;
            }}
          >
            Set 5
          </button>
          <span data-testid="output">
            {rating.value}:{lastChanged.value}
          </span>
        </div>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<ControlledHost />);

    await userEvent('[data-leve-rating-group-item]:nth-child(3)', 'click');
    expect(screen.querySelector('[data-testid="output"]')?.textContent).toBe('3:3');
    expect(getItems(screen)[2]?.getAttribute('aria-checked')).toBe('true');

    await userEvent('[data-testid="set-five"]', 'click');
    expect(getItems(screen)[4]?.getAttribute('aria-checked')).toBe('true');
  });

  it('supports allowHalf with half state, roving tabIndex, and half aria-label', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <RatingGroup.Root aria-label="Half rating" allowHalf defaultValue={2.5}>
        {[1, 2, 3, 4, 5].map((index) => (
          <RatingGroup.Item key={index} index={index}>
            ★
          </RatingGroup.Item>
        ))}
      </RatingGroup.Root>,
    );

    const items = getItems(screen);
    expect(items[1]?.getAttribute('data-state')).toBe('checked');
    expect(items[2]?.getAttribute('data-state')).toBe('half');
    expect(items[2]?.getAttribute('aria-checked')).toBe('true');
    expect(items[2]?.getAttribute('aria-label')).toBe('2.5 stars');
    expect(items[2]?.getAttribute('tabindex')).toBe('0');
    expect(items[3]?.getAttribute('data-state')).toBe('unchecked');

    // ArrowRight increases by 0.5 -> 3
    await userEvent(items[2], 'keydown', { key: 'ArrowRight' });
    expect(getItems(screen)[2]?.getAttribute('data-state')).toBe('checked');
    expect(getItems(screen)[2]?.getAttribute('aria-label')).toBe('3 stars');

    // ArrowDown decreases by 0.5 -> 2.5
    await userEvent(getItems(screen)[2], 'keydown', { key: 'ArrowDown' });
    expect(getItems(screen)[2]?.getAttribute('data-state')).toBe('half');
  });

  it('handles ArrowUp/ArrowRight (+), ArrowDown/ArrowLeft (-), Home, End, Space, and RTL', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <div dir="rtl">
        <RatingGroup.Root aria-label="RTL rating" defaultValue={2}>
          {[1, 2, 3, 4, 5].map((index) => (
            <RatingGroup.Item key={index} index={index}>
              ★
            </RatingGroup.Item>
          ))}
        </RatingGroup.Root>
      </div>,
    );

    // In RTL, ArrowLeft increases (+1 -> 3), ArrowUp increases (+1 -> 4)
    await userEvent('[data-leve-rating-group-item]:nth-child(2)', 'keydown', { key: 'ArrowLeft' });
    expect(getItems(screen)[2]?.getAttribute('aria-checked')).toBe('true');

    await userEvent('[data-leve-rating-group-item]:nth-child(3)', 'keydown', { key: 'ArrowUp' });
    expect(getItems(screen)[3]?.getAttribute('aria-checked')).toBe('true');

    // In RTL, ArrowRight decreases (-1 -> 3)
    await userEvent('[data-leve-rating-group-item]:nth-child(4)', 'keydown', { key: 'ArrowRight' });
    expect(getItems(screen)[2]?.getAttribute('aria-checked')).toBe('true');

    // End -> 5, Home -> 1
    await userEvent('[data-leve-rating-group-item]:nth-child(3)', 'keydown', { key: 'End' });
    expect(getItems(screen)[4]?.getAttribute('aria-checked')).toBe('true');

    await userEvent('[data-leve-rating-group-item]:nth-child(5)', 'keydown', { key: 'Home' });
    expect(getItems(screen)[0]?.getAttribute('aria-checked')).toBe('true');

    // Space on item 4 selects 4
    await userEvent('[data-leve-rating-group-item]:nth-child(4)', 'keydown', { key: ' ' });
    expect(getItems(screen)[3]?.getAttribute('aria-checked')).toBe('true');
  });

  it('handles disabled and readOnly states', async () => {
    const {
      screen: disabledScreen,
      render: renderDisabled,
      userEvent: userDisabled,
    } = await createDOM();
    await renderDisabled(
      <RatingGroup.Root aria-label="Disabled" defaultValue={2} disabled>
        {[1, 2, 3].map((index) => (
          <RatingGroup.Item key={index} index={index}>
            ★
          </RatingGroup.Item>
        ))}
        <RatingGroup.HiddenInput name="rating" />
      </RatingGroup.Root>,
    );

    const dRoot = disabledScreen.querySelector('[data-leve-rating-group]');
    const dItems = getItems(disabledScreen);
    expect(dRoot?.getAttribute('aria-disabled')).toBe('true');
    expect(dRoot?.hasAttribute('data-disabled')).toBe(true);
    expect(dItems[0]?.getAttribute('aria-disabled')).toBe('true');
    expect(dItems[1]?.getAttribute('tabindex')).toBe('-1');

    await userDisabled(dItems[2], 'click');
    expect(getItems(disabledScreen)[1]?.getAttribute('aria-checked')).toBe('true');

    const { screen: roScreen, render: renderRo, userEvent: userRo } = await createDOM();
    await renderRo(
      <RatingGroup.Root aria-label="ReadOnly" defaultValue={2} readOnly>
        {[1, 2, 3].map((index) => (
          <RatingGroup.Item key={index} index={index}>
            ★
          </RatingGroup.Item>
        ))}
      </RatingGroup.Root>,
    );

    const roRoot = roScreen.querySelector('[data-leve-rating-group]');
    const roItems = getItems(roScreen);
    expect(roRoot?.getAttribute('aria-readonly')).toBe('true');
    expect(roRoot?.hasAttribute('data-readonly')).toBe(true);
    // readOnly keeps items focusable via roving tabindex
    expect(roItems[1]?.getAttribute('tabindex')).toBe('0');

    await userRo(roItems[2], 'click');
    await userRo(roItems[1], 'keydown', { key: 'ArrowRight' });
    expect(getItems(roScreen)[1]?.getAttribute('aria-checked')).toBe('true');
  });

  it('integrates with Field (aria-labelledby, aria-describedby, invalid, required, disabled, readOnly)', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Field.Root hasDescription invalid required readOnly>
        <Field.Label>Service rating</Field.Label>
        <RatingGroup.Root>
          {[1, 2, 3].map((index) => (
            <RatingGroup.Item key={index} index={index}>
              ★
            </RatingGroup.Item>
          ))}
        </RatingGroup.Root>
        <Field.Description>Rate from 1 to 3 stars.</Field.Description>
        <Field.ErrorMessage>Rating is required.</Field.ErrorMessage>
      </Field.Root>,
    );

    const root = screen.querySelector('[data-leve-rating-group]');
    const label = screen.querySelector('[data-leve-field-label]');
    const desc = screen.querySelector('[data-leve-field-description]');
    const err = screen.querySelector('[data-leve-field-error-message]');

    expect(root?.getAttribute('aria-labelledby')).toBe(label?.id);
    expect(root?.getAttribute('aria-describedby')).toBe(`${desc?.id} ${err?.id}`);
    expect(root?.getAttribute('aria-invalid')).toBe('true');
    expect(root?.getAttribute('aria-required')).toBe('true');
    expect(root?.getAttribute('aria-readonly')).toBe('true');
    expect(root?.hasAttribute('data-invalid')).toBe(true);
    expect(root?.hasAttribute('data-readonly')).toBe(true);
  });

  it('resets to defaultValue when parent form is reset', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <form>
        <RatingGroup.Root aria-label="Rating" defaultValue={2}>
          {[1, 2, 3, 4, 5].map((index) => (
            <RatingGroup.Item key={index} index={index}>
              ★
            </RatingGroup.Item>
          ))}
          <RatingGroup.HiddenInput name="rating" />
        </RatingGroup.Root>
      </form>,
    );

    await userEvent('[data-leve-rating-group-item]:nth-child(5)', 'click');
    const hiddenInput = screen.querySelector<HTMLInputElement>(
      '[data-leve-rating-group-hidden-input]',
    );
    expect(hiddenInput?.value).toBe('5');

    const form = screen.querySelector('form') as HTMLFormElement;
    const resetEvent = form.ownerDocument.createEvent('Event');
    resetEvent.initEvent('reset', true, true);
    form.dispatchEvent(resetEvent);
    await new Promise((r) => setTimeout(r, 25));
    await userEvent(screen, 'noop');

    expect(hiddenInput?.value).toBe('2');
    expect(getItems(screen)[1]?.getAttribute('aria-checked')).toBe('true');
  });

  it('forwards custom props and merges event handlers', async () => {
    const Host = component$(() => {
      const customClicked = useSignal(false);
      return (
        <div>
          <RatingGroup.Root aria-label="Custom" class="my-root" data-custom="yes">
            <RatingGroup.Item
              index={1}
              aria-label="Terrible"
              class="my-item"
              onClick$={$(() => {
                customClicked.value = true;
              })}
            >
              ★
            </RatingGroup.Item>
          </RatingGroup.Root>
          <span data-testid="clicked">{String(customClicked.value)}</span>
        </div>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Host />);

    const root = screen.querySelector('[data-leve-rating-group]');
    const item = screen.querySelector('[data-leve-rating-group-item]');
    expect(root?.classList.contains('my-root')).toBe(true);
    expect(root?.getAttribute('data-custom')).toBe('yes');
    expect(item?.classList.contains('my-item')).toBe(true);
    expect(item?.getAttribute('aria-label')).toBe('Terrible');

    await userEvent('[data-leve-rating-group-item]', 'click');
    expect(screen.querySelector('[data-testid="clicked"]')?.textContent).toBe('true');
    expect(item?.getAttribute('aria-checked')).toBe('true');
  });
});
