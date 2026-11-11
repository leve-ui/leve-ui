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
});
