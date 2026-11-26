import { createContextId, type QRL, type ReadonlySignal, type Signal } from '@builder.io/qwik';

export type EditableActivationMode = 'focus' | 'dblclick' | 'click' | 'none';
export type EditableSubmitMode = 'enter' | 'blur' | 'both' | 'none';

export interface EditableIds {
  /** ID of the input/textarea element. */
  input: string;
  /** ID of the label element. */
  label: string;
  /** ID of the preview element. */
  preview: string;
}

export interface EditableContext {
  ids: EditableIds;
  value: ReadonlySignal<string>;
  draftValue: Signal<string>;
  isEditing: ReadonlySignal<boolean>;
  activationMode: ReadonlySignal<EditableActivationMode>;
  submitMode: ReadonlySignal<EditableSubmitMode>;
  selectOnFocus: ReadonlySignal<boolean>;
  placeholder: ReadonlySignal<string | undefined>;
  multiline: ReadonlySignal<boolean>;
  disabled: ReadonlySignal<boolean>;
  readOnly: ReadonlySignal<boolean>;
  required: ReadonlySignal<boolean>;
  invalid: ReadonlySignal<boolean>;
  describedBy: ReadonlySignal<string | undefined>;
  startEdit$: QRL<() => Promise<void>>;
  commit$: QRL<(restoreFocus?: boolean) => Promise<void>>;
  cancel$: QRL<(restoreFocus?: boolean) => Promise<void>>;
  resetForm$: QRL<() => Promise<void>>;
}

export const editableContextId = createContextId<EditableContext>('leve-ui.editable');

/**
 * Tracks preview elements whose next focus event is a programmatic focus restoration
 * so `activationMode="focus"` does not immediately re-enter edit mode.
 */
export const skipNextPreviewFocusElements = new WeakSet<HTMLElement>();
