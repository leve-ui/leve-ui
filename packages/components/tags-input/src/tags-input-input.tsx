import { $, type Component, component$, type PropsOf, sync$, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { getEnabledTagIndices, tagsInputContextId } from './tags-input-context';

export type TagsInputInputProps = PropsOf<'input'> & {
  /**
   * The element or component to render instead of `<input>`. A component must spread the props it receives onto one element.
   */
  // biome-ignore lint/suspicious/noExplicitAny: Component props are contravariant, so only any accepts every component (adr/0038)
  as?: keyof HTMLElementTagNameMap | Component<any>;
  [key: string]: unknown;
};

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const syncKeyDown$ = sync$((event: KeyboardEvent, target: HTMLElement) => {
  const el = target as HTMLInputElement;
  if (el.disabled) return;
  const key = event.key;

  if (key === 'Enter') {
    event.preventDefault();
    return;
  }

  const root = el.closest('[data-leve-tags-input]');
  const hasHighlight = root?.hasAttribute('data-highlighted-index') ?? false;
  const isComboboxOpen =
    el.getAttribute('role') === 'combobox' && el.getAttribute('aria-expanded') === 'true';

  if (hasHighlight) {
    if (
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'Home' ||
      key === 'End' ||
      key === 'Backspace' ||
      key === 'Delete' ||
      key === 'F2' ||
      key === 'Escape'
    ) {
      event.preventDefault();
    }
    return;
  }

  if (el.value === '') {
    if (
      key === 'Backspace' ||
      key === 'ArrowLeft' ||
      ((key === 'Home' || key === 'End') && !isComboboxOpen)
    ) {
      event.preventDefault();
    }
  }
});

const syncPaste$ = sync$((event: ClipboardEvent, target: HTMLElement) => {
  const el = target as HTMLInputElement;
  if (!el.disabled && !el.readOnly && el.hasAttribute('data-add-on-paste')) {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text');
    if (pasted) {
      (event as ClipboardEvent & { __levePastedText?: string }).__levePastedText = pasted;
    }
  }
});

/**
 * Primary text `<input>` for entering new tags and navigating existing tags.
 */
export const TagsInputInput = component$<TagsInputInputProps>((props) => {
  const { as, onInput$, onKeyDown$, onPaste$, onFocus$, ...restProps } = props;
  const resolvedElement = as ?? 'input';
  const isHostElement = typeof resolvedElement === 'string';
  const Element = resolvedElement as Component<Record<string, unknown>>;

  const context = useContext(tagsInputContextId);
  const isDisabled = context.disabled.value || Boolean(props.disabled);
  const isReadOnly = context.readOnly.value || Boolean(props.readOnly);
  const isInvalid = context.invalid.value;
  const state = context.tags.value.length > 0 ? 'has-tags' : 'empty';

  const handleInput$ = $(async (_event: InputEvent, target: HTMLInputElement) => {
    if (isDisabled || isReadOnly) {
      target.value = context.inputValue.value;
      return;
    }

    const raw = target.value;
    const delim = context.delimiter.value;
    if (context.allowCustomValue.value && delim && raw.includes(delim)) {
      const parts = raw.split(delim);
      for (let i = 0; i < parts.length - 1; i++) {
        await context.addTag$(parts[i]);
      }
      const remainder = parts[parts.length - 1];
      target.value = remainder;
      await context.setInputValue$(remainder);
      return;
    }

    await context.setInputValue$(raw);
    if (context.highlightedIndex.value !== null) {
      context.highlightedIndex.value = null;
    }
  });

  const handleKeyDown$ = $(async (event: KeyboardEvent, target: HTMLInputElement) => {
    if (isDisabled) return;

    const key = event.key;
    const highlighted = context.highlightedIndex.value;
    const root = context.rootRef.value ?? target.closest<HTMLElement>('[data-leve-tags-input]');
    const isCombobox = target.getAttribute('role') === 'combobox';
    const isComboboxOpen = isCombobox && target.getAttribute('aria-expanded') === 'true';
    const comboboxHandled = Boolean(
      (event as KeyboardEvent & { __leveComboboxHandled?: boolean }).__leveComboboxHandled,
    );
    const hasActiveOption = isComboboxOpen && Boolean(target.getAttribute('aria-activedescendant'));

    if (key === 'Enter') {
      if (highlighted !== null) {
        if (context.editable.value && !isReadOnly && root) {
          const itemInput = root.querySelector(
            `[data-leve-tags-input-item][data-index="${highlighted}"] [data-leve-tags-input-item-input]`,
          );
          if (itemInput) {
            await context.startEdit$(highlighted);
          }
        }
        return;
      }

      if (comboboxHandled || hasActiveOption) {
        return;
      }

      if (context.allowCustomValue.value && !isReadOnly && target.value.trim().length > 0) {
        const added = await context.addTag$(target.value);
        if (added) {
          target.value = '';
          await context.setInputValue$('');
        }
      }
      return;
    }

    if (key === 'F2') {
      if (highlighted !== null && context.editable.value && !isReadOnly && root) {
        const itemInput = root.querySelector(
          `[data-leve-tags-input-item][data-index="${highlighted}"] [data-leve-tags-input-item-input]`,
        );
        if (itemInput) {
          await context.startEdit$(highlighted);
        }
      }
      return;
    }

    if (key === 'Escape') {
      if (comboboxHandled) return;
      if (highlighted !== null) {
        context.highlightedIndex.value = null;
        target.focus();
      }
      if (isComboboxOpen) {
        return;
      }
      return;
    }

    if (key === 'Backspace') {
      if (isReadOnly) return;
      if (highlighted !== null) {
        const enabled = getEnabledTagIndices(root);
        const pos = enabled.indexOf(highlighted);
        await context.removeTagAt$(highlighted);
        if (pos > 0) {
          context.highlightedIndex.value = enabled[pos - 1];
        } else if (pos === 0 && enabled.length > 1) {
          context.highlightedIndex.value = enabled[1] - 1;
        } else {
          context.highlightedIndex.value = null;
        }
        return;
      }

      const atStart =
        target.value === '' || (target.selectionStart === 0 && target.selectionEnd === 0);
      if (atStart) {
        const enabled = getEnabledTagIndices(root);
        if (enabled.length > 0) {
          context.highlightedIndex.value = enabled[enabled.length - 1];
        }
      }
      return;
    }

    if (key === 'Delete') {
      if (isReadOnly || highlighted === null) return;
      const enabled = getEnabledTagIndices(root);
      const pos = enabled.indexOf(highlighted);
      await context.removeTagAt$(highlighted);
      if (pos !== -1 && pos < enabled.length - 1) {
        context.highlightedIndex.value = enabled[pos + 1] - 1;
      } else if (pos > 0) {
        context.highlightedIndex.value = enabled[pos - 1];
      } else {
        context.highlightedIndex.value = null;
      }
      return;
    }

    if (key === 'ArrowLeft') {
      if (highlighted !== null) {
        const enabled = getEnabledTagIndices(root);
        const pos = enabled.indexOf(highlighted);
        if (pos > 0) {
          context.highlightedIndex.value = enabled[pos - 1];
        }
        return;
      }

      const atStart =
        target.value === '' || (target.selectionStart === 0 && target.selectionEnd === 0);
      if (atStart) {
        const enabled = getEnabledTagIndices(root);
        if (enabled.length > 0) {
          context.highlightedIndex.value = enabled[enabled.length - 1];
        }
      }
      return;
    }

    if (key === 'ArrowRight') {
      if (highlighted !== null) {
        const enabled = getEnabledTagIndices(root);
        const pos = enabled.indexOf(highlighted);
        if (pos !== -1 && pos < enabled.length - 1) {
          context.highlightedIndex.value = enabled[pos + 1];
        } else {
          context.highlightedIndex.value = null;
        }
      }
      return;
    }

    if (key === 'Home') {
      if (highlighted === null && isComboboxOpen) return;
      if (highlighted !== null || target.value === '') {
        const enabled = getEnabledTagIndices(root);
        if (enabled.length > 0) {
          context.highlightedIndex.value = enabled[0];
        }
      }
      return;
    }

    if (key === 'End') {
      if (highlighted === null && isComboboxOpen) return;
      if (highlighted !== null || target.value === '') {
        const enabled = getEnabledTagIndices(root);
        if (enabled.length > 0) {
          context.highlightedIndex.value = enabled[enabled.length - 1];
        }
      }
      return;
    }

    if (
      highlighted !== null &&
      key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      context.highlightedIndex.value = null;
    }
  });

  const handlePaste$ = $(async (event: ClipboardEvent) => {
    if (!context.addOnPaste.value || !context.allowCustomValue.value || isDisabled || isReadOnly) {
      return;
    }

    const syncedText = (event as ClipboardEvent & { __levePastedText?: string }).__levePastedText;
    const pasted = syncedText ?? event.clipboardData?.getData('text') ?? '';
    if (!pasted) return;

    const delim = context.delimiter.value;
    const pattern = new RegExp(`[${escapeRegExp(delim)},\\r\\n]+`);
    const parts = pasted.split(pattern);
    await context.addTags$(parts);
  });

  return (
    <Element
      {...restProps}
      id={props.id ?? context.ids.input}
      type={isHostElement ? 'text' : undefined}
      value={isHostElement ? context.inputValue.value : undefined}
      disabled={isDisabled}
      readOnly={isReadOnly}
      aria-describedby={props['aria-describedby'] ?? context.describedBy.value}
      aria-invalid={props['aria-invalid'] ?? (isInvalid ? 'true' : undefined)}
      aria-required={props['aria-required'] ?? (context.required.value ? 'true' : undefined)}
      onInput$={[handleInput$, onInput$]}
      onKeyDown$={[isHostElement ? syncKeyDown$ : undefined, handleKeyDown$, onKeyDown$]}
      onPaste$={[isHostElement ? syncPaste$ : undefined, handlePaste$, onPaste$]}
      onFocus$={onFocus$}
      data-leve-tags-input-input=""
      data-state={state}
      data-disabled={dataAttr(isDisabled)}
      data-readonly={dataAttr(isReadOnly)}
      data-invalid={dataAttr(isInvalid)}
      data-add-on-paste={dataAttr(context.addOnPaste.value && context.allowCustomValue.value)}
    />
  );
});
