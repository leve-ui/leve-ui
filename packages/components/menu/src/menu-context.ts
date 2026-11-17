import { createContextId, type QRL, type ReadonlySignal, type Signal } from '@builder.io/qwik';

export interface MenuIds {
  trigger: string;
  content: string;
}

export interface MenuContext {
  ids: MenuIds;
  open: ReadonlySignal<boolean>;
  setOpen$: QRL<(open: boolean) => Promise<void>>;
  /** The item to focus when the menu opens: the first, or the last when opened with ArrowUp */
  initialFocus: Signal<'first' | 'last'>;
  /** Whether arrow keys wrap around */
  loop: ReadonlySignal<boolean>;
}

export const menuContextId = createContextId<MenuContext>('leve-ui.menu');

export interface MenuGroupContext {
  labelId: string;
}

export const menuGroupContextId = createContextId<MenuGroupContext>('leve-ui.menu-group');
