import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { listboxGroupContextId } from './listbox-context';

export type ListboxGroupLabelProps = PropsOf<'div'>;

/**
 * Accessible heading for a `Listbox.Group`. Not an option and skipped during keyboard navigation.
 */
export const ListboxGroupLabel = component$<ListboxGroupLabelProps>((props) => {
  const group = useContext(listboxGroupContextId);

  return (
    <div {...props} id={props.id ?? group.labelId} data-leve-listbox-group-label="">
      <Slot />
    </div>
  );
});
