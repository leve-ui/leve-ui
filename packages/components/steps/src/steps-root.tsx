import {
  $,
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useComputed$,
  useContextProvider,
} from '@builder.io/qwik';
import { clamp, useControllableState } from '@leve-ui/utils';
import { type StepsOrientation, stepsContextId } from './steps-context';

export type StepsRootProps = PropsOf<'div'> & {
  /** Total number of steps. Used to clamp the active step and disable `NextTrigger` on the last step. */
  count: number;
  /**
   * Initial 0-based step index when uncontrolled.
   * @default 0
   */
  defaultStep?: number;
  /** A signal holding the current 0-based step index (controlled). */
  'bind:step'?: Signal<number>;
  /** Called when the active step changes. */
  onStepChange$?: QRL<(step: number) => void>;
  /**
   * When `true`, prevents jumping ahead to upcoming steps via `Trigger`.
   * @default false
   */
  linear?: boolean;
  /**
   * The layout orientation of the steps list.
   * @default 'horizontal'
   */
  orientation?: StepsOrientation;
};

function normalizeCount(count: number): number {
  if (!Number.isFinite(count)) return 0;
  return Math.max(0, Math.floor(count));
}

function clampStep(step: number, count: number): number {
  const total = normalizeCount(count);
  const max = Math.max(0, total - 1);
  if (!Number.isFinite(step)) return 0;
  return clamp(Math.floor(step), 0, max);
}

/**
 * Root container for the Steps component.
 *
 * There is no dedicated WAI-ARIA APG pattern for Steps, so this component uses
 * semantic HTML ordered list markup (`<ol>` in `Steps.List` and `<li>` in `Steps.Item`)
 * with `aria-current="step"` on the active step item.
 */
export const StepsRoot = component$<StepsRootProps>((allProps) => {
  const {
    count: _count,
    defaultStep = 0,
    'bind:step': bindStep,
    onStepChange$,
    // Read from allProps below; removed so that they are not rendered as attributes
    linear: _linear,
    orientation: _orientation,
    ...restProps
  } = allProps;

  const countSignal = useComputed$(() => normalizeCount(allProps.count));
  const linearSignal = useComputed$(() => Boolean(allProps.linear));
  const orientationSignal = useComputed$(() => allProps.orientation ?? 'horizontal');

  const [rawStep, setRawStep$] = useControllableState<number>({
    value: bindStep,
    defaultValue: clampStep(defaultStep, allProps.count),
    onChange$: onStepChange$,
  });

  const step = useComputed$(() => clampStep(rawStep.value, countSignal.value));

  const setStep$ = $(async (nextStep: number) => {
    await setRawStep$(clampStep(nextStep, countSignal.value));
  });

  useContextProvider(stepsContextId, {
    step,
    count: countSignal,
    linear: linearSignal,
    orientation: orientationSignal,
    setStep$,
  });

  return (
    <div {...restProps} data-leve-steps="" data-orientation={orientationSignal.value}>
      <Slot />
    </div>
  );
});
