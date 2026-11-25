import { component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { Field } from './index';

describe('Field', () => {
  it('各パーツが正しい HTML 要素と data 属性で描画される', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Field.Root invalid>
        <Field.Label>Label</Field.Label>
        <Field.Input />
        <Field.Textarea />
        <Field.Description>Description</Field.Description>
        <Field.ErrorMessage>Error</Field.ErrorMessage>
      </Field.Root>,
    );

    const root = screen.querySelector('[data-leve-field]');
    const label = screen.querySelector('[data-leve-field-label]');
    const input = screen.querySelector('[data-leve-field-input]');
    const textarea = screen.querySelector('[data-leve-field-textarea]');
    const description = screen.querySelector('[data-leve-field-description]');
    const errorMessage = screen.querySelector('[data-leve-field-error-message]');

    expect(root?.tagName).toBe('DIV');
    expect(label?.tagName).toBe('LABEL');
    expect(input?.tagName).toBe('INPUT');
    expect(textarea?.tagName).toBe('TEXTAREA');
    expect(description?.tagName).toBe('DIV');
    expect(errorMessage?.tagName).toBe('DIV');

    expect(root?.hasAttribute('data-leve-field')).toBe(true);
    expect(label?.hasAttribute('data-leve-field-label')).toBe(true);
    expect(input?.hasAttribute('data-leve-field-input')).toBe(true);
    expect(textarea?.hasAttribute('data-leve-field-textarea')).toBe(true);
    expect(description?.hasAttribute('data-leve-field-description')).toBe(true);
    expect(errorMessage?.hasAttribute('data-leve-field-error-message')).toBe(true);
  });

  it('Label の for が Input の id と一致し、Label にも id が付く', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Field.Root>
        <Field.Label>Username</Field.Label>
        <Field.Input />
      </Field.Root>,
    );

    const label = screen.querySelector('label');
    const input = screen.querySelector('input');
    expect(label?.getAttribute('for')).toBeTruthy();
    expect(label?.getAttribute('id')).toBeTruthy();
    expect(input?.getAttribute('id')).toBeTruthy();
    expect(label?.getAttribute('for')).toBe(input?.getAttribute('id'));
  });

  it('hasDescription が無いときは aria-describedby を出力せず、あるときは Description の id と一致する', async () => {
    const { screen: screenWithout, render: renderWithout } = await createDOM();
    await renderWithout(
      <Field.Root>
        <Field.Input />
        <Field.Description>Help text</Field.Description>
      </Field.Root>,
    );
    const inputWithout = screenWithout.querySelector('input');
    expect(inputWithout?.hasAttribute('aria-describedby')).toBe(false);

    const { screen: screenWith, render: renderWith } = await createDOM();
    await renderWith(
      <Field.Root hasDescription>
        <Field.Input />
        <Field.Description>Help text</Field.Description>
      </Field.Root>,
    );
    const inputWith = screenWith.querySelector('input');
    const description = screenWith.querySelector('[data-leve-field-description]');
    expect(inputWith?.getAttribute('aria-describedby')).toBe(description?.getAttribute('id'));
  });

  it('invalid のときは ErrorMessage が描画され aria-invalid="true" となり、not invalid のときは描画されない', async () => {
    const { screen: screenValid, render: renderValid } = await createDOM();
    await renderValid(
      <Field.Root>
        <Field.Input />
        <Field.ErrorMessage>Error text</Field.ErrorMessage>
      </Field.Root>,
    );
    expect(screenValid.querySelector('[data-leve-field-error-message]')).toBeUndefined();
    const inputValid = screenValid.querySelector('input');
    expect(inputValid?.hasAttribute('aria-invalid')).toBe(false);

    const { screen: screenInvalid, render: renderInvalid } = await createDOM();
    await renderInvalid(
      <Field.Root invalid>
        <Field.Input />
        <Field.ErrorMessage>Error text</Field.ErrorMessage>
      </Field.Root>,
    );
    const errorMessage = screenInvalid.querySelector('[data-leve-field-error-message]');
    expect(errorMessage).not.toBeNull();
    const inputInvalid = screenInvalid.querySelector('input');
    expect(inputInvalid?.getAttribute('aria-invalid')).toBe('true');
    expect(inputInvalid?.getAttribute('aria-describedby')).toContain(
      errorMessage?.getAttribute('id'),
    );
  });

  it('ErrorMessage に role="alert" が付き、role を渡すと上書きできる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <>
        <Field.Root invalid>
          <Field.Input />
          <Field.ErrorMessage>Error</Field.ErrorMessage>
        </Field.Root>
        <Field.Root invalid>
          <Field.Input />
          <Field.ErrorMessage role="status">Status</Field.ErrorMessage>
        </Field.Root>
      </>,
    );

    const [alert, status] = screen.querySelectorAll('[data-leve-field-error-message]');
    expect(alert.getAttribute('role')).toBe('alert');
    expect(status.getAttribute('role')).toBe('status');
  });

  it('Field の外で Input / Textarea に invalid を渡すと aria-invalid と data-invalid が付き、invalid 属性は出力されない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <>
        <Field.Input invalid />
        <Field.Textarea invalid />
        <Field.Input />
      </>,
    );

    const [input, valid] = screen.querySelectorAll('[data-leve-field-input]');
    const textarea = screen.querySelector('[data-leve-field-textarea]');
    for (const element of [input, textarea]) {
      expect(element?.getAttribute('aria-invalid')).toBe('true');
      expect(element?.hasAttribute('data-invalid')).toBe(true);
      expect(element?.hasAttribute('invalid')).toBe(false);
    }
    expect(valid.hasAttribute('aria-invalid')).toBe(false);
  });

  it('disabled と required が Input/Textarea のネイティブ属性となり、各パーツに data 属性が出力される', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Field.Root disabled required invalid>
        <Field.Label>Label</Field.Label>
        <Field.Input />
        <Field.Textarea />
        <Field.Description>Desc</Field.Description>
        <Field.ErrorMessage>Error</Field.ErrorMessage>
      </Field.Root>,
    );

    const root = screen.querySelector('[data-leve-field]');
    const label = screen.querySelector('[data-leve-field-label]');
    const input = screen.querySelector('[data-leve-field-input]');
    const textarea = screen.querySelector('[data-leve-field-textarea]');
    const description = screen.querySelector('[data-leve-field-description]');
    const errorMessage = screen.querySelector('[data-leve-field-error-message]');

    expect(input?.hasAttribute('disabled')).toBe(true);
    expect(input?.hasAttribute('required')).toBe(true);
    expect(textarea?.hasAttribute('disabled')).toBe(true);
    expect(textarea?.hasAttribute('required')).toBe(true);

    for (const el of [root, label, input, textarea, description, errorMessage]) {
      expect(el?.getAttribute('data-disabled')).toBe('');
      expect(el?.getAttribute('data-required')).toBe('');
      expect(el?.getAttribute('data-invalid')).toBe('');
    }
  });

  it('Root の ids で各パーツの ID を上書きできる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Field.Root
        invalid
        hasDescription
        ids={{
          control: 'custom-control',
          label: 'custom-label',
          description: 'custom-description',
          errorMessage: 'custom-error',
        }}
      >
        <Field.Label>Label</Field.Label>
        <Field.Input />
        <Field.Description>Desc</Field.Description>
        <Field.ErrorMessage>Error</Field.ErrorMessage>
      </Field.Root>,
    );

    const label = screen.querySelector('[data-leve-field-label]');
    const input = screen.querySelector('[data-leve-field-input]');
    const description = screen.querySelector('[data-leve-field-description]');
    const errorMessage = screen.querySelector('[data-leve-field-error-message]');

    expect(label?.getAttribute('id')).toBe('custom-label');
    expect(label?.getAttribute('for')).toBe('custom-control');
    expect(input?.getAttribute('id')).toBe('custom-control');
    expect(description?.getAttribute('id')).toBe('custom-description');
    expect(errorMessage?.getAttribute('id')).toBe('custom-error');
    expect(input?.getAttribute('aria-describedby')).toBe('custom-description custom-error');
  });

  it('Input に利用者が指定した aria-describedby が維持され Description の id と結合される', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Field.Root hasDescription ids={{ description: 'desc-id' }}>
        <Field.Input aria-describedby="external-help" />
        <Field.Description>Help</Field.Description>
      </Field.Root>,
    );

    const input = screen.querySelector('input');
    expect(input?.getAttribute('aria-describedby')).toBe('external-help desc-id');
  });

  it('任意の props や class が要素に渡り、Root の独自 props は DOM 属性に出力されない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Field.Root
        class="custom-field"
        data-testid="field-root"
        hasDescription
        invalid
        disabled
        required
        ids={{ control: 'test-ctrl' }}
      >
        <Field.Label class="custom-label">Label</Field.Label>
        <Field.Input class="custom-input" placeholder="Type here..." />
      </Field.Root>,
    );

    const root = screen.querySelector('[data-testid="field-root"]');
    expect(root?.getAttribute('class')).toBe('custom-field');
    expect(root?.hasAttribute('hasDescription')).toBe(false);
    expect(root?.hasAttribute('hasdescription')).toBe(false);
    expect(root?.hasAttribute('invalid')).toBe(false);
    expect(root?.hasAttribute('ids')).toBe(false);
    expect(root?.hasAttribute('disabled')).toBe(false);
    expect(root?.hasAttribute('required')).toBe(false);

    const label = screen.querySelector('label');
    expect(label?.getAttribute('class')).toBe('custom-label');

    const input = screen.querySelector('input');
    expect(input?.getAttribute('class')).toBe('custom-input');
    expect(input?.getAttribute('placeholder')).toBe('Type here...');
  });

  it('Field の外で単体利用した Field.Input に自動で id が付与される', async () => {
    const { screen, render } = await createDOM();
    await render(<Field.Input />);

    const input = screen.querySelector('input');
    expect(input?.getAttribute('id')).toBeTruthy();
    expect(input?.hasAttribute('data-leve-field-input')).toBe(true);
  });

  it('Textarea の配線が Input と同様に行われる', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Field.Root hasDescription invalid ids={{ description: 'desc', errorMessage: 'err' }}>
        <Field.Label>Bio</Field.Label>
        <Field.Textarea />
        <Field.Description>Help</Field.Description>
        <Field.ErrorMessage>Error</Field.ErrorMessage>
      </Field.Root>,
    );

    const label = screen.querySelector('label');
    const textarea = screen.querySelector('textarea');
    expect(textarea?.getAttribute('id')).toBeTruthy();
    expect(label?.getAttribute('for')).toBe(textarea?.getAttribute('id'));
    expect(textarea?.getAttribute('aria-invalid')).toBe('true');
    expect(textarea?.getAttribute('aria-describedby')).toBe('desc err');
  });

  it('Root の invalid を束ねた Signal をトグルすると ErrorMessage が表示され aria-invalid が更新される', async () => {
    const Wrapper = component$(() => {
      const invalid = useSignal(false);
      return (
        <div>
          <button
            type="button"
            id="toggle-btn"
            onClick$={() => {
              invalid.value = !invalid.value;
            }}
          >
            Toggle
          </button>
          <Field.Root invalid={invalid.value}>
            <Field.Label>Username</Field.Label>
            <Field.Input />
            <Field.ErrorMessage>Invalid username</Field.ErrorMessage>
          </Field.Root>
        </div>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Wrapper />);

    const input = screen.querySelector('input');
    expect(input?.hasAttribute('aria-invalid')).toBe(false);
    expect(screen.querySelector('[data-leve-field-error-message]')).toBeUndefined();

    await userEvent('#toggle-btn', 'click');

    expect(input?.getAttribute('aria-invalid')).toBe('true');
    const errorMessage = screen.querySelector('[data-leve-field-error-message]');
    expect(errorMessage).not.toBeUndefined();
    expect(errorMessage?.textContent).toBe('Invalid username');

    await userEvent('#toggle-btn', 'click');

    expect(input?.hasAttribute('aria-invalid')).toBe(false);
    expect(screen.querySelector('[data-leve-field-error-message]')).toBeUndefined();
  });

  it('Field.Input に bind:value を渡すと初期値が反映され、入力変更で Signal が更新される', async () => {
    const Wrapper = component$(() => {
      const value = useSignal('hello');
      return (
        <div>
          <Field.Input bind:value={value} />
          <span data-testid="output">{value.value}</span>
        </div>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Wrapper />);

    const input = screen.querySelector('input') as HTMLInputElement;
    expect(input?.value).toBe('hello');
    expect(screen.querySelector('[data-testid="output"]')?.textContent).toBe('hello');

    input.value = 'world';
    await userEvent('input', 'input');

    expect(screen.querySelector('[data-testid="output"]')?.textContent).toBe('world');
  });

  it('Field.Textarea に bind:value を渡すと初期値が反映され、入力変更で Signal が更新される', async () => {
    const Wrapper = component$(() => {
      const value = useSignal('hello');
      return (
        <div>
          <Field.Textarea bind:value={value} />
          <span data-testid="output">{value.value}</span>
        </div>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Wrapper />);

    const textarea = screen.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea?.value).toBe('hello');
    expect(screen.querySelector('[data-testid="output"]')?.textContent).toBe('hello');

    textarea.value = 'world';
    await userEvent('textarea', 'input');

    expect(screen.querySelector('[data-testid="output"]')?.textContent).toBe('world');
  });

  it('Field.Input type="checkbox" に bind:checked を渡すと初期値 true が反映される', async () => {
    const Wrapper = component$(() => {
      const checked = useSignal(true);
      return <Field.Input type="checkbox" bind:checked={checked} />;
    });

    const { screen, render } = await createDOM();
    await render(<Wrapper />);

    const input = screen.querySelector('input') as HTMLInputElement;
    expect(input?.checked).toBe(true);
  });

  it('readOnly が Input/Textarea のネイティブ属性となり、全パーツに data-readonly が出力される', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Field.Root readOnly invalid>
        <Field.Label>Label</Field.Label>
        <Field.Input />
        <Field.Textarea />
        <Field.Description>Desc</Field.Description>
        <Field.ErrorMessage>Error</Field.ErrorMessage>
      </Field.Root>,
    );

    const root = screen.querySelector('[data-leve-field]');
    const label = screen.querySelector('[data-leve-field-label]');
    const input = screen.querySelector('[data-leve-field-input]') as HTMLInputElement | null;
    const textarea = screen.querySelector(
      '[data-leve-field-textarea]',
    ) as HTMLTextAreaElement | null;
    const description = screen.querySelector('[data-leve-field-description]');
    const errorMessage = screen.querySelector('[data-leve-field-error-message]');

    expect(input?.hasAttribute('readonly')).toBe(true);
    expect(input?.readOnly).toBe(true);
    expect(textarea?.hasAttribute('readonly')).toBe(true);
    expect(textarea?.readOnly).toBe(true);
    expect(root?.hasAttribute('readOnly')).toBe(false);
    expect(root?.hasAttribute('readonly')).toBe(false);

    for (const el of [root, label, input, textarea, description, errorMessage]) {
      expect(el?.getAttribute('data-readonly')).toBe('');
    }
  });

  it('Field の外で Input / Textarea に readOnly を渡すと readonly と data-readonly が付く', async () => {
    const { screen, render } = await createDOM();
    await render(
      <>
        <Field.Input readOnly />
        <Field.Textarea readOnly />
        <Field.Input />
        <Field.Textarea />
      </>,
    );

    const [readonlyInput, editableInput] = screen.querySelectorAll('[data-leve-field-input]');
    const [readonlyTextarea, editableTextarea] = screen.querySelectorAll(
      '[data-leve-field-textarea]',
    );

    for (const el of [readonlyInput, readonlyTextarea]) {
      expect(el?.hasAttribute('readonly')).toBe(true);
      expect(el?.getAttribute('data-readonly')).toBe('');
    }
    for (const el of [editableInput, editableTextarea]) {
      expect(el?.hasAttribute('readonly')).toBe(false);
      expect(el?.hasAttribute('data-readonly')).toBe(false);
    }
  });

  it('Root の readOnly を束ねた Signal をトグルすると Input の readonly と data-readonly が更新される', async () => {
    const Wrapper = component$(() => {
      const readOnly = useSignal(false);
      return (
        <div>
          <button
            type="button"
            id="toggle-readonly"
            onClick$={() => {
              readOnly.value = !readOnly.value;
            }}
          >
            Toggle
          </button>
          <Field.Root readOnly={readOnly.value}>
            <Field.Label>Email</Field.Label>
            <Field.Input />
          </Field.Root>
        </div>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Wrapper />);

    const root = screen.querySelector('[data-leve-field]');
    const input = screen.querySelector('[data-leve-field-input]') as HTMLInputElement | null;
    expect(input?.readOnly).toBe(false);
    expect(root?.hasAttribute('data-readonly')).toBe(false);

    await userEvent('#toggle-readonly', 'click');

    expect(input?.readOnly).toBe(true);
    expect(input?.getAttribute('data-readonly')).toBe('');
    expect(root?.getAttribute('data-readonly')).toBe('');

    await userEvent('#toggle-readonly', 'click');

    expect(input?.readOnly).toBe(false);
    expect(input?.hasAttribute('data-readonly')).toBe(false);
    expect(root?.hasAttribute('data-readonly')).toBe(false);
  });

  it('Field.Select が Field と配線され、data 属性とネイティブ属性が出力される', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Field.Root
        hasDescription
        invalid
        disabled
        required
        readOnly
        ids={{ description: 'sel-desc', errorMessage: 'sel-err' }}
      >
        <Field.Label>Country</Field.Label>
        <Field.Select>
          <option value="jp">Japan</option>
          <option value="us">United States</option>
        </Field.Select>
        <Field.Description>Select your country.</Field.Description>
        <Field.ErrorMessage>Country is required.</Field.ErrorMessage>
      </Field.Root>,
    );

    const label = screen.querySelector('label');
    const select = screen.querySelector('[data-leve-field-select]');
    expect(select?.tagName).toBe('SELECT');
    expect(select?.getAttribute('id')).toBeTruthy();
    expect(label?.getAttribute('for')).toBe(select?.getAttribute('id'));
    expect(select?.getAttribute('aria-describedby')).toBe('sel-desc sel-err');
    expect(select?.getAttribute('aria-invalid')).toBe('true');
    expect(select?.hasAttribute('disabled')).toBe(true);
    expect(select?.hasAttribute('required')).toBe(true);
    expect(select?.getAttribute('data-invalid')).toBe('');
    expect(select?.getAttribute('data-disabled')).toBe('');
    expect(select?.getAttribute('data-required')).toBe('');
    expect(select?.getAttribute('data-readonly')).toBe('');
  });

  it('Field の外で単体利用した Field.Select に id が付与され、invalid が DOM に漏れない', async () => {
    const { screen, render } = await createDOM();
    await render(
      <>
        <Field.Select invalid>
          <option value="a">A</option>
        </Field.Select>
        <Field.Select>
          <option value="b">B</option>
        </Field.Select>
      </>,
    );

    const [invalidSelect, validSelect] = Array.from(
      screen.querySelectorAll('[data-leve-field-select]'),
    );
    expect(invalidSelect?.getAttribute('id')).toBeTruthy();
    expect(invalidSelect?.getAttribute('aria-invalid')).toBe('true');
    expect(invalidSelect?.hasAttribute('data-invalid')).toBe(true);
    expect(invalidSelect?.hasAttribute('invalid')).toBe(false);
    expect(validSelect?.hasAttribute('aria-invalid')).toBe(false);
  });

  it('Field.Select に bind:value を渡すと初期値が反映され、変更で Signal が更新される', async () => {
    const Wrapper = component$(() => {
      const value = useSignal('jp');
      return (
        <div>
          <Field.Select bind:value={value}>
            <option value="jp">Japan</option>
            <option value="us">United States</option>
          </Field.Select>
          <span data-testid="select-output">{value.value}</span>
        </div>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Wrapper />);

    const select = screen.querySelector('select') as HTMLSelectElement;
    expect(select?.getAttribute('value')).toBe('jp');
    expect(screen.querySelector('[data-testid="select-output"]')?.textContent).toBe('jp');

    select.value = 'us';
    await userEvent('select', 'input');

    expect(screen.querySelector('[data-testid="select-output"]')?.textContent).toBe('us');
  });

  it('Field.RequiredIndicator は Field が required のときのみ描画され、aria-hidden="true" と data 属性が付く', async () => {
    const { screen: screenOptional, render: renderOptional } = await createDOM();
    await renderOptional(
      <Field.Root>
        <Field.Label>
          Name <Field.RequiredIndicator>*</Field.RequiredIndicator>
        </Field.Label>
        <Field.Input />
      </Field.Root>,
    );
    expect(screenOptional.querySelector('[data-leve-field-required-indicator]')).toBeUndefined();

    const { screen: screenRequired, render: renderRequired } = await createDOM();
    await renderRequired(
      <Field.Root required invalid disabled readOnly>
        <Field.Label>
          Name <Field.RequiredIndicator class="req-star">*</Field.RequiredIndicator>
        </Field.Label>
        <Field.Input />
      </Field.Root>,
    );
    const indicator = screenRequired.querySelector('[data-leve-field-required-indicator]');
    expect(indicator?.tagName).toBe('SPAN');
    expect(indicator?.textContent).toBe('*');
    expect(indicator?.getAttribute('aria-hidden')).toBe('true');
    expect(indicator?.getAttribute('class')).toBe('req-star');
    expect(indicator?.getAttribute('data-required')).toBe('');
    expect(indicator?.getAttribute('data-invalid')).toBe('');
    expect(indicator?.getAttribute('data-disabled')).toBe('');
    expect(indicator?.getAttribute('data-readonly')).toBe('');
  });

  it('Field の外で単体利用した Field.RequiredIndicator が描画される', async () => {
    const { screen, render } = await createDOM();
    await render(<Field.RequiredIndicator>*</Field.RequiredIndicator>);

    const indicator = screen.querySelector('[data-leve-field-required-indicator]');
    expect(indicator?.tagName).toBe('SPAN');
    expect(indicator?.getAttribute('aria-hidden')).toBe('true');
    expect(indicator?.textContent).toBe('*');
  });

  it('Field.Textarea の autoresize が DOM に漏れず、ref と onInput$ が維持・合成される', async () => {
    const Wrapper = component$(() => {
      const ref = useSignal<HTMLTextAreaElement>();
      const inputCount = useSignal(0);
      return (
        <div>
          <Field.Textarea
            autoresize
            ref={ref}
            onInput$={() => {
              inputCount.value += 1;
            }}
          />
          <span data-testid="has-ref">{String(Boolean(ref.value))}</span>
          <span data-testid="input-count">{inputCount.value}</span>
        </div>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Wrapper />);

    const textarea = screen.querySelector('[data-leve-field-textarea]') as HTMLTextAreaElement;
    expect(textarea?.hasAttribute('autoresize')).toBe(false);
    expect(screen.querySelector('[data-testid="has-ref"]')?.textContent).toBe('true');

    textarea.value = 'line 1\nline 2';
    await userEvent('textarea', 'input');

    expect(screen.querySelector('[data-testid="input-count"]')?.textContent).toBe('1');
  });
});
