import { createContextId, type QRL, type ReadonlySignal } from '@builder.io/qwik';

export type CheckboxCheckedState = boolean | 'indeterminate';

export interface CheckboxIds {
  control: string;
  label: string;
}

export interface CheckboxContext {
  ids: CheckboxIds;
  checked: ReadonlySignal<CheckboxCheckedState>;
  disabled: ReadonlySignal<boolean>; // Root disabled || Field disabled
  required: ReadonlySignal<boolean>; // Root required || Field required
  toggle$: QRL<() => void>; // no-op when disabled
}

export const checkboxContextId = createContextId<CheckboxContext>('leve-ui.checkbox');

export const getCheckboxDataState = (
  checked: CheckboxCheckedState,
): 'checked' | 'unchecked' | 'indeterminate' =>
  checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked';
