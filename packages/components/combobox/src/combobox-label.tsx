import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { comboboxContextId } from './combobox-context';

export type ComboboxLabelProps = PropsOf<'label'>;

/**
 * Input のラベル（`<label for>`）です。List の `aria-labelledby` にも使います。
 * Field の中では、代わりに `Field.Label` を使えます。
 */
export const ComboboxLabel = component$<ComboboxLabelProps>((props) => {
  const context = useContext(comboboxContextId);

  return (
    <label
      {...props}
      id={context.ids.label}
      for={context.ids.input}
      data-leve-combobox-label=""
      data-disabled={dataAttr(context.disabled.value)}
    >
      <Slot />
    </label>
  );
});
