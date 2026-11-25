import { createContextId, type QRL, type ReadonlySignal, type Signal } from '@builder.io/qwik';

/** Element IDs of the NumberInput parts. */
export interface NumberInputIds {
  /** The `id` of the `<input>` element. */
  input: string;
}

/** Context shared across NumberInput parts. */
export interface NumberInputContext {
  ids: NumberInputIds;
  hasPropInputId: boolean;
  isInField: boolean;
  value: ReadonlySignal<number | null>;
  inputText: Signal<string>;
  formattedValue: ReadonlySignal<string>;
  min: ReadonlySignal<number | undefined>;
  max: ReadonlySignal<number | undefined>;
  step: ReadonlySignal<number>;
  largeStep: ReadonlySignal<number>;
  disabled: ReadonlySignal<boolean>;
  readOnly: ReadonlySignal<boolean>;
  required: ReadonlySignal<boolean>;
  invalid: ReadonlySignal<boolean>;
  atMin: ReadonlySignal<boolean>;
  atMax: ReadonlySignal<boolean>;
  increment$: QRL<(amount?: number) => Promise<void>>;
  decrement$: QRL<(amount?: number) => Promise<void>>;
  commit$: QRL<() => Promise<void>>;
  setToMin$: QRL<() => Promise<void>>;
  setToMax$: QRL<() => Promise<void>>;
  reset$: QRL<() => Promise<void>>;
}

export const numberInputContextId = createContextId<NumberInputContext>('leve-ui.number-input');
