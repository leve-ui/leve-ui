import { $, component$, type PropsOf, sync$, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { getEnabledTagIndices, tagsInputContextId } from './tags-input-context';

export type TagsInputInputProps = PropsOf<'input'>;

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
    if (key === 'Backspace' || key === 'ArrowLeft' || key === 'Home' || key === 'End') {
      event.preventDefault();
    }
  }
});

const syncPaste$ = sync$((event: ClipboardEvent, target: HTMLElement) => {
  const el = target as HTMLInputElement;
  if (!el.disabled && !el.readOnly && el.hasAttribute('data-add-on-paste')) {
    event.preventDefault();
  }
});

/**
 * Primary text `<input>` for entering new tags and navigating existing tags.
 */
export const TagsInputInput = component$<TagsInputInputProps>((props) => {
  const context = useContext(tagsInputContextId);
  const isDisabled = context.disabled.value || Boolean(props.disabled);
  const isReadOnly = context.readOnly.value || Boolean(props.readOnly);
  const isInvalid = context.invalid.value;
  const state = context.tags.value.length > 0 ? 'has-tags' : 'empty';

  const handleInput$ = $(async (_event: InputEvent, target: HTMLInputElement) => {
    context.inputRef.value = target;
    if (isDisabled || isReadOnly) {
      target.value = context.inputValue.value;
      return;
    }

    const raw = target.value;
    const delim = context.delimiter.value;
    if (delim && raw.includes(delim)) {
      const parts = raw.split(delim);
      for (let i = 0; i < parts.length - 1; i++) {
        await context.addTag$(parts[i]);
      }
      const remainder = parts[parts.length - 1];
      target.value = remainder;
      context.inputValue.value = remainder;
      return;
    }

    context.inputValue.value = raw;
    if (context.highlightedIndex.value !== null) {
      context.highlightedIndex.value = null;
    }
  });

  const handleKeyDown$ = $(async (event: KeyboardEvent, target: HTMLInputElement) => {
    context.inputRef.value = target;
    if (isDisabled) return;

    const key = event.key;
    const highlighted = context.highlightedIndex.value;
    const root = context.rootRef.value ?? target.closest<HTMLElement>('[data-leve-tags-input]');

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

      if (!isReadOnly && target.value.trim().length > 0) {
        const added = await context.addTag$(target.value);
        if (added) {
          target.value = '';
          context.inputValue.value = '';
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
      if (highlighted !== null) {
        context.highlightedIndex.value = null;
        target.focus();
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
      if (highlighted !== null || target.value === '') {
        const enabled = getEnabledTagIndices(root);
        if (enabled.length > 0) {
          context.highlightedIndex.value = enabled[0];
        }
      }
      return;
    }

    if (key === 'End') {
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

  const handlePaste$ = $(async (event: ClipboardEvent, target: HTMLInputElement) => {
    context.inputRef.value = target;
    if (!context.addOnPaste.value || isDisabled || isReadOnly) return;

    const pasted = event.clipboardData?.getData('text') ?? '';
    if (!pasted) return;

    const delim = context.delimiter.value;
    const pattern = new RegExp(`[${escapeRegExp(delim)},\\r\\n]+`);
    const parts = pasted.split(pattern);
    await context.addTags$(parts);
  });

  const handleFocus$ = $((_event: FocusEvent, target: HTMLInputElement) => {
    context.inputRef.value = target;
  });

  return (
    <input
      {...props}
      ref={context.inputRef}
      id={props.id ?? context.ids.input}
      type="text"
      value={context.inputValue.value}
      disabled={isDisabled}
      readOnly={isReadOnly}
      aria-describedby={props['aria-describedby'] ?? context.describedBy.value}
      aria-invalid={props['aria-invalid'] ?? (isInvalid ? 'true' : undefined)}
      aria-required={props['aria-required'] ?? (context.required.value ? 'true' : undefined)}
      onInput$={[handleInput$, props.onInput$]}
      onKeyDown$={[syncKeyDown$, handleKeyDown$, props.onKeyDown$]}
      onPaste$={[syncPaste$, handlePaste$, props.onPaste$]}
      onFocus$={[handleFocus$, props.onFocus$]}
      data-leve-tags-input-input=""
      data-state={state}
      data-disabled={dataAttr(isDisabled)}
      data-readonly={dataAttr(isReadOnly)}
      data-invalid={dataAttr(isInvalid)}
      data-add-on-paste={dataAttr(context.addOnPaste.value)}
    />
  );
});
