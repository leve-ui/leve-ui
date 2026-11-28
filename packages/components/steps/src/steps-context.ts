import { createContextId, type QRL, type ReadonlySignal } from '@builder.io/qwik';

export type StepsOrientation = 'horizontal' | 'vertical';

export type StepsItemState = 'complete' | 'current' | 'upcoming';

export interface StepsContext {
  step: ReadonlySignal<number>;
  count: ReadonlySignal<number>;
  linear: ReadonlySignal<boolean>;
  orientation: ReadonlySignal<StepsOrientation>;
  setStep$: QRL<(step: number) => Promise<void>>;
}

export interface StepsItemContext {
  index: ReadonlySignal<number>;
  state: ReadonlySignal<StepsItemState>;
  disabled: ReadonlySignal<boolean>;
}

export const stepsContextId = createContextId<StepsContext>('leve-ui.steps');

export const stepsItemContextId = createContextId<StepsItemContext>('leve-ui.steps-item');
