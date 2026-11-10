import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { fieldsetContextId } from './fieldset-context';

export type FieldsetLegendProps = PropsOf<'legend'>;

/** Fieldset のラベルです。Fieldset の最初の子要素として置いてください */
export const FieldsetLegend = component$<FieldsetLegendProps>((props) => {
  const context = useContext(fieldsetContextId);

  return (
    <legend
      {...props}
      data-leve-fieldset-legend=""
      data-disabled={dataAttr(context.disabled.value)}
    >
      <Slot />
    </legend>
  );
});
