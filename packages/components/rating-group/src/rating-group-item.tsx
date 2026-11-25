import {
  $,
  component$,
  type PropsOf,
  Slot,
  sync$,
  useComputed$,
  useContext,
} from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { ratingGroupContextId } from './rating-group-context';

export type RatingGroupItemProps = PropsOf<'span'> & {
  /** 1-based index of this rating item (`1..count`). */
  index: number;
};

function getDirection(el: HTMLElement): 'ltr' | 'rtl' {
  if (typeof window !== 'undefined' && typeof window.getComputedStyle === 'function') {
    return window.getComputedStyle(el).direction === 'rtl' ? 'rtl' : 'ltr';
  }
  return el.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
}

function getPointerRating(
  event: PointerEvent | MouseEvent,
  element: HTMLElement,
  index: number,
  allowHalf: boolean,
): number {
  if (!allowHalf) return index;
  const rect = element.getBoundingClientRect();
  if (rect.width <= 0) return index;
  const isRtl = getDirection(element) === 'rtl';
  const offsetX = event.clientX - rect.left;
  const isFirstHalf = isRtl ? offsetX > rect.width / 2 : offsetX < rect.width / 2;
  return isFirstHalf ? index - 0.5 : index;
}

/**
 * Individual rating item representing one unit (e.g. a star) in a `RatingGroup`.
 *
 * Renders `<span role="radio">` with roving `tabIndex`, `aria-checked` reflecting
 * only the committed value, hover preview via `data-state` (`checked` | `half` | `unchecked`)
 * and `data-highlighted`, and APG Rating Radio Group keyboard navigation.
 */
export const RatingGroupItem = component$<RatingGroupItemProps>((props) => {
  const { index, onClick$, onPointerMove$, onKeyDown$, ...restProps } = props;
  const context = useContext(ratingGroupContextId);

  const isDisabled = context.disabled.value;
  const isReadOnly = context.readOnly.value;
  const allowHalf = context.allowHalf.value;
  const committedValue = context.value.value;
  const hoverValue = context.hoverValue.value;
  const displayValue = hoverValue ?? committedValue;

  const isRadioChecked = committedValue === index || (allowHalf && committedValue === index - 0.5);

  const stateSignal = useComputed$(() => {
    const current = context.hoverValue.value ?? context.value.value;
    if (current >= index) return 'checked';
    if (context.allowHalf.value && current >= index - 0.5) return 'half';
    return 'unchecked';
  });

  const isHighlighted = displayValue >= index - (allowHalf ? 0.5 : 0);

  const tabIndexSignal = useComputed$(() => {
    if (context.disabled.value) return -1;
    const val = context.value.value;
    const activeIndex = val > 0 ? Math.min(context.count.value, Math.max(1, Math.ceil(val))) : 1;
    return index === activeIndex ? 0 : -1;
  });

  const halfActive = allowHalf && (committedValue === index - 0.5 || hoverValue === index - 0.5);
  const labelNum = halfActive ? index - 0.5 : index;
  const defaultAriaLabel = labelNum === 1 ? '1 star' : `${labelNum} stars`;

  const preventKeyEvents = sync$((event: KeyboardEvent, element: HTMLElement) => {
    if (element.getAttribute('aria-disabled') === 'true') return;
    const key = event.key;
    if (
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'Home' ||
      key === 'End' ||
      key === ' '
    ) {
      event.preventDefault();
    }
  });

  const internalClick$ = $(async (event: MouseEvent, element: HTMLElement) => {
    if (context.disabled.value || context.readOnly.value) return;
    const picked = getPointerRating(event, element, index, context.allowHalf.value);
    if (context.allowClear.value && context.value.value === picked) {
      await context.setRating$(0);
    } else {
      await context.setRating$(picked);
    }
  });

  const internalPointerMove$ = $(async (event: PointerEvent, element: HTMLElement) => {
    if (context.disabled.value || context.readOnly.value) return;
    const hovered = getPointerRating(event, element, index, context.allowHalf.value);
    await context.setHover$(hovered);
  });

  const internalKeyDown$ = $(async (event: KeyboardEvent, element: HTMLElement) => {
    if (context.disabled.value || context.readOnly.value) return;

    const key = event.key;
    const half = context.allowHalf.value;
    const step = half ? 0.5 : 1;
    const min = half ? 0.5 : 1;
    const max = context.count.value;
    const currentValue = context.value.value;
    const isRtl = getDirection(element) === 'rtl';

    let nextValue: number | null = null;

    switch (key) {
      case 'ArrowRight': {
        const delta = isRtl ? -step : step;
        nextValue = Math.min(max, Math.max(min, currentValue + delta));
        break;
      }
      case 'ArrowLeft': {
        const delta = isRtl ? step : -step;
        nextValue = Math.min(max, Math.max(min, currentValue + delta));
        break;
      }
      case 'ArrowUp': {
        nextValue = Math.min(max, Math.max(min, currentValue + step));
        break;
      }
      case 'ArrowDown': {
        nextValue = Math.min(max, Math.max(min, currentValue - step));
        break;
      }
      case 'Home': {
        nextValue = min;
        break;
      }
      case 'End': {
        nextValue = max;
        break;
      }
      case ' ': {
        nextValue = index;
        break;
      }
      default:
        return;
    }

    if (nextValue === null) return;

    const root = element.closest('[data-leve-rating-group]');
    if (root) {
      const allItems = Array.from(
        root.querySelectorAll<HTMLElement>('[data-leve-rating-group-item]'),
      ).filter((el) => el.closest('[data-leve-rating-group]') === root);
      const targetIdx = Math.max(0, Math.min(allItems.length - 1, Math.ceil(nextValue) - 1));
      for (let i = 0; i < allItems.length; i++) {
        allItems[i].tabIndex = i === targetIdx ? 0 : -1;
      }
      allItems[targetIdx]?.focus();
    }

    await context.setRating$(nextValue);
  });

  return (
    // biome-ignore lint/a11y/useSemanticElements: APG Rating Radio Group pattern uses role="radio" on span items
    <span
      {...restProps}
      role="radio"
      aria-checked={isRadioChecked ? 'true' : 'false'}
      aria-label={props['aria-label'] ?? defaultAriaLabel}
      aria-disabled={isDisabled ? 'true' : undefined}
      tabIndex={tabIndexSignal.value}
      onClick$={[internalClick$, onClick$]}
      onPointerMove$={[internalPointerMove$, onPointerMove$]}
      onKeyDown$={[preventKeyEvents, internalKeyDown$, onKeyDown$]}
      data-leve-rating-group-item=""
      data-state={stateSignal.value}
      data-checked={dataAttr(isRadioChecked)}
      data-highlighted={dataAttr(isHighlighted)}
      data-disabled={dataAttr(isDisabled)}
      data-readonly={dataAttr(isReadOnly)}
    >
      <Slot />
    </span>
  );
});
