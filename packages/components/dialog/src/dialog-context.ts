import { createContextId, type QRL, type ReadonlySignal } from '@builder.io/qwik';

export interface DialogIds {
  trigger: string;
  content: string;
  title: string;
  description: string;
}

export interface DialogContext {
  ids: DialogIds;
  open: ReadonlySignal<boolean>;
  setOpen$: QRL<(open: boolean) => Promise<void>>;
}

export const dialogContextId = createContextId<DialogContext>('leve-ui.dialog');
