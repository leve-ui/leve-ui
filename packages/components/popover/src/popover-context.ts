import { createContextId, type QRL, type ReadonlySignal, type Signal } from '@builder.io/qwik';

export interface PopoverIds {
  trigger: string;
  anchor: string;
  content: string;
  title: string;
  description: string;
}

export interface PopoverContext {
  ids: PopoverIds;
  open: ReadonlySignal<boolean>;
  setOpen$: QRL<(open: boolean) => Promise<void>>;
  hasAnchor: Signal<boolean>;
}

export const popoverContextId = createContextId<PopoverContext>('leve-ui.popover');
