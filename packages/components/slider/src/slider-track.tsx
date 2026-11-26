import { $, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { sliderContextId } from './slider-context';
import {
  clampThumbValue,
  findNearestThumbIndex,
  getValueFromPointer,
  startSliderDrag,
} from './slider-utils';

export type SliderTrackProps = PropsOf<'div'>;

/**
 * The track along which the slider thumb(s) move.
 *
 * Pressing pointerdown on the track jumps the nearest thumb to the pointer
 * position, focuses that thumb, and starts dragging.
 */
export const SliderTrack = component$<SliderTrackProps>((props) => {
  const { onPointerDown$, ...restProps } = props;
  const context = useContext(sliderContextId);

  const internalPointerDown$ = $(async (event: PointerEvent, element: HTMLElement) => {
    if (context.disabled.value || context.readOnly.value) return;
    if (event.button !== 0 && event.pointerType === 'mouse') return;

    // If pointerdown originated on a thumb, let the thumb handler handle it.
    if ((event.target as HTMLElement | null)?.closest('[data-leve-slider-thumb]')) {
      return;
    }

    const min = context.min.value;
    const max = context.max.value;
    const step = context.step.value;
    const minSteps = context.minStepsBetweenThumbs.value;
    const orientation = context.orientation.value;
    const currentValues = context.values.value;

    const rawValue = getValueFromPointer(
      event.clientX,
      event.clientY,
      element,
      orientation,
      min,
      max,
    );
    const thumbIndex = findNearestThumbIndex(currentValues, rawValue);
    const nextValue = clampThumbValue(
      rawValue,
      currentValues,
      thumbIndex,
      min,
      max,
      step,
      minSteps,
    );

    if (nextValue !== currentValues[thumbIndex]) {
      const nextValues = [...currentValues];
      nextValues[thumbIndex] = nextValue;
      await context.setValues$(nextValues);
    }

    const thumbEl = context.rootRef.value?.querySelector<HTMLElement>(
      `[data-leve-slider-thumb][data-index="${thumbIndex}"]`,
    );
    thumbEl?.focus();

    startSliderDrag({
      trackEl: element,
      thumbIndex,
      orientation,
      min,
      max,
      step,
      minStepsBetweenThumbs: minSteps,
      valuesSignal: context.values,
      activeThumbSignal: context.activeThumb,
      onUpdate$: context.setValues$,
      onCommit$: context.commit$,
    });
  });

  return (
    <div
      {...restProps}
      ref={context.trackRef}
      onPointerDown$={[internalPointerDown$, onPointerDown$]}
      data-leve-slider-track=""
      data-orientation={context.orientation.value}
      data-disabled={dataAttr(context.disabled.value)}
      data-readonly={dataAttr(context.readOnly.value)}
    >
      <Slot />
    </div>
  );
});
