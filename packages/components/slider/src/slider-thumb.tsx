import { $, component$, type PropsOf, Slot, sync$, useContext } from '@builder.io/qwik';
import { dataAttr, valueToPercent, withCssVars } from '@leve-ui/utils';
import { sliderContextId } from './slider-context';
import { clampThumbValue, getDirection, getThumbBounds, startSliderDrag } from './slider-utils';

export type SliderThumbProps = PropsOf<'span'> & {
  /**
   * Zero-based index of this thumb in `values`.
   * @default 0
   */
  index?: number;
};

/**
 * Draggable and keyboard-accessible thumb (`role="slider"`).
 *
 * Exposes `--leve-slider-thumb-percent` as a CSS custom property for positioning,
 * dynamic `aria-valuemin`/`aria-valuemax` bounds for multi-thumb sliders,
 * and full WAI-ARIA APG keyboard navigation.
 */
export const SliderThumb = component$<SliderThumbProps>((props) => {
  const { index = 0, onPointerDown$, onKeyDown$, ...restProps } = props;
  const context = useContext(sliderContextId);

  const values = context.values.value;
  const min = context.min.value;
  const max = context.max.value;
  const step = context.step.value;
  const minSteps = context.minStepsBetweenThumbs.value;
  const orientation = context.orientation.value;
  const disabled = context.disabled.value;
  const readOnly = context.readOnly.value;
  const invalid = context.invalid.value;

  const val = values[index] ?? min;
  const bounds = getThumbBounds(values, index, min, max, step, minSteps);
  const percent = valueToPercent(val, min, max);

  const preventKeyEvents = sync$((event: KeyboardEvent, element: HTMLElement) => {
    if (
      element.getAttribute('aria-disabled') === 'true' ||
      element.getAttribute('aria-readonly') === 'true'
    ) {
      return;
    }
    const key = event.key;
    if (
      key === 'ArrowRight' ||
      key === 'ArrowUp' ||
      key === 'ArrowLeft' ||
      key === 'ArrowDown' ||
      key === 'PageUp' ||
      key === 'PageDown' ||
      key === 'Home' ||
      key === 'End'
    ) {
      event.preventDefault();
    }
  });

  const internalPointerDown$ = $((event: PointerEvent, element: HTMLElement) => {
    if (context.disabled.value || context.readOnly.value) return;
    if (event.button !== 0 && event.pointerType === 'mouse') return;

    const trackEl =
      context.trackRef.value ??
      context.rootRef.value?.querySelector<HTMLElement>('[data-leve-slider-track]');
    if (!trackEl) return;

    element.focus();

    startSliderDrag({
      trackEl,
      thumbIndex: index,
      orientation: context.orientation.value,
      min: context.min.value,
      max: context.max.value,
      step: context.step.value,
      minStepsBetweenThumbs: context.minStepsBetweenThumbs.value,
      valuesSignal: context.values,
      activeThumbSignal: context.activeThumb,
      onUpdate$: context.setValues$,
      onCommit$: context.commit$,
    });
  });

  const internalKeyDown$ = $(async (event: KeyboardEvent, element: HTMLElement) => {
    if (context.disabled.value || context.readOnly.value) return;

    const currentValues = context.values.value;
    const currentVal = currentValues[index] ?? context.min.value;
    const curMin = context.min.value;
    const curMax = context.max.value;
    const curStep = context.step.value;
    const curLargeStep = context.largeStep.value;
    const curMinSteps = context.minStepsBetweenThumbs.value;
    const isRtl = getDirection(element) === 'rtl';
    const thumbBounds = getThumbBounds(currentValues, index, curMin, curMax, curStep, curMinSteps);

    let target: number | undefined;
    switch (event.key) {
      case 'ArrowRight':
        target = currentVal + (isRtl ? -curStep : curStep);
        break;
      case 'ArrowLeft':
        target = currentVal + (isRtl ? curStep : -curStep);
        break;
      case 'ArrowUp':
        target = currentVal + curStep;
        break;
      case 'ArrowDown':
        target = currentVal - curStep;
        break;
      case 'PageUp':
        target = currentVal + curLargeStep;
        break;
      case 'PageDown':
        target = currentVal - curLargeStep;
        break;
      case 'Home':
        target = thumbBounds.min;
        break;
      case 'End':
        target = thumbBounds.max;
        break;
      default:
        return;
    }

    const nextVal = clampThumbValue(
      target,
      currentValues,
      index,
      curMin,
      curMax,
      curStep,
      curMinSteps,
    );
    if (nextVal !== currentVal) {
      const nextValues = [...currentValues];
      nextValues[index] = nextVal;
      await context.setValues$(nextValues);
      await context.commit$(nextValues);
    }
  });

  const resolvedId = context.inField
    ? index === 0
      ? context.controlId.value
      : props.id
    : (props.id ?? (index === 0 ? context.controlId.value : undefined));

  const ariaLabelledby =
    props['aria-labelledby'] ??
    (props['aria-label'] ? undefined : index === 0 ? context.labelId.value : undefined);

  return (
    <span
      {...restProps}
      id={resolvedId}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-valuenow={val}
      aria-valuemin={bounds.min}
      aria-valuemax={bounds.max}
      aria-orientation={orientation}
      aria-disabled={disabled ? 'true' : undefined}
      aria-readonly={readOnly ? 'true' : undefined}
      aria-invalid={invalid ? 'true' : undefined}
      aria-labelledby={ariaLabelledby}
      aria-describedby={props['aria-describedby'] ?? context.describedBy.value}
      // Expose thumb position percentage via CSS custom property (exception per component-architecture.md)
      style={withCssVars(props.style, {
        '--leve-slider-thumb-percent': `${percent}%`,
      })}
      onPointerDown$={[internalPointerDown$, onPointerDown$]}
      onKeyDown$={[preventKeyEvents, internalKeyDown$, onKeyDown$]}
      data-leve-slider-thumb=""
      data-index={index}
      data-orientation={orientation}
      data-state={context.activeThumb.value === index ? 'dragging' : 'idle'}
      data-disabled={dataAttr(disabled)}
      data-readonly={dataAttr(readOnly)}
      data-invalid={dataAttr(invalid)}
    >
      <Slot />
    </span>
  );
});
