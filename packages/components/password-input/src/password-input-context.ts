import { createContextId, type QRL, type ReadonlySignal } from '@builder.io/qwik';

/** Element IDs of the PasswordInput parts. */
export interface PasswordInputIds {
  /** The `id` of the `<input>` element. */
  input: string;
}

/** Context shared across PasswordInput parts. */
export interface PasswordInputContext {
  ids: PasswordInputIds;
  visible: ReadonlySignal<boolean>;
  disabled: ReadonlySignal<boolean>;
  readOnly: ReadonlySignal<boolean>;
  required: ReadonlySignal<boolean>;
  invalid: ReadonlySignal<boolean>;
  toggle$: QRL<() => void>;
}

export const passwordInputContextId =
  createContextId<PasswordInputContext>('leve-ui.password-input');
