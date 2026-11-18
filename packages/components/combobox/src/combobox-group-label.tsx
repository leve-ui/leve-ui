import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { comboboxGroupContextId } from './combobox-context';

export type ComboboxGroupLabelProps = PropsOf<'div'>;

/**
 * グループの名前です。項目ではないため、↑ / ↓ では止まりません。
 */
export const ComboboxGroupLabel = component$<ComboboxGroupLabelProps>((props) => {
  const group = useContext(comboboxGroupContextId);

  return (
    <div {...props} id={group.labelId} data-leve-combobox-group-label="">
      <Slot />
    </div>
  );
});
