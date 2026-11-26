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
  useTask$,
  useVisibleTask$,
} from '@builder.io/qwik';
import { dataAttr, useControllableState, useFieldContext, useFieldControl } from '@leve-ui/utils';
import {
  type EditableActivationMode,
  type EditableIds,
  type EditableSubmitMode,
  editableContextId,
  skipNextPreviewFocusElements,
} from './editable-context';

export type EditableRootProps = PropsOf<'div'> & {
  /** Overrides the element IDs of the parts. Only used outside a Field. */
  ids?: Partial<EditableIds>;
  /**
   * The initial committed value when uncontrolled.
   * @default ''
   */
  defaultValue?: string;
  /** A signal with the committed value (controlled). */
  'bind:value'?: Signal<string>;
  /** Called when the committed value changes. */
  onValueChange$?: QRL<(value: string) => void>;
  /**
   * Whether the editable starts in edit mode when uncontrolled.
   * @default false
   */
  defaultEdit?: boolean;
  /** A signal with the edit mode state (controlled). */
  'bind:edit'?: Signal<boolean>;
  /** Called when the edit mode state changes. */
  onEditChange$?: QRL<(edit: boolean) => void>;
  /** Called when the draft value is committed. */
  onValueCommit$?: QRL<(value: string) => void>;
  /** Called when editing is cancelled and the draft reverts to the committed value. */
  onValueRevert$?: QRL<(value: string) => void>;
  /**
   * How the user enters edit mode from the preview.
   * @default 'focus'
   */
  activationMode?: EditableActivationMode;
  /**
   * How edits are committed from the input.
   * @default 'both'
   */
  submitMode?: EditableSubmitMode;
  /**
   * Whether to select all text in the input when entering edit mode.
   * @default true
   */
  selectOnFocus?: boolean;
  /** Placeholder text shown when the value is empty. */
  placeholder?: string;
  /**
   * Whether to render a `<textarea>` instead of `<input>` in edit mode.
   * @default false
   */
  multiline?: boolean;
  /**
   * Disables editing and interaction. Inside a Field, the Field's `disabled` also applies.
   * @default false
   */
  disabled?: boolean;
  /**
   * Marks the editable as read-only. Inside a Field, the Field's `readOnly` also applies.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Marks the input as required. Inside a Field, the Field's `required` also applies.
   * @default false
   */
  required?: boolean;
  /**
   * Marks the editable as invalid. Inside a Field, the Field's `invalid` also applies.
   * @default false
   */
  invalid?: boolean;
};

/**
 * Root container for the Editable component.
 *
 * Manages committed `value`, transient `draftValue`, and `edit` state, wires Field
 * context when inside `Field.Root`, and coordinates focus transitions between
 * `Preview`, `Input`, and `EditTrigger`.
 */
