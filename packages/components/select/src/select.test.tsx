import { component$, Slot, useComputed$, useContextProvider, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { fieldsetContextId, useFieldProvider } from '@leve-ui/utils';
import { describe, expect, it } from 'vitest';
import { Select } from './index';

const MockFieldset = component$<{ disabled?: boolean }>((props) => {
  const disabled = useComputed$(() => Boolean(props.disabled));
  const parentDisabled = useComputed$(() => false);
  useContextProvider(fieldsetContextId, { disabled, parentDisabled });
  return (
    <fieldset>
      <Slot />
    </fieldset>
  );
});

const MockField = component$<{
  ids?: { control?: string; label?: string; description?: string; errorMessage?: string };
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  hasDescription?: boolean;
}>((props) => {
  const invalid = useComputed$(() => Boolean(props.invalid));
  const disabled = useComputed$(() => Boolean(props.disabled));
  const required = useComputed$(() => Boolean(props.required));
  const hasDescription = useComputed$(() => Boolean(props.hasDescription));
  const context = useFieldProvider({
    ids: props.ids,
    invalid,
    disabled,
    required,
    hasDescription,
  });
  return (
    <div data-field-ids={JSON.stringify(context.ids)}>
      <label id={context.ids.label} for={context.ids.control} data-test-field-label="">
        Country
      </label>
      <Slot />
      <p id={context.ids.description} data-test-field-description="">
        Used for shipping.
      </p>
      <p id={context.ids.errorMessage} data-test-field-error="">
        Country is required.
      </p>
    </div>
  );
});

function query(screen: HTMLElement, part: string) {
  return screen.querySelector<HTMLElement>(
    part ? `[data-leve-select-${part}]` : '[data-leve-select]',
  );
}

function items(screen: HTMLElement) {
  return Array.from(screen.querySelectorAll<HTMLElement>('[data-leve-select-item]'));
}

const Fruits = component$<{
  defaultValue?: string | null;
  defaultOpen?: boolean;
  disabled?: boolean;
  required?: boolean;
  loop?: boolean;
}>((props) => (
  <Select.Root
    defaultValue={props.defaultValue}
    defaultOpen={props.defaultOpen}
    disabled={props.disabled}
    required={props.required}
    loop={props.loop}
  >
    <Select.Label>Fruit</Select.Label>
    <Select.Trigger class="trigger">
      <Select.Value placeholder="Select a fruit" />
    </Select.Trigger>
    <Select.HiddenInput name="fruit" />
    <Select.Content>
      <Select.List>
        <Select.Group>
          <Select.GroupLabel>Popular</Select.GroupLabel>
          <Select.Item value="apple">
            <Select.ItemText>Apple</Select.ItemText>
            <Select.ItemIndicator>✓</Select.ItemIndicator>
          </Select.Item>
        </Select.Group>
        <Select.Item value="blue berry" disabled>
          <Select.ItemText>Blueberry</Select.ItemText>
        </Select.Item>
        <Select.Item value="cherry" textValue="Cherry">
          🍒 Cherry
        </Select.Item>
      </Select.List>
    </Select.Content>
  </Select.Root>
));

describe('Select', () => {
  it('renders all parts with expected elements, roles, and data attributes', async () => {
    const { screen, render } = await createDOM();
    await render(<Fruits />);

    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
    expect(query(screen, 'label')?.tagName).toBe('LABEL');
    expect(query(screen, 'trigger')?.tagName).toBe('BUTTON');
    expect(query(screen, 'trigger')?.getAttribute('type')).toBe('button');
    expect(query(screen, 'trigger')?.getAttribute('role')).toBe('combobox');
    expect(query(screen, 'value')?.tagName).toBe('SPAN');
    expect(query(screen, 'content')?.getAttribute('popover')).toBe('manual');
    expect(query(screen, 'content')?.getAttribute('data-state')).toBe('closed');
    expect(query(screen, 'list')?.getAttribute('role')).toBe('listbox');
    expect(items(screen).map((item) => item.getAttribute('role'))).toEqual([
      'option',
      'option',
      'option',
    ]);
    expect(query(screen, 'item-text')?.tagName).toBe('SPAN');
    expect(query(screen, 'item-indicator')?.tagName).toBe('SPAN');
    expect(query(screen, 'item-indicator')?.getAttribute('aria-hidden')).toBe('true');
    expect(query(screen, 'group')?.getAttribute('role')).toBe('group');
    expect(query(screen, 'group-label')?.textContent).toBe('Popular');
    expect(query(screen, 'hidden-input')?.tagName).toBe('INPUT');
    expect(query(screen, 'hidden-input')?.getAttribute('type')).toBe('text');
    expect(query(screen, 'hidden-input')?.getAttribute('aria-hidden')).toBe('true');
    expect(query(screen, 'hidden-input')?.getAttribute('tabindex')).toBe('-1');
    expect(query(screen, 'hidden-input')?.getAttribute('name')).toBe('fruit');
  });

  it('wires ARIA relationships across Label, Trigger, List, and Group', async () => {
    const { screen, render } = await createDOM();
    await render(<Fruits />);

    const trigger = query(screen, 'trigger');
    const label = query(screen, 'label');
    const list = query(screen, 'list');
    const valueEl = query(screen, 'value');

    expect(label?.getAttribute('for')).toBe(trigger?.id);
    expect(trigger?.getAttribute('aria-haspopup')).toBe('listbox');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(trigger?.getAttribute('aria-controls')).toBe(list?.id);
    expect(trigger?.getAttribute('aria-labelledby')).toBe(label?.id);
    expect(trigger?.hasAttribute('aria-activedescendant')).toBe(false);
    expect(trigger?.hasAttribute('data-placeholder')).toBe(true);
    expect(valueEl?.hasAttribute('data-placeholder')).toBe(true);
    expect(valueEl?.textContent).toBe('Select a fruit');
    expect(list?.getAttribute('aria-labelledby')).toBe(label?.id);
    expect(query(screen, 'group')?.getAttribute('aria-labelledby')).toBe(
      query(screen, 'group-label')?.id,
    );
    expect(trigger?.getAttribute('class')).toBe('trigger');
  });

  it('respects aria-label, custom aria-labelledby, and Root ids overrides', async () => {
    const { screen, render } = await createDOM();
    await render(
      <>
        <Select.Root ids={{ label: 'lbl', trigger: 'trg', list: 'lst' }} class="custom-ids">
          <Select.Label>Choose</Select.Label>
          <Select.Trigger>
            <Select.Value placeholder="Pick" />
          </Select.Trigger>
          <Select.Content>
            <Select.List>
              <Select.Item value="a">A</Select.Item>
            </Select.List>
          </Select.Content>
        </Select.Root>
        <Select.Root class="aria-label-only">
          <Select.Trigger aria-label="Direct label">
            <Select.Value placeholder="Pick" />
          </Select.Trigger>
          <Select.Content>
            <Select.List aria-label="Options">
              <Select.Item value="b">B</Select.Item>
            </Select.List>
          </Select.Content>
        </Select.Root>
      </>,
    );

    const customIds = screen.querySelector('.custom-ids');
    expect(customIds?.querySelector('[data-leve-select-label]')?.id).toBe('lbl');
    expect(customIds?.querySelector('[data-leve-select-trigger]')?.id).toBe('trg');
    expect(customIds?.querySelector('[data-leve-select-label]')?.getAttribute('for')).toBe('trg');
    expect(customIds?.querySelector('[data-leve-select-list]')?.id).toBe('lst');

    const ariaLabelOnly = screen.querySelector('.aria-label-only');
    const trigger = ariaLabelOnly?.querySelector('[data-leve-select-trigger]');
    const list = ariaLabelOnly?.querySelector('[data-leve-select-list]');
    expect(trigger?.getAttribute('aria-label')).toBe('Direct label');
    expect(trigger?.hasAttribute('aria-labelledby')).toBe(false);
    expect(list?.getAttribute('aria-label')).toBe('Options');
    expect(list?.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('assigns unique item IDs and outputs disabled and textValue attributes', async () => {
    const { screen, render } = await createDOM();
    await render(<Fruits />);

    const [apple, blueberry, cherry] = items(screen);
    const listId = query(screen, 'list')?.id;
    expect(apple.id).toBe(`${listId}-item-apple`);
    expect(blueberry.id).toBe(`${listId}-item-blue_20_berry`);
    expect(blueberry.getAttribute('aria-disabled')).toBe('true');
    expect(blueberry.hasAttribute('data-disabled')).toBe(true);
    expect(cherry.getAttribute('data-text-value')).toBe('Cherry');
    expect(apple.getAttribute('aria-selected')).toBe('false');
    expect(apple.getAttribute('data-state')).toBe('unchecked');
    expect(query(screen, 'item-indicator')?.hasAttribute('hidden')).toBe(true);
    expect(query(screen, 'item-indicator')?.getAttribute('data-state')).toBe('unchecked');
  });

  it('syncs initial selected text and HiddenInput value from defaultValue', async () => {
    const { screen, render } = await createDOM();
    await render(<Fruits defaultValue="apple" />);

    const [apple] = items(screen);
    expect(apple.getAttribute('aria-selected')).toBe('true');
    expect(apple.getAttribute('data-state')).toBe('checked');
    expect(query(screen, 'item-indicator')?.hasAttribute('hidden')).toBe(false);
    expect(query(screen, 'item-indicator')?.getAttribute('data-state')).toBe('checked');
    expect(query(screen, 'value')?.textContent).toBe('Apple');
    expect(query(screen, 'value')?.hasAttribute('data-placeholder')).toBe(false);
    expect(query(screen, 'trigger')?.hasAttribute('data-placeholder')).toBe(false);
    expect((query(screen, 'hidden-input') as HTMLInputElement).value).toBe('apple');
  });

  it('opens and closes when clicking Trigger, highlighting selected or first enabled item', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<Fruits />);

    const trigger = query(screen, 'trigger');
    const [apple] = items(screen);

    await userEvent('[data-leve-select-trigger]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('open');
    expect(query(screen, 'content')?.getAttribute('data-state')).toBe('open');
    expect(trigger?.getAttribute('data-state')).toBe('open');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(trigger?.getAttribute('aria-activedescendant')).toBe(apple.id);
    expect(apple.hasAttribute('data-highlighted')).toBe(true);

    await userEvent('[data-leve-select-trigger]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(trigger?.hasAttribute('aria-activedescendant')).toBe(false);
  });

  it('highlights the selected item when reopened', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<Fruits defaultValue="cherry" />);

    await userEvent('[data-leve-select-trigger]', 'click');
    const [, , cherry] = items(screen);
    expect(query(screen, 'trigger')?.getAttribute('aria-activedescendant')).toBe(cherry.id);
    expect(cherry.hasAttribute('data-highlighted')).toBe(true);
  });

  it('selects an enabled item on click, updates Value and HiddenInput, and ignores disabled items', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<Fruits />);

    await userEvent('[data-leve-select-trigger]', 'click');
    await userEvent('[data-value="blue berry"]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('open');
    expect((query(screen, 'hidden-input') as HTMLInputElement).value).toBe('');
    expect(query(screen, 'value')?.textContent).toBe('Select a fruit');

    await userEvent('[data-value="cherry"]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
    expect(query(screen, 'value')?.textContent).toBe('Cherry');
    expect(query(screen, 'value')?.hasAttribute('data-placeholder')).toBe(false);
    expect(query(screen, 'trigger')?.hasAttribute('data-placeholder')).toBe(false);
    expect((query(screen, 'hidden-input') as HTMLInputElement).value).toBe('cherry');
    expect(items(screen)[2].getAttribute('aria-selected')).toBe('true');
    expect(items(screen)[2].getAttribute('data-state')).toBe('checked');
  });

  it('supports controlled bind:value, bind:open, onValueChange$, and onOpenChange$', async () => {
    const Controlled = component$(() => {
      const value = useSignal<string | null>('apple');
      const open = useSignal(false);
      const valueChanges = useSignal<(string | null)[]>([]);
      const openChanges = useSignal<boolean[]>([]);
      return (
        <>
          <Select.Root
            bind:value={value}
            bind:open={open}
            onValueChange$={(next) => {
              valueChanges.value = [...valueChanges.value, next];
            }}
            onOpenChange$={(next) => {
              openChanges.value = [...openChanges.value, next];
            }}
          >
            <Select.Trigger>
              <Select.Value placeholder="Choose" />
            </Select.Trigger>
            <Select.Content>
              <Select.List>
                <Select.Item value="apple">
                  <Select.ItemText>Apple</Select.ItemText>
                </Select.Item>
                <Select.Item value="cherry">
                  <Select.ItemText>Cherry</Select.ItemText>
                </Select.Item>
              </Select.List>
            </Select.Content>
          </Select.Root>
          <output class="state">{`${value.value ?? 'null'}:${String(open.value)}`}</output>
          <output class="value-log">{JSON.stringify(valueChanges.value)}</output>
          <output class="open-log">{JSON.stringify(openChanges.value)}</output>
          <button
            type="button"
            class="set-cherry"
            onClick$={() => {
              value.value = 'cherry';
            }}
          >
            set cherry
          </button>
          <button
            type="button"
            class="clear-value"
            onClick$={() => {
              value.value = null;
            }}
          >
            clear
          </button>
        </>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Controlled />);

    expect(query(screen, 'value')?.textContent).toBe('Apple');
    expect(items(screen)[0].getAttribute('aria-selected')).toBe('true');

    await userEvent('.set-cherry', 'click');
    await new Promise((resolve) => setTimeout(resolve, 0));
    await userEvent(screen, 'noop');
    expect(screen.querySelector('output.state')?.textContent).toBe('cherry:false');
    expect(items(screen)[1].getAttribute('aria-selected')).toBe('true');
    expect(query(screen, 'value')?.textContent).toBe('Cherry');
    expect(screen.querySelector('output.value-log')?.textContent).toBe('[]');

    await userEvent('[data-leve-select-trigger]', 'click');
    expect(screen.querySelector('output.open-log')?.textContent).toBe('[true]');
    expect(screen.querySelector('output.state')?.textContent).toBe('cherry:true');

    await userEvent('[data-value="apple"]', 'click');
    expect(screen.querySelector('output.value-log')?.textContent).toBe('["apple"]');
    expect(screen.querySelector('output.open-log')?.textContent).toBe('[true,false]');
    expect(screen.querySelector('output.state')?.textContent).toBe('apple:false');
    expect(query(screen, 'value')?.textContent).toBe('Apple');

    await userEvent('.clear-value', 'click');
    await new Promise((resolve) => setTimeout(resolve, 0));
    await userEvent(screen, 'noop');
    expect(query(screen, 'value')?.textContent).toBe('Choose');
    expect(query(screen, 'value')?.hasAttribute('data-placeholder')).toBe(true);
  });

  it('supports disabled and required states on Root', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<Fruits disabled required />);

    expect(query(screen, '')?.hasAttribute('data-disabled')).toBe(true);
    expect(query(screen, 'label')?.hasAttribute('data-disabled')).toBe(true);
    expect(query(screen, 'trigger')?.hasAttribute('disabled')).toBe(true);
    expect(query(screen, 'trigger')?.hasAttribute('data-disabled')).toBe(true);
    expect(query(screen, 'trigger')?.getAttribute('aria-required')).toBe('true');
    expect(query(screen, 'hidden-input')?.hasAttribute('disabled')).toBe(true);
    expect(query(screen, 'hidden-input')?.hasAttribute('required')).toBe(true);

    await userEvent('[data-leve-select-trigger]', 'click');
    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
  });

  it('integrates with Field and Fieldset context', async () => {
    const { screen, render } = await createDOM();
    await render(
      <MockFieldset disabled>
        <MockField hasDescription invalid required ids={{ control: 'country-ctrl' }}>
          <Select.Root>
            <Select.Trigger>
              <Select.Value placeholder="Choose a country" />
            </Select.Trigger>
            <Select.HiddenInput name="country" />
            <Select.Content>
              <Select.List>
                <Select.Item value="jp">Japan</Select.Item>
              </Select.List>
            </Select.Content>
          </Select.Root>
        </MockField>
      </MockFieldset>,
    );

    const label = screen.querySelector('[data-test-field-label]');
    const trigger = query(screen, 'trigger');
    const description = screen.querySelector('[data-test-field-description]');
    const error = screen.querySelector('[data-test-field-error]');
    const hidden = query(screen, 'hidden-input');

    expect(trigger?.id).toBe('country-ctrl');
    expect(label?.getAttribute('for')).toBe('country-ctrl');
    expect(trigger?.getAttribute('aria-labelledby')).toBe(label?.id);
    expect(trigger?.getAttribute('aria-describedby')).toBe(`${description?.id} ${error?.id}`);
    expect(trigger?.getAttribute('aria-invalid')).toBe('true');
    expect(trigger?.hasAttribute('data-invalid')).toBe(true);
    expect(trigger?.getAttribute('aria-required')).toBe('true');
    expect(trigger?.hasAttribute('disabled')).toBe(true);
    expect(trigger?.hasAttribute('data-disabled')).toBe(true);
    expect(hidden?.hasAttribute('disabled')).toBe(true);
    expect(hidden?.hasAttribute('required')).toBe(true);
  });

  it('supports keyboard navigation, selection, Escape, and typeahead on Trigger', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<Fruits />);

    const [apple, , cherry] = items(screen);
    const trigger = query(screen, 'trigger');

    // Closed ArrowDown opens and highlights first enabled item
    await userEvent('[data-leve-select-trigger]', 'keydown', { key: 'ArrowDown' });
    expect(query(screen, '')?.getAttribute('data-state')).toBe('open');
    expect(trigger?.getAttribute('aria-activedescendant')).toBe(apple.id);

    // Open ArrowDown skips disabled item (Blueberry) to Cherry
    await userEvent('[data-leve-select-trigger]', 'keydown', { key: 'ArrowDown' });
    expect(trigger?.getAttribute('aria-activedescendant')).toBe(cherry.id);

    // Escape closes without selecting
    await userEvent('[data-leve-select-trigger]', 'keydown', { key: 'Escape' });
    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
    expect((query(screen, 'hidden-input') as HTMLInputElement).value).toBe('');
    expect(query(screen, 'value')?.textContent).toBe('Select a fruit');

    // Closed typeahead opens and highlights matching item
    await userEvent('[data-leve-select-trigger]', 'keydown', { key: 'c' });
    expect(query(screen, '')?.getAttribute('data-state')).toBe('open');
    expect(trigger?.getAttribute('aria-activedescendant')).toBe(cherry.id);

    // Enter selects highlighted item and closes
    await userEvent('[data-leve-select-trigger]', 'keydown', { key: 'Enter' });
    expect(query(screen, '')?.getAttribute('data-state')).toBe('closed');
    expect((query(screen, 'hidden-input') as HTMLInputElement).value).toBe('cherry');
    expect(query(screen, 'value')?.textContent).toBe('Cherry');
  });

  it('resets uncontrolled value on form reset', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <form>
        <Fruits defaultValue="apple" />
      </form>,
    );

    expect((query(screen, 'hidden-input') as HTMLInputElement).value).toBe('apple');
    expect(query(screen, 'value')?.textContent).toBe('Apple');

    await userEvent('[data-leve-select-trigger]', 'click');
    await userEvent('[data-value="cherry"]', 'click');
    expect((query(screen, 'hidden-input') as HTMLInputElement).value).toBe('cherry');
    expect(query(screen, 'value')?.textContent).toBe('Cherry');

    const form = screen.querySelector('form') as HTMLFormElement;
    const resetEvent = form.ownerDocument.createEvent('Event');
    resetEvent.initEvent('reset', true, true);
    form.dispatchEvent(resetEvent);
    await new Promise((resolve) => setTimeout(resolve, 25));
    await userEvent(screen, 'noop');

    expect((query(screen, 'hidden-input') as HTMLInputElement).value).toBe('apple');
    expect(query(screen, 'value')?.textContent).toBe('Apple');
    expect(items(screen)[0].getAttribute('aria-selected')).toBe('true');
  });
});
