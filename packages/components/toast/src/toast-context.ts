import { createContextId, type QRL, type ReadonlySignal, type Signal } from '@builder.io/qwik';

/**
 * How urgent a toast is.
 * - `'foreground'`: from a user action (e.g. "Saved"). Screen readers announce it right away.
 * - `'background'`: from a background task (e.g. "Sync finished"). Announced after the current speech.
 */
export type ToastType = 'foreground' | 'background';

/** Where the Region is placed. The library only outputs it as `data-placement`; place it with CSS. */
export type ToastPlacement =
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end';

export type ToastSwipeDirection = 'up' | 'down' | 'left' | 'right';

/** What `add$` and `update$` take. */
export interface ToastOptions<T = unknown> {
  title?: string;
  description?: string;
  /** @default 'foreground' */
  type?: ToastType;
  /** How long the toast stays, in ms. `Infinity` keeps it until it is closed. Defaults to the Provider's. */
  duration?: number;
  /** Your own data for rendering the toast, e.g. the undo target. It must be serializable. */
  data?: T;
}

/** A toast in `useToaster().toasts`. */
export interface ToastData<T = unknown> extends ToastOptions<T> {
  id: string;
  type: ToastType;
  /** `false` while the toast is closing; it is removed after its exit animation */
  open: boolean;
}

/** Returned by `useToaster()`. */
export interface Toaster<T = unknown> {
  /** The toasts, oldest first. Render one `Toast.Root` for each. */
  toasts: ReadonlySignal<ToastData<T>[]>;
  /** Adds a toast and returns its id. */
  add$: QRL<(options: ToastOptions<T>) => string>;
  /** Changes a toast, for example from "Uploading" to "Uploaded". */
  update$: QRL<(id: string, options: ToastOptions<T>) => void>;
  /** Closes a toast, or all of them when no id is given. */
  dismiss$: QRL<(id?: string) => void>;
}

export interface ToastProviderContext extends Toaster {
  /** Removes a toast from the list after its exit animation. */
  remove$: QRL<(id: string) => void>;
  duration: ReadonlySignal<number>;
  placement: ReadonlySignal<ToastPlacement>;
  swipeDirection: ReadonlySignal<ToastSwipeDirection>;
  swipeThreshold: ReadonlySignal<number>;
  hotkey: ReadonlySignal<string[]>;
  /** The measured height of each toast, for the stacking CSS variables */
  heights: Signal<Record<string, number>>;
  /** The pointer is over the Region, or focus is in it: the stack is expanded and timers pause */
  hovered: Signal<boolean>;
  focused: Signal<boolean>;
  /** The window is not focused: timers pause */
  windowBlurred: Signal<boolean>;
  /** A toast is being swiped: timers pause */
  swiping: Signal<boolean>;
}

export const toastProviderContextId = createContextId<ToastProviderContext>('leve-ui.toast');

export interface ToastContext {
  id: string;
}

export const toastContextId = createContextId<ToastContext>('leve-ui.toast-root');
