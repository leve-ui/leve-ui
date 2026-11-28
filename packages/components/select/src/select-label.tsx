import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { selectContextId } from './select-context';

export type SelectLabelProps = PropsOf<'label'>;

/**
 * Accessible label (`<label for>`) for the Select trigger and listbox.
 * Inside a `Field`, `Field.Label` can be used instead.
 */
export const SelectLabel = component$<SelectLabelProps>((props) => {
  const context = useContext(selectContextId);

  return (
    <label
      {...props}
      id={context.ids.label}
      for={context.ids.trigger}
      data-leve-select-label=""
      data-disabled={dataAttr(context.disabled.value)}
    >
      <Slot />
    </label>
  );
});
