import { createContextId, type QRL, type ReadonlySignal } from '@builder.io/qwik';

export interface CollapsibleIds {
  trigger: string;
  content: string;
}

export interface CollapsibleContext {
  ids: CollapsibleIds;
  open: ReadonlySignal<boolean>;
  disabled: ReadonlySignal<boolean>;
  toggle$: QRL<() => void>;
  setOpen$: QRL<(open: boolean) => Promise<void>>;
}

export const collapsibleContextId = createContextId<CollapsibleContext>('leve-ui.collapsible');
