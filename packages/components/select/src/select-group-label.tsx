import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { selectGroupContextId } from './select-context';

export type SelectGroupLabelProps = PropsOf<'div'>;

/**
 * Label for a `Select.Group`. Not selectable or navigable with arrow keys.
 */
export const SelectGroupLabel = component$<SelectGroupLabelProps>((props) => {
  const group = useContext(selectGroupContextId);

  return (
    <div {...props} id={group.labelId} data-leve-select-group-label="">
      <Slot />
    </div>
  );
});
