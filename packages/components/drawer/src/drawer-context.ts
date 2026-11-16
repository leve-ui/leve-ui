import { createContextId, type QRL, type ReadonlySignal } from '@builder.io/qwik';

export interface DrawerIds {
  trigger: string;
  content: string;
  title: string;
  description: string;
}

export type DrawerSide = 'top' | 'right' | 'bottom' | 'left';

export interface DrawerContext {
  ids: DrawerIds;
  open: ReadonlySignal<boolean>;
  setOpen$: QRL<(open: boolean) => Promise<void>>;
  modal: ReadonlySignal<boolean>;
  side: ReadonlySignal<DrawerSide>;
}

export const drawerContextId = createContextId<DrawerContext>('leve-ui.drawer');
