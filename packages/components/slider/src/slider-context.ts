import { createContextId, type QRL, type ReadonlySignal, type Signal } from '@builder.io/qwik';

export interface SliderIds {
  /** ID of the primary slider thumb (`index === 0`). */
  control: string;
}

export interface SliderContext {
  controlId: ReadonlySignal<string>;
  inField: boolean;
  labelId: ReadonlySignal<string | undefined>;
  describedBy: ReadonlySignal<string | undefined>;
  values: Signal<number[]>;
  min: ReadonlySignal<number>;
  max: ReadonlySignal<number>;
  step: ReadonlySignal<number>;
  largeStep: ReadonlySignal<number>;
  minStepsBetweenThumbs: ReadonlySignal<number>;
  orientation: ReadonlySignal<'horizontal' | 'vertical'>;
  disabled: ReadonlySignal<boolean>;
  readOnly: ReadonlySignal<boolean>;
  required: ReadonlySignal<boolean>;
  invalid: ReadonlySignal<boolean>;
  activeThumb: Signal<number | null>;
  rootRef: Signal<HTMLElement | undefined>;
  trackRef: Signal<HTMLElement | undefined>;
  setValues$: QRL<(nextValues: number[]) => void>;
  commit$: QRL<(finalValues: number[]) => void>;
  reset$: QRL<() => void>;
}

export const sliderContextId = createContextId<SliderContext>('leve-ui.slider');
