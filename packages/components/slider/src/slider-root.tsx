import {
  $,
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useComputed$,
  useContextProvider,
  useSignal,
  useTask$,
} from '@builder.io/qwik';
import { dataAttr, useControllableState, useFieldContext, useFieldControl } from '@leve-ui/utils';
import { type SliderIds, sliderContextId } from './slider-context';
import { cleanupActiveSliderDrag } from './slider-utils';

export type SliderRootProps = PropsOf<'div'> & {
  /** Overrides the element IDs of the parts. Inside a Field, the Field's IDs are used instead. */
  ids?: Partial<SliderIds>;
  /**
   * The initial value(s) of the slider (uncontrolled).
   * @default [min]
   */
  defaultValue?: number[];
  /** A signal with the current slider value(s) (controlled). */
  'bind:value'?: Signal<number[]>;
  /** Called when the slider value(s) change during dragging or keyboard interaction. */
  onValueChange$?: QRL<(value: number[]) => void>;
  /** Called when the user commits a value change (on pointerup or keyboard interaction). */
  onValueCommit$?: QRL<(value: number[]) => void>;
  /**
   * The minimum value of the slider.
   * @default 0
   */
  min?: number;
  /**
   * The maximum value of the slider.
   * @default 100
   */
  max?: number;
  /**
   * The stepping interval for value changes.
   * @default 1
   */
  step?: number;
  /**
   * The stepping interval for `PageUp` and `PageDown` keys.
   * @default step * 10
   */
  largeStep?: number;
  /**
   * The minimum permitted steps between multiple thumbs.
   * @default 0
   */
  minStepsBetweenThumbs?: number;
  /**
   * The orientation of the slider.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Disables the slider and prevents interaction. Inside a Field, the Field's `disabled` also applies.
   * @default false
   */
  disabled?: boolean;
  /**
   * Makes the slider read-only while keeping thumbs focusable.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Marks the slider as required for form submission.
   * @default false
   */
  required?: boolean;
  /**
   * Marks the slider as invalid.
   * @default false
   */
  invalid?: boolean;
};

/**
 * Root container for a single-thumb or multi-thumb slider.
 *
 * Follows the WAI-ARIA APG Slider and Multi-Thumb Slider patterns,
 * managing value state, step precision, orientation, drag state,
 * and integration with `Field` and native `<form>`.
 */
export const SliderRoot = component$<SliderRootProps>((props) => {
  const {
    ids: propIds,
    defaultValue,
    'bind:value': bindValue,
    onValueChange$,
    onValueCommit$,
    min: _min,
    max: _max,
    step: _step,
    largeStep: _largeStep,
    minStepsBetweenThumbs: _minStepsBetweenThumbs,
    orientation: _orientation,
    disabled: _disabled,
    readOnly: _readOnly,
    required: _required,
    invalid: _invalid,
    ...restProps
  } = props;

  const initialMin = props.min ?? 0;
  const [values, setValues$, reset$] = useControllableState<number[]>({
    value: bindValue,
    defaultValue: defaultValue ?? [initialMin],
    onChange$: onValueChange$,
  });

  const field = useFieldContext();
  const control = useFieldControl(props);

  const controlIdSignal = useComputed$(() =>
    field ? field.ids.control : (propIds?.control ?? control.value.id),
  );
  const labelIdSignal = useComputed$(() => control.value.labelId);
  const describedBySignal = useComputed$(() => control.value.describedBy);
  const minSignal = useComputed$(() => props.min ?? 0);
  const maxSignal = useComputed$(() => props.max ?? 100);
  const stepSignal = useComputed$(() => props.step ?? 1);
  const largeStepSignal = useComputed$(() => props.largeStep ?? (props.step ?? 1) * 10);
  const minStepsBetweenThumbsSignal = useComputed$(() => props.minStepsBetweenThumbs ?? 0);
  const orientationSignal = useComputed$(() => props.orientation ?? 'horizontal');
  const disabledSignal = useComputed$(() => control.value.disabled);
  const readOnlySignal = useComputed$(() => control.value.readOnly);
  const requiredSignal = useComputed$(() => control.value.required);
  const invalidSignal = useComputed$(() => control.value.invalid);

  const activeThumb = useSignal<number | null>(null);
  const rootRef = useSignal<HTMLElement>();
  const trackRef = useSignal<HTMLElement>();

  useTask$(({ cleanup }) => {
    cleanup(() => {
      cleanupActiveSliderDrag();
    });
  });

  const commit$ = $(async (finalValues: number[]) => {
    if (onValueCommit$) {
      await onValueCommit$(finalValues);
    }
  });

  useContextProvider(sliderContextId, {
    controlId: controlIdSignal,
    inField: Boolean(field),
    labelId: labelIdSignal,
    describedBy: describedBySignal,
    values,
    min: minSignal,
    max: maxSignal,
    step: stepSignal,
    largeStep: largeStepSignal,
    minStepsBetweenThumbs: minStepsBetweenThumbsSignal,
    orientation: orientationSignal,
    disabled: disabledSignal,
    readOnly: readOnlySignal,
    required: requiredSignal,
    invalid: invalidSignal,
    activeThumb,
    rootRef,
    trackRef,
    setValues$,
    commit$,
    reset$,
  });

  const isDragging = activeThumb.value !== null;

  return (
    <div
      {...restProps}
      ref={rootRef}
      data-leve-slider=""
      data-orientation={orientationSignal.value}
      data-state={isDragging ? 'dragging' : 'idle'}
      data-disabled={dataAttr(disabledSignal.value)}
      data-readonly={dataAttr(readOnlySignal.value)}
      data-invalid={dataAttr(invalidSignal.value)}
    >
      <Slot />
    </div>
  );
});
