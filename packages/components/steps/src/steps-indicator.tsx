import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { stepsItemContextId } from './steps-context';

export type StepsIndicatorProps = PropsOf<'span'>;

/**
 * Decorative visual indicator (such as a step number or icon) inside a step item.
 *
 * Hidden from assistive technologies with `aria-hidden="true"`.
 */
export const StepsIndicator = component$<StepsIndicatorProps>((props) => {
  const itemContext = useContext(stepsItemContextId);

  return (
    <span
      {...props}
      aria-hidden="true"
      data-leve-steps-indicator=""
      data-state={itemContext.state.value}
    >
      <Slot />
    </span>
  );
});
