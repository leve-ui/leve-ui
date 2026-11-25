import { $, component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { Field } from '@leve-ui/field';
import { describe, expect, it } from 'vitest';
import { TagsInput } from './index';

describe('TagsInput', () => {
  it('renders all parts with required roles, ARIA, and data-leve-* attributes', async () => {
    const { screen, render } = await createDOM();

    await render(
      <TagsInput.Root defaultValue={['qwik', 'typescript']}>
        <TagsInput.Label>Frameworks</TagsInput.Label>
        <TagsInput.Control>
          <TagsInput.Item index={0} value="qwik">
            <TagsInput.ItemPreview>
              <TagsInput.ItemText>qwik</TagsInput.ItemText>
              <TagsInput.ItemDeleteTrigger>×</TagsInput.ItemDeleteTrigger>
            </TagsInput.ItemPreview>
            <TagsInput.ItemInput />
          </TagsInput.Item>
          <TagsInput.Item index={1} value="typescript">
            <TagsInput.ItemPreview>
              <TagsInput.ItemText>typescript</TagsInput.ItemText>
              <TagsInput.ItemDeleteTrigger>×</TagsInput.ItemDeleteTrigger>
            </TagsInput.ItemPreview>
            <TagsInput.ItemInput />
          </TagsInput.Item>
          <TagsInput.Input placeholder="Add tag..." />
          <TagsInput.ClearTrigger>Clear</TagsInput.ClearTrigger>
        </TagsInput.Control>
        <TagsInput.HiddenInput name="tags" />
      </TagsInput.Root>,
    );

    const root = screen.querySelector('[data-leve-tags-input]');
    const label = screen.querySelector('[data-leve-tags-input-label]');
    const control = screen.querySelector('[data-leve-tags-input-control]');
    const items = Array.from(screen.querySelectorAll('[data-leve-tags-input-item]'));
    const previews = Array.from(screen.querySelectorAll('[data-leve-tags-input-item-preview]'));
    const texts = Array.from(screen.querySelectorAll('[data-leve-tags-input-item-text]'));
    const deleteTriggers = Array.from(
      screen.querySelectorAll('[data-leve-tags-input-item-delete-trigger]'),
    );
    const itemInputs = Array.from(screen.querySelectorAll('[data-leve-tags-input-item-input]'));
    const input = screen.querySelector('[data-leve-tags-input-input]') as HTMLInputElement | null;
    const clearTrigger = screen.querySelector(
      '[data-leve-tags-input-clear-trigger]',
    ) as HTMLButtonElement | null;
    const hiddenInput = screen.querySelector(
      '[data-leve-tags-input-hidden-input]',
    ) as HTMLInputElement | null;

    expect(root).not.toBeNull();
    expect(root?.getAttribute('role')).toBe('group');
    expect(root?.getAttribute('data-state')).toBe('has-tags');
    expect(root?.getAttribute('aria-labelledby')).toBe(label?.id);
    expect(label?.getAttribute('for')).toBe(input?.id);
    expect(control).not.toBeNull();
    expect(items).toHaveLength(2);
    expect(items[0]?.getAttribute('data-index')).toBe('0');
    expect(items[0]?.getAttribute('data-state')).toBe('idle');
    expect(previews).toHaveLength(2);
    expect(texts).toHaveLength(2);
    expect(deleteTriggers).toHaveLength(2);
    expect(deleteTriggers[0]?.getAttribute('aria-label')).toBe('Delete tag qwik');
    expect(deleteTriggers[0]?.getAttribute('tabindex')).toBe('-1');
    expect(itemInputs).toHaveLength(2);
    expect(itemInputs[0]?.hasAttribute('hidden')).toBe(true);
    expect(itemInputs[0]?.getAttribute('aria-label')).toBe('Edit tag qwik');
    expect(clearTrigger?.disabled).toBe(false);
    expect(hiddenInput?.value).toBe('qwik,typescript');
    expect(hiddenInput?.getAttribute('aria-hidden')).toBe('true');
    expect(hiddenInput?.getAttribute('tabindex')).toBe('-1');
  });

  it('adds tags on delimiter input and clears via ClearTrigger', async () => {
    const { screen, render, userEvent } = await createDOM();

    const Demo = component$(() => {
      const tags = useSignal<string[]>([]);
      return (
        <TagsInput.Root bind:value={tags}>
          <TagsInput.Label>Tags</TagsInput.Label>
          <TagsInput.Control>
            {tags.value.map((tag, index) => (
              <TagsInput.Item key={`${tag}-${index}`} index={index} value={tag}>
                <TagsInput.ItemPreview>
                  <TagsInput.ItemText>{tag}</TagsInput.ItemText>
                  <TagsInput.ItemDeleteTrigger>×</TagsInput.ItemDeleteTrigger>
                </TagsInput.ItemPreview>
                <TagsInput.ItemInput />
              </TagsInput.Item>
            ))}
            <TagsInput.Input />
            <TagsInput.ClearTrigger>Clear</TagsInput.ClearTrigger>
          </TagsInput.Control>
          <TagsInput.HiddenInput name="tags" />
        </TagsInput.Root>
      );
    });

    await render(<Demo />);

    const root = screen.querySelector('[data-leve-tags-input]');
    const input = screen.querySelector('[data-leve-tags-input-input]') as HTMLInputElement;
    const clearBtn = screen.querySelector(
      '[data-leve-tags-input-clear-trigger]',
    ) as HTMLButtonElement;

    expect(root?.getAttribute('data-state')).toBe('empty');
    expect(clearBtn.disabled).toBe(true);

    input.value = 'react,';
    await userEvent('[data-leve-tags-input-input]', 'input');

    expect(root?.getAttribute('data-state')).toBe('has-tags');
    expect(Array.from(screen.querySelectorAll('[data-leve-tags-input-item]'))).toHaveLength(1);
    expect(screen.querySelector('[data-leve-tags-input-item-text]')?.textContent).toBe('react');
    expect(input.value).toBe('');
    expect(clearBtn.disabled).toBe(false);

    input.value = 'vue,';
    await userEvent('[data-leve-tags-input-input]', 'input');
    expect(Array.from(screen.querySelectorAll('[data-leve-tags-input-item]'))).toHaveLength(2);

    await userEvent('[data-leve-tags-input-clear-trigger]', 'click');
    expect(Array.from(screen.querySelectorAll('[data-leve-tags-input-item]'))).toHaveLength(0);
    expect(root?.getAttribute('data-state')).toBe('empty');
  });

  it('removes a tag when ItemDeleteTrigger is clicked', async () => {
    const { screen, render, userEvent } = await createDOM();

    const Demo = component$(() => {
      const tags = useSignal<string[]>(['alpha', 'beta']);
      return (
        <TagsInput.Root bind:value={tags}>
          <TagsInput.Label>Tags</TagsInput.Label>
          <TagsInput.Control>
            {tags.value.map((tag, index) => (
              <TagsInput.Item key={`${tag}-${index}`} index={index} value={tag}>
                <TagsInput.ItemPreview>
                  <TagsInput.ItemText>{tag}</TagsInput.ItemText>
                  <TagsInput.ItemDeleteTrigger>×</TagsInput.ItemDeleteTrigger>
                </TagsInput.ItemPreview>
              </TagsInput.Item>
            ))}
            <TagsInput.Input />
          </TagsInput.Control>
        </TagsInput.Root>
      );
    });

    await render(<Demo />);

    const deleteButtons = Array.from(
      screen.querySelectorAll('[data-leve-tags-input-item-delete-trigger]'),
    );
    expect(deleteButtons).toHaveLength(2);

    await userEvent(deleteButtons[0] as Element, 'click');

    const texts = Array.from(screen.querySelectorAll('[data-leve-tags-input-item-text]'));
    expect(texts).toHaveLength(1);
    expect(texts[0]?.textContent).toBe('beta');
  });

  it('enforces max and allowDuplicates', async () => {
    const { screen, render, userEvent } = await createDOM();
    const changes: string[][] = [];

    await render(
      <TagsInput.Root
        defaultValue={['one']}
        max={2}
        allowDuplicates={false}
        onValueChange$={$((value: string[]) => {
          changes.push(value);
        })}
      >
        <TagsInput.Label>Tags</TagsInput.Label>
        <TagsInput.Control>
          <TagsInput.Input />
        </TagsInput.Control>
        <TagsInput.HiddenInput name="tags" />
      </TagsInput.Root>,
    );

    const input = screen.querySelector('[data-leve-tags-input-input]') as HTMLInputElement;
    const hidden = screen.querySelector('[data-leve-tags-input-hidden-input]') as HTMLInputElement;

    // Duplicate should be ignored
    input.value = 'one,';
    await userEvent('[data-leve-tags-input-input]', 'input');
    expect(changes).toHaveLength(0);
    expect(hidden.value).toBe('one');

    // Valid second tag should be added
    input.value = 'two,';
    await userEvent('[data-leve-tags-input-input]', 'input');
    expect(changes).toEqual([['one', 'two']]);
    expect(hidden.value).toBe('one,two');

    // Third tag exceeds max=2 and should be ignored
    input.value = 'three,';
    await userEvent('[data-leve-tags-input-input]', 'input');
    expect(changes).toHaveLength(1);
    expect(hidden.value).toBe('one,two');
  });

  it('wires Field context attributes and disabled/readOnly/invalid states', async () => {
    const { screen, render } = await createDOM();

    await render(
      <Field.Root invalid required disabled hasDescription>
        <Field.Label>Skills</Field.Label>
        <TagsInput.Root defaultValue={['css']}>
          <TagsInput.Control>
            <TagsInput.Item index={0} value="css">
              <TagsInput.ItemPreview>
                <TagsInput.ItemText>css</TagsInput.ItemText>
                <TagsInput.ItemDeleteTrigger>×</TagsInput.ItemDeleteTrigger>
              </TagsInput.ItemPreview>
            </TagsInput.Item>
            <TagsInput.Input />
          </TagsInput.Control>
          <TagsInput.HiddenInput name="skills" />
        </TagsInput.Root>
        <Field.Description>Add your skills</Field.Description>
        <Field.ErrorMessage>At least one skill is required</Field.ErrorMessage>
      </Field.Root>,
    );

    const root = screen.querySelector('[data-leve-tags-input]');
    const fieldLabel = screen.querySelector('[data-leve-field-label]');
    const fieldDesc = screen.querySelector('[data-leve-field-description]');
    const fieldErr = screen.querySelector('[data-leve-field-error-message]');
    const input = screen.querySelector('[data-leve-tags-input-input]') as HTMLInputElement;
    const hidden = screen.querySelector('[data-leve-tags-input-hidden-input]') as HTMLInputElement;

    expect(root?.getAttribute('aria-labelledby')).toBe(fieldLabel?.id);
    expect(root?.getAttribute('aria-invalid')).toBe('true');
    expect(root?.getAttribute('aria-disabled')).toBe('true');
    expect(root?.hasAttribute('data-disabled')).toBe(true);
    expect(root?.hasAttribute('data-invalid')).toBe(true);

    const describedBy = input.getAttribute('aria-describedby') ?? '';
    expect(describedBy).toContain(fieldDesc?.id ?? '');
    expect(describedBy).toContain(fieldErr?.id ?? '');
    expect(input.disabled).toBe(true);
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(hidden.required).toBe(true);
    expect(hidden.disabled).toBe(true);
  });

  it('passes through custom props without overwriting required attributes', async () => {
    const { screen, render } = await createDOM();

    await render(
      <TagsInput.Root class="custom-root" aria-label="Custom tags">
        <TagsInput.Control class="custom-control">
          <TagsInput.Input class="custom-input" placeholder="Type here" />
        </TagsInput.Control>
      </TagsInput.Root>,
    );

    const root = screen.querySelector('[data-leve-tags-input]');
    const control = screen.querySelector('[data-leve-tags-input-control]');
    const input = screen.querySelector('[data-leve-tags-input-input]');

    expect(root?.className).toContain('custom-root');
    expect(root?.getAttribute('role')).toBe('group');
    expect(root?.getAttribute('aria-label')).toBe('Custom tags');
    expect(root?.getAttribute('aria-labelledby')).toBeNull();
    expect(control?.className).toContain('custom-control');
    expect(input?.className).toContain('custom-input');
  });
});
