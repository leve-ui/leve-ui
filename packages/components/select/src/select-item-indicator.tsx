import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { selectItemContextId } from './select-context';

export type SelectItemIndicatorProps = PropsOf<'span'>;

/**
 * Visual indicator shown when the parent `Select.Item` is selected, hidden otherwise.
 * Hidden from assistive technologies because `aria-selected` communicates the state.
 */
export const SelectItemIndicator = component$<SelectItemIndicatorProps>((props) => {
  const item = useContext(selectItemContextId);

  return (
    <span
      {...props}
      hidden={!item.selected.value}
      aria-hidden="true"
      data-leve-select-item-indicator=""
      data-state={item.selected.value ? 'checked' : 'unchecked'}
    >
      <Slot />
    </span>
  );
});
