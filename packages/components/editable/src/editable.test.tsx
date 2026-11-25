import { $, component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { Field } from '@leve-ui/field';
import { describe, expect, it } from 'vitest';
import { Editable } from './index';

describe('Editable', () => {
  it('renders all 9 parts with expected data attributes and initial preview state', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Editable.Root defaultValue="Hello" placeholder="Enter text">
        <Editable.Label>Title</Editable.Label>
        <Editable.Area>
          <Editable.Preview />
          <Editable.Input />
        </Editable.Area>
        <Editable.Control>
          <Editable.EditTrigger>Edit</Editable.EditTrigger>
          <Editable.SubmitTrigger>Save</Editable.SubmitTrigger>
          <Editable.CancelTrigger>Cancel</Editable.CancelTrigger>
        </Editable.Control>
      </Editable.Root>,
    );

    const root = screen.querySelector('[data-leve-editable]');
    const label = screen.querySelector('[data-leve-editable-label]');
    const area = screen.querySelector('[data-leve-editable-area]');
    const preview = screen.querySelector('[data-leve-editable-preview]');
    const input = screen.querySelector('[data-leve-editable-input]') as HTMLInputElement | null;
    const control = screen.querySelector('[data-leve-editable-control]');
    const editTrigger = screen.querySelector('[data-leve-editable-edit-trigger]');
    const submitTrigger = screen.querySelector('[data-leve-editable-submit-trigger]');
    const cancelTrigger = screen.querySelector('[data-leve-editable-cancel-trigger]');

    expect(root?.getAttribute('data-state')).toBe('preview');
    expect(root?.hasAttribute('data-empty')).toBe(false);
    expect(label?.getAttribute('for')).toBe(input?.getAttribute('id'));
    expect(area?.getAttribute('data-state')).toBe('preview');
    expect(preview?.textContent).toBe('Hello');
    expect(preview?.hasAttribute('hidden')).toBe(false);
    expect(preview?.getAttribute('tabindex')).toBe('0');
    expect(input?.tagName).toBe('INPUT');
    expect(input?.hasAttribute('hidden')).toBe(true);
    expect(control?.getAttribute('data-state')).toBe('preview');
    expect(editTrigger?.hasAttribute('hidden')).toBe(false);
    expect(submitTrigger?.hasAttribute('hidden')).toBe(true);
    expect(cancelTrigger?.hasAttribute('hidden')).toBe(true);
  });

  it('shows placeholder and empty data attributes when value is empty', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Editable.Root placeholder="Click to edit">
        <Editable.Area>
          <Editable.Preview />
          <Editable.Input />
        </Editable.Area>
      </Editable.Root>,
    );

    const root = screen.querySelector('[data-leve-editable]');
    const area = screen.querySelector('[data-leve-editable-area]');
    const preview = screen.querySelector('[data-leve-editable-preview]');

    expect(root?.hasAttribute('data-empty')).toBe(true);
    expect(area?.hasAttribute('data-empty')).toBe(true);
    expect(area?.hasAttribute('data-placeholder-shown')).toBe(true);
    expect(preview?.hasAttribute('data-empty')).toBe(true);
    expect(preview?.hasAttribute('data-placeholder-shown')).toBe(true);
    expect(preview?.textContent).toBe('Click to edit');
  });

  it('enters edit mode via EditTrigger, commits via SubmitTrigger, and fires callbacks', async () => {
    const { screen, render, userEvent } = await createDOM();

    const Demo = component$(() => {
      const valueLog = useSignal<string[]>([]);
      const commitLog = useSignal<string[]>([]);
      const editLog = useSignal<boolean[]>([]);
      const handleValueChange$ = $((val: string) => {
        valueLog.value = [...valueLog.value, val];
      });
      const handleValueCommit$ = $((val: string) => {
        commitLog.value = [...commitLog.value, val];
      });
      const handleEditChange$ = $((editing: boolean) => {
        editLog.value = [...editLog.value, editing];
      });

      return (
        <div>
          <Editable.Root
            defaultValue="Initial"
            onValueChange$={handleValueChange$}
            onValueCommit$={handleValueCommit$}
            onEditChange$={handleEditChange$}
          >
            <Editable.Area>
              <Editable.Preview />
              <Editable.Input />
            </Editable.Area>
            <Editable.Control>
              <Editable.EditTrigger>Edit</Editable.EditTrigger>
              <Editable.SubmitTrigger>Save</Editable.SubmitTrigger>
              <Editable.CancelTrigger>Cancel</Editable.CancelTrigger>
            </Editable.Control>
          </Editable.Root>
          <span data-testid="value-log">{JSON.stringify(valueLog.value)}</span>
          <span data-testid="commit-log">{JSON.stringify(commitLog.value)}</span>
          <span data-testid="edit-log">{JSON.stringify(editLog.value)}</span>
        </div>
      );
    });

    await render(<Demo />);

    await userEvent('[data-leve-editable-edit-trigger]', 'click');
    const root = screen.querySelector('[data-leve-editable]');
    expect(root?.getAttribute('data-state')).toBe('edit');
    expect(screen.querySelector('[data-testid="edit-log"]')?.textContent).toBe('[true]');

    const input = screen.querySelector('[data-leve-editable-input]') as HTMLInputElement;
    input.value = 'Updated';
    await userEvent('[data-leve-editable-input]', 'input');
    expect(screen.querySelector('[data-testid="value-log"]')?.textContent).toBe('[]');

    await userEvent('[data-leve-editable-submit-trigger]', 'click');
    expect(root?.getAttribute('data-state')).toBe('preview');
    expect(screen.querySelector('[data-testid="value-log"]')?.textContent).toBe('["Updated"]');
    expect(screen.querySelector('[data-testid="commit-log"]')?.textContent).toBe('["Updated"]');
    expect(screen.querySelector('[data-testid="edit-log"]')?.textContent).toBe('[true,false]');
    expect(screen.querySelector('[data-leve-editable-preview]')?.textContent).toBe('Updated');
  });

  it('reverts draft value on CancelTrigger without changing committed value', async () => {
    const { screen, render, userEvent } = await createDOM();

    const Demo = component$(() => {
      const valueLog = useSignal<string[]>([]);
      const revertLog = useSignal<string[]>([]);
      const handleValueChange$ = $((val: string) => {
        valueLog.value = [...valueLog.value, val];
      });
      const handleValueRevert$ = $((val: string) => {
        revertLog.value = [...revertLog.value, val];
      });

      return (
        <div>
          <Editable.Root
            defaultValue="Original"
            onValueChange$={handleValueChange$}
            onValueRevert$={handleValueRevert$}
          >
            <Editable.Area>
              <Editable.Preview />
              <Editable.Input />
            </Editable.Area>
            <Editable.Control>
              <Editable.EditTrigger>Edit</Editable.EditTrigger>
              <Editable.SubmitTrigger>Save</Editable.SubmitTrigger>
              <Editable.CancelTrigger>Cancel</Editable.CancelTrigger>
            </Editable.Control>
          </Editable.Root>
          <span data-testid="value-log">{JSON.stringify(valueLog.value)}</span>
          <span data-testid="revert-log">{JSON.stringify(revertLog.value)}</span>
        </div>
      );
    });

    await render(<Demo />);
    await userEvent('[data-leve-editable-edit-trigger]', 'click');

    const input = screen.querySelector('[data-leve-editable-input]') as HTMLInputElement;
    input.value = 'Draft';
    await userEvent('[data-leve-editable-input]', 'input');

    await userEvent('[data-leve-editable-cancel-trigger]', 'click');
    expect(screen.querySelector('[data-leve-editable]')?.getAttribute('data-state')).toBe(
      'preview',
    );
    expect(screen.querySelector('[data-testid="value-log"]')?.textContent).toBe('[]');
    expect(screen.querySelector('[data-testid="revert-log"]')?.textContent).toBe('["Original"]');
    expect(screen.querySelector('[data-leve-editable-preview]')?.textContent).toBe('Original');
  });

  it('supports controlled bind:value and bind:edit', async () => {
    const { screen, render, userEvent } = await createDOM();

    const Demo = component$(() => {
      const value = useSignal('Controlled');
      const edit = useSignal(false);

      return (
        <div>
          <Editable.Root bind:value={value} bind:edit={edit}>
            <Editable.Area>
              <Editable.Preview />
              <Editable.Input />
            </Editable.Area>
            <Editable.Control>
              <Editable.EditTrigger>Edit</Editable.EditTrigger>
              <Editable.SubmitTrigger>Save</Editable.SubmitTrigger>
            </Editable.Control>
          </Editable.Root>
          <span data-testid="val">{value.value}</span>
          <span data-testid="edit">{String(edit.value)}</span>
        </div>
      );
    });

    await render(<Demo />);
    expect(screen.querySelector('[data-testid="edit"]')?.textContent).toBe('false');

    await userEvent('[data-leve-editable-edit-trigger]', 'click');
    expect(screen.querySelector('[data-testid="edit"]')?.textContent).toBe('true');

    const input = screen.querySelector('[data-leve-editable-input]') as HTMLInputElement;
    input.value = 'Next';
    await userEvent('[data-leve-editable-input]', 'input');
    await userEvent('[data-leve-editable-submit-trigger]', 'click');

    expect(screen.querySelector('[data-testid="val"]')?.textContent).toBe('Next');
    expect(screen.querySelector('[data-testid="edit"]')?.textContent).toBe('false');
  });

  it('renders textarea when multiline is true', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Editable.Root multiline defaultValue="Line 1">
        <Editable.Area>
          <Editable.Preview />
          <Editable.Input rows={4} />
        </Editable.Area>
      </Editable.Root>,
    );

    const input = screen.querySelector('[data-leve-editable-input]');
    expect(input?.tagName).toBe('TEXTAREA');
    expect(input?.getAttribute('rows')).toBe('4');
  });

  it('handles activationMode="dblclick", "click", and "none"', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <div>
        <Editable.Root activationMode="dblclick" defaultValue="DblClick" id="dbl">
          <Editable.Area>
            <Editable.Preview />
            <Editable.Input />
          </Editable.Area>
        </Editable.Root>
        <Editable.Root activationMode="click" defaultValue="Click" id="clk">
          <Editable.Area>
            <Editable.Preview />
            <Editable.Input />
          </Editable.Area>
        </Editable.Root>
        <Editable.Root activationMode="none" defaultValue="None" id="none">
          <Editable.Area>
            <Editable.Preview />
            <Editable.Input />
          </Editable.Area>
        </Editable.Root>
      </div>,
    );

    const dblRoot = screen.querySelector('#dbl');
    const clkRoot = screen.querySelector('#clk');
    const noneRoot = screen.querySelector('#none');

    expect(dblRoot?.querySelector('[data-leve-editable-preview]')?.hasAttribute('tabindex')).toBe(
      false,
    );
    await userEvent('#dbl [data-leve-editable-preview]', 'click');
    expect(dblRoot?.getAttribute('data-state')).toBe('preview');
    await userEvent('#dbl [data-leve-editable-preview]', 'dblclick');
    expect(dblRoot?.getAttribute('data-state')).toBe('edit');

    await userEvent('#clk [data-leve-editable-preview]', 'click');
    expect(clkRoot?.getAttribute('data-state')).toBe('edit');

    await userEvent('#none [data-leve-editable-preview]', 'click');
    await userEvent('#none [data-leve-editable-preview]', 'dblclick');
    expect(noneRoot?.getAttribute('data-state')).toBe('preview');
  });

  it('propagates disabled, readOnly, required, invalid, and Field context', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Field.Root invalid required>
        <Field.Label>Bio</Field.Label>
        <Editable.Root defaultValue="Hello" disabled>
          <Editable.Area>
            <Editable.Preview />
            <Editable.Input />
          </Editable.Area>
          <Editable.Control>
            <Editable.EditTrigger>Edit</Editable.EditTrigger>
          </Editable.Control>
        </Editable.Root>
        <Field.Description>Short bio</Field.Description>
        <Field.ErrorMessage>Required</Field.ErrorMessage>
      </Field.Root>,
    );

    const root = screen.querySelector('[data-leve-editable]');
    const fieldLabel = screen.querySelector('[data-leve-field-label]');
    const preview = screen.querySelector('[data-leve-editable-preview]');
    const input = screen.querySelector('[data-leve-editable-input]');
    const editTrigger = screen.querySelector('[data-leve-editable-edit-trigger]');

    expect(root?.hasAttribute('data-disabled')).toBe(true);
    expect(root?.hasAttribute('data-invalid')).toBe(true);
    expect(fieldLabel?.getAttribute('for')).toBe(input?.getAttribute('id'));
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.hasAttribute('disabled')).toBe(true);
    expect(input?.hasAttribute('required')).toBe(true);
    expect(input?.getAttribute('aria-describedby')).toBeTruthy();
    expect(preview?.hasAttribute('tabindex')).toBe(false);
    expect(editTrigger?.hasAttribute('disabled')).toBe(true);

    await userEvent('[data-leve-editable-edit-trigger]', 'click');
    expect(root?.getAttribute('data-state')).toBe('preview');
  });

  it('passes custom class and aria-label to parts', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Editable.Root class="my-root" ids={{ input: 'custom-input' }}>
        <Editable.Label class="my-label">Name</Editable.Label>
        <Editable.Area class="my-area">
          <Editable.Preview class="my-preview" />
          <Editable.Input class="my-input" aria-label="Name input" />
        </Editable.Area>
        <Editable.Control class="my-control">
          <Editable.EditTrigger class="my-edit">Edit</Editable.EditTrigger>
        </Editable.Control>
      </Editable.Root>,
    );

    expect(screen.querySelector('[data-leve-editable]')?.classList.contains('my-root')).toBe(true);
    expect(screen.querySelector('[data-leve-editable-label]')?.classList.contains('my-label')).toBe(
      true,
    );
    expect(screen.querySelector('[data-leve-editable-area]')?.classList.contains('my-area')).toBe(
      true,
    );
    expect(
      screen.querySelector('[data-leve-editable-preview]')?.classList.contains('my-preview'),
    ).toBe(true);
    const input = screen.querySelector('[data-leve-editable-input]');
    expect(input?.classList.contains('my-input')).toBe(true);
    expect(input?.getAttribute('id')).toBe('custom-input');
    expect(input?.getAttribute('aria-label')).toBe('Name input');
    expect(
      screen.querySelector('[data-leve-editable-control]')?.classList.contains('my-control'),
    ).toBe(true);
    expect(
      screen.querySelector('[data-leve-editable-edit-trigger]')?.classList.contains('my-edit'),
    ).toBe(true);
  });
});
