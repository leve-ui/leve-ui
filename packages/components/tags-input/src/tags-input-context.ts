import { createContextId, type QRL, type ReadonlySignal, type Signal } from '@builder.io/qwik';

/**
 * Element IDs for the `TagsInput` parts.
 */
export interface TagsInputIds {
  /** ID of the root element. */
  root: string;
  /** ID of the label element. */
  label: string;
  /** ID of the control element. */
  control: string;
  /** ID of the main text input element. */
  input: string;
}

/**
 * Shared context for `TagsInput` parts.
 */
export interface TagsInputContext {
  ids: TagsInputIds;
  rootRef: Signal<HTMLElement | undefined>;
  inputRef: Signal<HTMLInputElement | undefined>;
  tags: ReadonlySignal<string[]>;
  highlightedIndex: Signal<number | null>;
  editingIndex: Signal<number | null>;
  editText: Signal<string>;
  inputValue: Signal<string>;
  delimiter: ReadonlySignal<string>;
  max: ReadonlySignal<number | undefined>;
  allowDuplicates: ReadonlySignal<boolean>;
  editable: ReadonlySignal<boolean>;
  addOnPaste: ReadonlySignal<boolean>;
  disabled: ReadonlySignal<boolean>;
  readOnly: ReadonlySignal<boolean>;
  required: ReadonlySignal<boolean>;
  invalid: ReadonlySignal<boolean>;
  describedBy: ReadonlySignal<string | undefined>;
  hasField: boolean;
  addTag$: QRL<(raw: string) => Promise<boolean>>;
  addTags$: QRL<(rawItems: string[]) => Promise<void>>;
  removeTagAt$: QRL<(index: number) => Promise<void>>;
  clearTags$: QRL<() => Promise<void>>;
  startEdit$: QRL<(index: number) => void>;
  commitEdit$: QRL<(index: number, nextValue: string) => Promise<void>>;
  cancelEdit$: QRL<() => void>;
  focusInput$: QRL<() => void>;
  reset$: QRL<() => Promise<void>>;
}

export const tagsInputContextId = createContextId<TagsInputContext>('leve-ui.tags-input');

export type TagsInputItemState = 'editing' | 'active' | 'idle';

/**
 * Context provided by `TagsInput.Item` to its child parts.
 */
export interface TagsInputItemContext {
  index: ReadonlySignal<number>;
  value: ReadonlySignal<string>;
  isDisabled: ReadonlySignal<boolean>;
  isHighlighted: ReadonlySignal<boolean>;
  isEditing: ReadonlySignal<boolean>;
  state: ReadonlySignal<TagsInputItemState>;
}

export const tagsInputItemContextId =
  createContextId<TagsInputItemContext>('leve-ui.tags-input.item');

/**
 * Returns the indices of all enabled `TagsInput.Item` elements within `root`.
 */
export function getEnabledTagIndices(root: HTMLElement | null | undefined): number[] {
  if (!root) return [];
  const items = Array.from(
    root.querySelectorAll<HTMLElement>('[data-leve-tags-input-item]'),
  ).filter((el) => el.closest('[data-leve-tags-input]') === root);

  const indices: number[] = [];
  for (const el of items) {
    if (el.hasAttribute('data-disabled')) continue;
    const rawIndex = el.getAttribute('data-index');
    if (rawIndex === null) continue;
    const parsed = Number(rawIndex);
    if (!Number.isNaN(parsed)) {
      indices.push(parsed);
    }
  }
  return indices;
}
