import { component$, type PropsOf, Slot, useContextProvider, useId } from '@builder.io/qwik';
import { comboboxGroupContextId } from './combobox-context';

export type ComboboxGroupProps = PropsOf<'div'>;

/**
 * 項目のグループ（`role="group"`）です。`GroupLabel` で名前が付きます。
 */
export const ComboboxGroup = component$<ComboboxGroupProps>((props) => {
  const labelId = `${useId()}-label`;
  useContextProvider(comboboxGroupContextId, { labelId });

  return (
    // biome-ignore lint/a11y/useSemanticElements: a <fieldset> is for form controls; the APG Combobox uses role="group" for groups of options
    <div
      {...props}
      role="group"
      aria-labelledby={props['aria-label'] ? undefined : labelId}
      data-leve-combobox-group=""
    >
      <Slot />
    </div>
  );
});
