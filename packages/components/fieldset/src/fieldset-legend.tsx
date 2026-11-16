import { component$, type PropsOf, Slot, useContext, useContextProvider } from '@builder.io/qwik';
import { dataAttr, fieldsetContextId } from '@leve-ui/utils';

export type FieldsetLegendProps = PropsOf<'legend'>;

/**
 * Fieldset のラベルです。Fieldset の最初の子要素として置いてください。
 *
 * HTML と同じく、Legend の中のコントロールはこの Fieldset の `disabled` では無効になりません
 * （祖先の Fieldset が無効な場合は無効になります）。
 */
export const FieldsetLegend = component$<FieldsetLegendProps>((props) => {
  const context = useContext(fieldsetContextId);
  useContextProvider(fieldsetContextId, {
    disabled: context.parentDisabled,
    parentDisabled: context.parentDisabled,
  });

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
