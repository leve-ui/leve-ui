import { createContextId, type QRL, type ReadonlySignal, type Signal } from '@builder.io/qwik';

export interface MenuIds {
  trigger: string;
  content: string;
}

/** Where a context menu opens (`Menu.ContextTrigger`), in viewport coordinates */
export interface MenuPoint {
  x: number;
  y: number;
  /** Opened with Shift+F10 or the ContextMenu key: focus returns to the focused element on close */
  keyboard: boolean;
}

export interface MenuContext {
  ids: MenuIds;
  open: ReadonlySignal<boolean>;
  setOpen$: QRL<(open: boolean) => Promise<void>>;
  /** The item to focus when the menu opens: the first, or the last when opened with ArrowUp */
  initialFocus: Signal<'first' | 'last'>;
  /** Whether arrow keys wrap around */
  loop: ReadonlySignal<boolean>;
  /** Set by `Menu.ContextTrigger`: the menu opens at this point. `null` places it next to the Trigger. */
  point: Signal<MenuPoint | null>;
}

export const menuContextId = createContextId<MenuContext>('leve-ui.menu');

export interface MenuGroupContext {
  labelId: string;
}

export const menuGroupContextId = createContextId<MenuGroupContext>('leve-ui.menu-group');

/** Shared by the checkable items, read by `Menu.ItemIndicator`. */
export interface MenuItemIndicatorContext {
  checked: ReadonlySignal<boolean>;
}

export const menuItemIndicatorContextId = createContextId<MenuItemIndicatorContext>(
  'leve-ui.menu-item-indicator',
);

export interface MenuRadioGroupContext {
  value: ReadonlySignal<string | null>;
  setValue$: QRL<(value: string) => Promise<void>>;
}

export const menuRadioGroupContextId = createContextId<MenuRadioGroupContext>(
  'leve-ui.menu-radio-group',
);

export interface MenuSubContext {
  ids: { trigger: string; content: string };
  open: ReadonlySignal<boolean>;
  setOpen$: QRL<(open: boolean) => Promise<void>>;
  /** Opened with the keyboard: focus moves to the first item. With the pointer: focus stays. */
  focusOnOpen: Signal<boolean>;
}

export const menuSubContextId = createContextId<MenuSubContext>('leve-ui.menu-sub');
