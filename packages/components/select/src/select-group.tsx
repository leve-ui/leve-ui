import { component$, type PropsOf, Slot, useContextProvider, useId } from '@builder.io/qwik';
import { selectGroupContextId } from './select-context';

export type SelectGroupProps = PropsOf<'div'>;

/**
 * Group of related options (`role="group"`), named by its `Select.GroupLabel`.
 */
export const SelectGroup = component$<SelectGroupProps>((props) => {
  const labelId = `${useId()}-label`;
  useContextProvider(selectGroupContextId, { labelId });

  return (
    // biome-ignore lint/a11y/useSemanticElements: a <fieldset> is for form controls; the APG Combobox uses role="group" for groups of options
    <div
      {...props}
      role="group"
      aria-labelledby={props['aria-labelledby'] ?? (props['aria-label'] ? undefined : labelId)}
      data-leve-select-group=""
    >
      <Slot />
    </div>
  );
});
