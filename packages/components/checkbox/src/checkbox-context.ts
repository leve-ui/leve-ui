import { createContextId, type QRL, type ReadonlySignal } from '@builder.io/qwik';

export type CheckboxCheckedState = boolean | 'indeterminate';

export interface CheckboxIds {
  control: string;
  label: string;
}

export interface CheckboxGroupContext {
  value: ReadonlySignal<string[]>;
  name: ReadonlySignal<string | undefined>;
  disabled: ReadonlySignal<boolean>;
  readOnly: ReadonlySignal<boolean>;
  invalid: ReadonlySignal<boolean>;
  maxSelectedValues: ReadonlySignal<number | undefined>;
  toggleValue$: QRL<(itemValue: string) => void>;
  reset$: QRL<() => Promise<void>>;
}

export const checkboxGroupContextId =
  createContextId<CheckboxGroupContext>('leve-ui.checkbox-group');

export interface CheckboxContext {
  ids: CheckboxIds;
  checked: ReadonlySignal<CheckboxCheckedState>;
  disabled: ReadonlySignal<boolean>; // Root disabled || Group disabled || Field disabled || maxReached
  required: ReadonlySignal<boolean>; // Root required || Field required
  readOnly: ReadonlySignal<boolean>; // Root readOnly || Group readOnly || Field readOnly
  invalid: ReadonlySignal<boolean>; // Root invalid || Group invalid || Field invalid
  name: ReadonlySignal<string | undefined>;
  value: ReadonlySignal<string | undefined>;
  toggle$: QRL<() => void>; // no-op when disabled or readOnly
  reset$: QRL<() => Promise<void>>;
}

export const checkboxContextId = createContextId<CheckboxContext>('leve-ui.checkbox');

export const getCheckboxDataState = (
  checked: CheckboxCheckedState,
): 'checked' | 'unchecked' | 'indeterminate' =>
  checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked';
