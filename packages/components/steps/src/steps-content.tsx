import { component$, type PropsOf, Slot, useComputed$, useContext } from '@builder.io/qwik';
import { stepsContextId } from './steps-context';

export type StepsContentProps = PropsOf<'div'> & {
  /** 0-based index of the step this content panel belongs to. */
  index: number;
};

/**
 * Content panel associated with a specific step index.
 *
 * Always rendered in the DOM and hidden with the `hidden` attribute when its
 * step is not active.
 */
export const StepsContent = component$<StepsContentProps>((allProps) => {
  const { index: _index, ...restProps } = allProps;
  const rootContext = useContext(stepsContextId);
  const isCurrent = useComputed$(() => rootContext.step.value === allProps.index);

  return (
    <div
      {...restProps}
      hidden={!isCurrent.value}
      data-leve-steps-content=""
      data-state={isCurrent.value ? 'open' : 'closed'}
    >
      <Slot />
    </div>
  );
});
