import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { stepsContextId, stepsItemContextId } from './steps-context';

export type StepsSeparatorProps = PropsOf<'div'>;

/**
 * Decorative connector line between steps inside a `Steps.Item`.
 *
 * Hidden from assistive technologies with `aria-hidden="true"`.
 */
export const StepsSeparator = component$<StepsSeparatorProps>((props) => {
  const rootContext = useContext(stepsContextId);
  const itemContext = useContext(stepsItemContextId);

  return (
    <div
      {...props}
      aria-hidden="true"
      data-leve-steps-separator=""
      data-state={itemContext.state.value}
      data-orientation={rootContext.orientation.value}
    >
      <Slot />
    </div>
  );
});
