import {
  $,
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useComputed$,
  useContextProvider,
  useId,
  useSignal,
} from '@builder.io/qwik';
import {
  announce,
  dataAttr,
  useControllableState,
  useFieldContext,
  useFieldControl,
} from '@leve-ui/utils';
import { type TagsInputIds, tagsInputContextId } from './tags-input-context';

export type TagsInputRootProps = PropsOf<'div'> & {
  /** Overrides the element IDs of the parts. Inside a Field, the input ID comes from the Field. */
  ids?: Partial<TagsInputIds>;
  /**
   * The initial tags array (uncontrolled).
   * @default []
   */
  defaultValue?: string[];
  /** A signal with the tags array (controlled). */
  'bind:value'?: Signal<string[]>;
  /** Called when the tags array changes. */
  onValueChange$?: QRL<(value: string[]) => void>;
  /**
   * The delimiter character that splits and commits tags while typing or pasting.
   * @default ','
   */
  delimiter?: string;
  /** Maximum number of tags allowed. */
  max?: number;
  /**
   * Whether duplicate tag values are allowed.
   * @default false
   */
  allowDuplicates?: boolean;
  /**
   * Whether existing tags can be edited inline via double-click or `Enter`/`F2`.
   * @default true
   */
  editable?: boolean;
  /**
   * Whether pasting text splits on the delimiter/newlines and adds tags automatically.
   * @default false
   */
  addOnPaste?: boolean;
  /**
   * Disables the tags input. Inside a Field or Fieldset, the inherited `disabled` also applies.
   * @default false
   */
  disabled?: boolean;
  /**
   * Marks the tags input as read-only. Inside a Field, the Field's `readOnly` also applies.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Marks the tags input as required. Inside a Field, the Field's `required` also applies.
   * @default false
   */
  required?: boolean;
  /**
   * Marks the tags input as invalid. Inside a Field, the Field's `invalid` also applies.
   * @default false
   */
  invalid?: boolean;
};

/**
 * Root container for the TagsInput component.
 *
 * Renders `<div role="group">`, manages the tag array state (controlled or uncontrolled),
 * integrates with `Field` via `useFieldControl`, and coordinates keyboard navigation,
 * inline editing, paste handling, and screen reader announcements.
 */
