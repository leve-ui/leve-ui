import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { selectItemContextId } from './select-context';

export type SelectItemTextProps = PropsOf<'span'>;

/**
 * Text label of an option. Displayed in `Select.Value` when the option is selected.
 */
export const SelectItemText = component$<SelectItemTextProps>((props) => {
  useContext(selectItemContextId);

  return (
    <span {...props} data-leve-select-item-text="">
      <Slot />
    </span>
  );
});
