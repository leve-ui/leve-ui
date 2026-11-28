import {
  component$,
  type PropsOf,
  Slot,
  useComputed$,
  useContext,
  useContextProvider,
} from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { type StepsItemState, stepsContextId, stepsItemContextId } from './steps-context';

export type StepsItemProps = PropsOf<'li'> & {
  /** 0-based index of this step item. */
  index: number;
  /**
   * Disables this step item and its trigger.
   * @default false
   */
  disabled?: boolean;
};

/**
 * List item (`<li>`) representing a single step in the sequence.
 *
 * Sets `aria-current="step"` when this item is the active step and provides
 * item state (`complete`, `current`, or `upcoming`) to descendant parts.
 */
export const StepsItem = component$<StepsItemProps>((allProps) => {
  const { index: _index, disabled: _disabled, ...restProps } = allProps;
  const rootContext = useContext(stepsContextId);

  const indexSignal = useComputed$(() => allProps.index);
  const disabledSignal = useComputed$(() => Boolean(allProps.disabled));
  const stateSignal = useComputed$<StepsItemState>(() => {
    const current = rootContext.step.value;
    const idx = indexSignal.value;
    if (idx < current) return 'complete';
    if (idx === current) return 'current';
    return 'upcoming';
  });
  const disabledAttr = useComputed$(() => dataAttr(disabledSignal.value));

  useContextProvider(stepsItemContextId, {
    index: indexSignal,
    state: stateSignal,
    disabled: disabledSignal,
  });

  return (
    <li
      {...restProps}
      aria-current={stateSignal.value === 'current' ? 'step' : undefined}
      data-leve-steps-item=""
      data-state={stateSignal.value}
      data-disabled={disabledAttr.value}
      data-orientation={rootContext.orientation.value}
    >
      <Slot />
    </li>
  );
});