export const TagsInputRoot = component$<TagsInputRootProps>((props) => {
  const {
    ids: propIds,
    defaultValue = [],
    'bind:value': bindValue,
    onValueChange$,
    delimiter: _delimiter,
    max: _max,
    allowDuplicates: _allowDuplicates,
    editable: _editable,
    addOnPaste: _addOnPaste,
    disabled: _disabled,
    readOnly: _readOnly,
    required: _required,
    invalid: _invalid,
    ...restProps
  } = props;

  const internalRootRef = useSignal<HTMLElement>();
  const rootRef = (props.ref as Signal<HTMLElement | undefined> | undefined) ?? internalRootRef;
  const inputRef = useSignal<HTMLInputElement>();

  const [tags, setTags$, resetControllable$] = useControllableState<string[]>({
    value: bindValue,
    defaultValue: defaultValue ?? [],
    onChange$: onValueChange$,
  });

  const highlightedIndex = useSignal<number | null>(null);
  const editingIndex = useSignal<number | null>(null);
  const editText = useSignal('');
  const inputValue = useSignal('');

  const field = useFieldContext();
  const control = useFieldControl(props);
  const base = useId();
  const ids: TagsInputIds = {
    root: props.id ?? propIds?.root ?? `${base}-root`,
    label: field ? field.ids.label : (propIds?.label ?? `${base}-label`),
    control: propIds?.control ?? `${base}-control`,
    input: field ? field.ids.control : (propIds?.input ?? `${base}-input`),
  };

  const delimiterSignal = useComputed$(() => props.delimiter ?? ',');
  const maxSignal = useComputed$(() => props.max);
  const allowDuplicatesSignal = useComputed$(() => Boolean(props.allowDuplicates));
  const editableSignal = useComputed$(() => props.editable ?? true);
  const addOnPasteSignal = useComputed$(() => Boolean(props.addOnPaste));

  const disabledSignal = useComputed$(() => control.value.disabled);
  const readOnlySignal = useComputed$(() => control.value.readOnly);
  const requiredSignal = useComputed$(() => control.value.required);
  const invalidSignal = useComputed$(() => control.value.invalid);
  const describedBySignal = useComputed$(() => control.value.describedBy);

  const addTag$ = $(async (raw: string): Promise<boolean> => {
    if (disabledSignal.value || readOnlySignal.value) return false;
    const trimmed = raw.trim();
    if (!trimmed) return false;

    const current = tags.value;
    if (maxSignal.value !== undefined && current.length >= maxSignal.value) {
      return false;
    }
    if (!allowDuplicatesSignal.value && current.includes(trimmed)) {
      return false;
    }

    await setTags$([...current, trimmed]);
    announce(`Added tag ${trimmed}`);
    return true;
  });

  const addTags$ = $(async (rawItems: string[]): Promise<void> => {
    if (disabledSignal.value || readOnlySignal.value) return;
    const next = [...tags.value];
    const added: string[] = [];

    for (const raw of rawItems) {
      const trimmed = raw.trim();
      if (!trimmed) continue;
      if (maxSignal.value !== undefined && next.length >= maxSignal.value) break;
      if (!allowDuplicatesSignal.value && next.includes(trimmed)) continue;
      next.push(trimmed);
      added.push(trimmed);
    }

    if (added.length === 0) return;
    await setTags$(next);
    if (added.length === 1) {
      announce(`Added tag ${added[0]}`);
    } else {
      announce(`Added ${added.length} tags`);
    }
  });

  const removeTagAt$ = $(async (index: number): Promise<void> => {
    if (disabledSignal.value || readOnlySignal.value) return;
    const current = tags.value;
    if (index < 0 || index >= current.length) return;

    const removed = current[index];
    const next = [...current.slice(0, index), ...current.slice(index + 1)];
    if (editingIndex.value === index) {
      editingIndex.value = null;
    } else if (editingIndex.value !== null && editingIndex.value > index) {
      editingIndex.value = editingIndex.value - 1;
    }

    await setTags$(next);
    announce(`Removed tag ${removed}`);
  });

  const clearTags$ = $(async (): Promise<void> => {
    if (disabledSignal.value || readOnlySignal.value) return;
    if (tags.value.length === 0) return;

    highlightedIndex.value = null;
    editingIndex.value = null;
    await setTags$([]);
    announce('Cleared all tags');
    inputRef.value?.focus();
  });

  const startEdit$ = $((index: number): void => {
    if (!editableSignal.value || disabledSignal.value || readOnlySignal.value) return;
    const current = tags.value[index];
    if (current === undefined) return;
    highlightedIndex.value = index;
    editingIndex.value = index;
    editText.value = current;
  });

  const commitEdit$ = $(async (index: number, nextValue: string): Promise<void> => {
    if (editingIndex.value !== index) return;
    const current = tags.value;
    const previous = current[index];
    editingIndex.value = null;
    highlightedIndex.value = null;

    if (previous === undefined) return;
    const trimmed = nextValue.trim();

    if (!trimmed) {
      const next = [...current.slice(0, index), ...current.slice(index + 1)];
      await setTags$(next);
      announce(`Removed tag ${previous}`);
      return;
    }

    if (trimmed === previous) return;

    if (!allowDuplicatesSignal.value && current.some((t, i) => i !== index && t === trimmed)) {
      return;
    }

    const next = [...current];
    next[index] = trimmed;
    await setTags$(next);
    announce(`Updated tag to ${trimmed}`);
  });

  const cancelEdit$ = $((): void => {
    editingIndex.value = null;
    highlightedIndex.value = null;
  });

  const focusInput$ = $((): void => {
    if (disabledSignal.value) return;
    inputRef.value?.focus();
  });

  const reset$ = $(async (): Promise<void> => {
    highlightedIndex.value = null;
    editingIndex.value = null;
    inputValue.value = '';
    if (inputRef.value) {
      inputRef.value.value = '';
    }
    await resetControllable$();
  });

  useContextProvider(tagsInputContextId, {
    ids,
    rootRef,
    inputRef,
    tags,
    highlightedIndex,
    editingIndex,
    editText,
    inputValue,
    delimiter: delimiterSignal,
    max: maxSignal,
    allowDuplicates: allowDuplicatesSignal,
    editable: editableSignal,
    addOnPaste: addOnPasteSignal,
    disabled: disabledSignal,
    readOnly: readOnlySignal,
    required: requiredSignal,
    invalid: invalidSignal,
    describedBy: describedBySignal,
    hasField: field !== null,
    addTag$,
    addTags$,
    removeTagAt$,
    clearTags$,
    startEdit$,
    commitEdit$,
    cancelEdit$,
    focusInput$,
    reset$,
  });

  const ariaLabelledby = props['aria-labelledby'] ?? (props['aria-label'] ? undefined : ids.label);
  const state = tags.value.length > 0 ? 'has-tags' : 'empty';

  return (
    // biome-ignore lint/a11y/useSemanticElements: TagsInput.Root uses <div role="group"> per specification rather than <fieldset>
    <div
      {...restProps}
      ref={rootRef}
      id={ids.root}
      role="group"
      aria-labelledby={ariaLabelledby}
      aria-describedby={describedBySignal.value}
      aria-invalid={invalidSignal.value ? 'true' : undefined}
      aria-disabled={disabledSignal.value ? 'true' : undefined}
      data-leve-tags-input=""
      data-state={state}
      data-disabled={dataAttr(disabledSignal.value)}
      data-readonly={dataAttr(readOnlySignal.value)}
      data-invalid={dataAttr(invalidSignal.value)}
      data-highlighted-index={
        highlightedIndex.value !== null ? String(highlightedIndex.value) : undefined
      }
    >
      <Slot />
    </div>
  );
});
