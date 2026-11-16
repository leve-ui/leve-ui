import { createContextId, type QRL, type ReadonlySignal, type Signal } from '@builder.io/qwik';

export interface HoverCardIds {
  trigger: string;
  content: string;
}

export interface HoverCardContext {
  ids: HoverCardIds;
  open: ReadonlySignal<boolean>;
  setOpen$: QRL<(open: boolean) => Promise<void>>;
  /** Opens after `openDelay` (pointer), or at once with `immediate` (focus) */
  show$: QRL<(immediate: boolean) => void>;
  /** Closes after `closeDelay` (pointer), or at once with `immediate` (blur, press) */
  hide$: QRL<(immediate: boolean) => void>;
  /** Cancels a pending open or close */
  cancel$: QRL<() => void>;
  /**
   * Whether the pointer is on the Trigger / on the Content. Kept apart, since the async handlers
   * of both elements may run in any order; pending opens and closes check them when they fire.
   */
  pointerOnTrigger: Signal<boolean>;
  pointerOnContent: Signal<boolean>;
  /** Whether the Trigger has focus. A pending open by focus checks it when it fires. */
  focused: Signal<boolean>;
}

export const hoverCardContextId = createContextId<HoverCardContext>('leve-ui.hover-card');
