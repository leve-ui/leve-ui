import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { listboxItemContextId } from './listbox-context';

export type ListboxItemIndicatorProps = PropsOf<'span'>;

/**
 * Visual indicator shown when the parent `Listbox.Item` is selected.
 *
 * Hidden when unselected (`hidden`) and hidden from assistive technologies (`aria-hidden="true"`),
 * because selection is conveyed through `aria-selected` on the item.
 */
export const ListboxItemIndicator = component$<ListboxItemIndicatorProps>((props) => {
  const item = useContext(listboxItemContextId);

  return (
    <span
      {...props}
      hidden={!item.selected.value}
      aria-hidden="true"
      data-leve-listbox-item-indicator=""
      data-state={item.selected.value ? 'checked' : 'unchecked'}
    >
      <Slot />
    </span>
  );
});
