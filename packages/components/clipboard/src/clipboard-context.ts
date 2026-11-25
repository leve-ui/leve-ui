import { createContextId, type QRL, type ReadonlySignal } from '@builder.io/qwik';

export type ClipboardContext = {
  value: ReadonlySignal<string>;
  copied: ReadonlySignal<boolean>;
  copy$: QRL<() => Promise<void>>;
};

export const clipboardContextId = createContextId<ClipboardContext>('leve-ui.clipboard');
