import { createContextId, type QRL, type ReadonlySignal, type Signal } from '@builder.io/qwik';

export type PinInputType = 'numeric' | 'alphanumeric';

export type PinInputIds = {
  root: string;
  input: string;
};

export interface PinInputContext {
  ids: PinInputIds;
  rootRef: Signal<HTMLElement | undefined>;
  values: ReadonlySignal<string[]>;
  length: ReadonlySignal<number | undefined>;
  type: ReadonlySignal<PinInputType>;
  mask: ReadonlySignal<boolean>;
  otp: ReadonlySignal<boolean>;
  placeholder: ReadonlySignal<string>;
  disabled: ReadonlySignal<boolean>;
  readOnly: ReadonlySignal<boolean>;
  required: ReadonlySignal<boolean>;
  invalid: ReadonlySignal<boolean>;
  isComplete: ReadonlySignal<boolean>;
  hasField: boolean;
  setValues$: QRL<(next: string[], totalSlots?: number) => Promise<void>>;
  setSlot$: QRL<(index: number, char: string, totalSlots?: number) => Promise<void>>;
  reset$: QRL<() => Promise<void>>;
}

export const pinInputContextId = createContextId<PinInputContext>('leve-ui.pin-input');

export function isValidPinChar(char: string, type: PinInputType): boolean {
  if (char.length !== 1) return false;
  return type === 'numeric' ? /^[0-9]$/.test(char) : /^[a-zA-Z0-9]$/.test(char);
}

export function filterPinChars(text: string, type: PinInputType): string {
  return type === 'numeric' ? text.replace(/[^0-9]/g, '') : text.replace(/[^a-zA-Z0-9]/g, '');
}