export const EditableRoot = component$<EditableRootProps>((props) => {
  const {
    ids: propIds,
    defaultValue = '',
    'bind:value': bindValue,
    onValueChange$,
    defaultEdit = false,
    'bind:edit': bindEdit,
    onEditChange$,
    onValueCommit$,
    onValueRevert$,
    activationMode: _activationMode,
    submitMode: _submitMode,
    selectOnFocus: _selectOnFocus,
    placeholder: _placeholder,
    multiline: _multiline,
    disabled: _disabled,
    readOnly: _readOnly,
    required: _required,
    invalid: _invalid,
    ...restProps
  } = props;

  const [value, setValue$, resetValue$] = useControllableState({
    value: bindValue,
    defaultValue: defaultValue ?? '',
    onChange$: onValueChange$,
  });

  const [isEditing, setIsEditing$, resetEdit$] = useControllableState({
    value: bindEdit,
    defaultValue: defaultEdit ?? false,
    onChange$: onEditChange$,
  });

  const draftValue = useSignal<string>(value.value);
  const prevEditing = useSignal<boolean>(isEditing.value);

  useTask$(({ track }) => {
    const currentValue = track(() => value.value);
    const editing = track(() => isEditing.value);
    if (!editing || (!prevEditing.value && editing)) {
      draftValue.value = currentValue;
    }
    prevEditing.value = editing;
  });

  const field = useFieldContext();
  const control = useFieldControl(props);
  const base = useId();
  const ids: EditableIds = field
    ? {
        input: field.ids.control,
        label: field.ids.label,
        preview: propIds?.preview ?? `${base}-preview`,
      }
    : {
        input: propIds?.input ?? `${base}-input`,
        label: propIds?.label ?? `${base}-label`,
        preview: propIds?.preview ?? `${base}-preview`,
      };

  const activationModeSignal = useComputed$<EditableActivationMode>(
    () => props.activationMode ?? 'focus',
  );
  const submitModeSignal = useComputed$<EditableSubmitMode>(() => props.submitMode ?? 'both');
  const selectOnFocusSignal = useComputed$<boolean>(() => props.selectOnFocus ?? true);
  const placeholderSignal = useComputed$<string | undefined>(() => props.placeholder);
  const multilineSignal = useComputed$<boolean>(() => Boolean(props.multiline));
  const disabledSignal = useComputed$<boolean>(() => control.value.disabled);
  const readOnlySignal = useComputed$<boolean>(() => control.value.readOnly);
  const requiredSignal = useComputed$<boolean>(() => control.value.required);
  const invalidSignal = useComputed$<boolean>(() => control.value.invalid);
  const describedBySignal = useComputed$<string | undefined>(() => control.value.describedBy);

  const rootRef = useSignal<HTMLDivElement>();
  const pendingFocus = useSignal<'input' | 'restore' | null>(null);

  // biome-ignore lint/correctness/noQwikUseVisibleTask: Focus and text selection must run after Qwik updates `hidden` attributes in the DOM.
  useVisibleTask$(
    ({ track }) => {
      const editing = track(() => isEditing.value);
      const target = track(() => pendingFocus.value);
      if (!target) return;

      const root = rootRef.value;
      if (!root) return;

      if (editing && target === 'input') {
        pendingFocus.value = null;
        const input = root.querySelector<HTMLInputElement | HTMLTextAreaElement>(
          '[data-leve-editable-input]',
        );
        if (input) {
          input.focus?.();
          if (selectOnFocusSignal.value && typeof input.select === 'function') {
            input.select();
          }
        }
        return;
      }

      if (!editing && target === 'restore') {
        pendingFocus.value = null;
        const editTrigger = root.querySelector<HTMLButtonElement>(
          '[data-leve-editable-edit-trigger]',
        );
        if (editTrigger && !editTrigger.disabled) {
          editTrigger.focus?.();
          return;
        }
        const preview = root.querySelector<HTMLElement>('[data-leve-editable-preview]');
        if (preview && preview.tabIndex >= 0) {
          skipNextPreviewFocusElements.add(preview);
          preview.focus?.();
          if (preview.ownerDocument.activeElement !== preview) {
            skipNextPreviewFocusElements.delete(preview);
          }
        }
      }
    },
    { strategy: 'document-ready' },
  );

  const startEdit$ = $(async () => {
    if (disabledSignal.value || readOnlySignal.value) return;
    draftValue.value = value.value;
    pendingFocus.value = 'input';
    await setIsEditing$(true);
  });

  const commit$ = $(async (restoreFocus = false) => {
    if (disabledSignal.value || readOnlySignal.value) return;
    const nextValue = draftValue.value;
    await setValue$(nextValue);
    await onValueCommit$?.(nextValue);
    if (restoreFocus) {
      pendingFocus.value = 'restore';
    }
    await setIsEditing$(false);
  });

  const cancel$ = $(async (restoreFocus = false) => {
    draftValue.value = value.value;
    await onValueRevert$?.(value.value);
    if (restoreFocus) {
      pendingFocus.value = 'restore';
    }
    await setIsEditing$(false);
  });

  const resetForm$ = $(async () => {
    pendingFocus.value = null;
    await resetValue$();
    await resetEdit$();
    draftValue.value = value.value;
  });

  useContextProvider(editableContextId, {
    ids,
    value,
    draftValue,
    isEditing,
    activationMode: activationModeSignal,
    submitMode: submitModeSignal,
    selectOnFocus: selectOnFocusSignal,
    placeholder: placeholderSignal,
    multiline: multilineSignal,
    disabled: disabledSignal,
    readOnly: readOnlySignal,
    required: requiredSignal,
    invalid: invalidSignal,
    describedBy: describedBySignal,
    startEdit$,
    commit$,
    cancel$,
    resetForm$,
  });

  return (
    <div
      {...restProps}
      ref={rootRef}
      data-leve-editable=""
      data-state={isEditing.value ? 'edit' : 'preview'}
      data-empty={dataAttr(value.value.length === 0)}
      data-disabled={dataAttr(disabledSignal.value)}
      data-readonly={dataAttr(readOnlySignal.value)}
      data-invalid={dataAttr(invalidSignal.value)}
    >
      <Slot />
    </div>
  );
});
