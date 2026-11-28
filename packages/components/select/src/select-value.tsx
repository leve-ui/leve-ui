import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { selectContextId } from './select-context';

export type SelectValueProps = PropsOf<'span'> & {
  /** Text displayed when no item is selected. */
  placeholder?: string;
};

/**
 * Displays the selected option's text, or the `placeholder` when no option is selected.
 */
export const SelectValue = component$<SelectValueProps>(({ placeholder, ...props }) => {
  const context = useContext(selectContextId);
  const isPlaceholder = context.value.value === null;

  return (
    <span {...props} data-leve-select-value="" data-placeholder={dataAttr(isPlaceholder)}>
      {isPlaceholder ? (placeholder ?? <Slot />) : context.selectedText.value}
    </span>
  );
});
