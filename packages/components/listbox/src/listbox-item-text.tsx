import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { listboxItemContextId } from './listbox-context';

export type ListboxItemTextProps = PropsOf<'span'>;

/**
 * The primary label of a `Listbox.Item`. Used for typeahead matching unless `textValue` is set on the item.
 */
export const ListboxItemText = component$<ListboxItemTextProps>((props) => {
  useContext(listboxItemContextId);

  return (
    <span {...props} data-leve-listbox-item-text="">
      <Slot />
    </span>
  );
});
