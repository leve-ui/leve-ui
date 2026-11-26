import type { QRL, Signal } from '@builder.io/qwik';
import { clamp } from '@leve-ui/utils';

export function getDecimalPlaces(num: number): number {
  const str = String(num);
  if (str.includes('e-')) {
    const [base, exp] = str.split('e-');
    const baseDecimals = base.includes('.') ? base.split('.')[1].length : 0;
    return baseDecimals + Number(exp);
  }
  const parts = str.split('.');
  return parts[1] ? parts[1].length : 0;
}

export function roundToPrecision(value: number, step: number): number {
  const decimals = getDecimalPlaces(step);
  if (decimals === 0) return Math.round(value);
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function snapToStep(raw: number, min: number, max: number, step: number): number {
  const safeStep = step > 0 ? step : 1;
  const clamped = clamp(raw, min, max);
  const steps = Math.round((clamped - min) / safeStep);
  const snapped = roundToPrecision(min + steps * safeStep, safeStep);
  if (snapped > max) {
    const maxSteps = Math.floor((max - min) / safeStep);
    return roundToPrecision(min + maxSteps * safeStep, safeStep);
  }
  return Math.max(min, snapped);
}

export function getThumbBounds(
  values: number[],
  index: number,
  min: number,
  max: number,
  step: number,
  minStepsBetweenThumbs: number,
): { min: number; max: number } {
  const minGap = Math.max(0, minStepsBetweenThumbs) * (step > 0 ? step : 1);
  const prev = index > 0 ? values[index - 1] : undefined;
  const next = index < values.length - 1 ? values[index + 1] : undefined;
  const lower = prev !== undefined ? Math.max(min, roundToPrecision(prev + minGap, step)) : min;
  const upper = next !== undefined ? Math.min(max, roundToPrecision(next - minGap, step)) : max;
  return { min: lower, max: Math.max(lower, upper) };
}

export function clampThumbValue(
  raw: number,
  values: number[],
  index: number,
  min: number,
  max: number,
  step: number,
  minStepsBetweenThumbs: number,
): number {
  const snapped = snapToStep(raw, min, max, step);
  const bounds = getThumbBounds(values, index, min, max, step, minStepsBetweenThumbs);
  return clamp(snapped, bounds.min, bounds.max);
}

export function getDirection(el: HTMLElement): 'ltr' | 'rtl' {
  if (typeof window !== 'undefined' && typeof window.getComputedStyle === 'function') {
    return window.getComputedStyle(el).direction === 'rtl' ? 'rtl' : 'ltr';
  }
  return el.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
}

export function getValueFromPointer(
  clientX: number,
  clientY: number,
  trackEl: HTMLElement,
  orientation: 'horizontal' | 'vertical',
  min: number,
  max: number,
): number {
  const rect = trackEl.getBoundingClientRect();
  let percent = 0;
  if (orientation === 'vertical') {
    percent = rect.height > 0 ? (rect.bottom - clientY) / rect.height : 0;
  } else {
    const isRtl = getDirection(trackEl) === 'rtl';
    percent =
      rect.width > 0
        ? isRtl
          ? (rect.right - clientX) / rect.width
          : (clientX - rect.left) / rect.width
        : 0;
  }
  const clampedPercent = clamp(percent, 0, 1);
  return min + clampedPercent * (max - min);
}

export function findNearestThumbIndex(values: number[], targetValue: number): number {
  if (values.length <= 1) return 0;
  let nearestIndex = 0;
  let minDistance = Math.abs(values[0] - targetValue);

  for (let i = 1; i < values.length; i++) {
    const dist = Math.abs(values[i] - targetValue);
    if (dist < minDistance) {
      minDistance = dist;
      nearestIndex = i;
    } else if (dist === minDistance && targetValue > values[i]) {
      // Break ties in the direction of movement when thumbs overlap
      nearestIndex = i;
    }
  }
  return nearestIndex;
}

let activeDragCleanup: (() => void) | null = null;

export function cleanupActiveSliderDrag(): void {
  if (activeDragCleanup) {
    activeDragCleanup();
    activeDragCleanup = null;
  }
}

export interface StartSliderDragOptions {
  trackEl: HTMLElement;
  thumbIndex: number;
  orientation: 'horizontal' | 'vertical';
  min: number;
  max: number;
  step: number;
  minStepsBetweenThumbs: number;
  valuesSignal: Signal<number[]>;
  activeThumbSignal: Signal<number | null>;
  onUpdate$: QRL<(nextValues: number[]) => void>;
  onCommit$: QRL<(finalValues: number[]) => void>;
}

export function startSliderDrag(options: StartSliderDragOptions): void {
  cleanupActiveSliderDrag();

  const {
    trackEl,
    thumbIndex,
    orientation,
    min,
    max,
    step,
    minStepsBetweenThumbs,
    valuesSignal,
    activeThumbSignal,
    onUpdate$,
    onCommit$,
  } = options;

  activeThumbSignal.value = thumbIndex;

  function handlePointerMove(event: PointerEvent) {
    const raw = getValueFromPointer(event.clientX, event.clientY, trackEl, orientation, min, max);
    const current = valuesSignal.value;
    const nextVal = clampThumbValue(
      raw,
      current,
      thumbIndex,
      min,
      max,
      step,
      minStepsBetweenThumbs,
    );
    if (nextVal !== current[thumbIndex]) {
      const nextValues = [...current];
      nextValues[thumbIndex] = nextVal;
      void onUpdate$(nextValues);
    }
  }

  function finishDrag() {
    cleanup();
    activeThumbSignal.value = null;
    void onCommit$(valuesSignal.value);
  }

  function cleanup() {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', finishDrag);
    window.removeEventListener('pointercancel', finishDrag);
    if (activeDragCleanup === cleanup) {
      activeDragCleanup = null;
    }
  }

  activeDragCleanup = cleanup;
  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', finishDrag);
  window.addEventListener('pointercancel', finishDrag);
}
