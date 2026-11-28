import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { stepsContextId } from './steps-context';

export type StepsListProps = PropsOf<'ol'>;

/**
 * Ordered list (`<ol>`) container for step items.
 *
 * Uses native `<ol>` semantics because steps represent a sequential progression.
 */
export const StepsList = component$<StepsListProps>((props) => {
  const context = useContext(stepsContextId);

  return (
    <ol {...props} data-leve-steps-list="" data-orientation={context.orientation.value}>
      <Slot />
    </ol>
  );
});
