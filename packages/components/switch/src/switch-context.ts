import { createContextId, type QRL, type ReadonlySignal } from '@builder.io/qwik';

export interface SwitchIds {
  control: string;
  label: string;
}

export interface SwitchContext {
  ids: SwitchIds;
  checked: ReadonlySignal<boolean>;
  disabled: ReadonlySignal<boolean>; // Root disabled || Field disabled
  required: ReadonlySignal<boolean>; // Root required || Field required
  toggle$: QRL<() => void>; // no-op when disabled
}

export const switchContextId = createContextId<SwitchContext>('leve-ui.switch');
