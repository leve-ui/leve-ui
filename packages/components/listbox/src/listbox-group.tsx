import { component$, type PropsOf, Slot, useContextProvider, useId } from '@builder.io/qwik';
import { listboxGroupContextId } from './listbox-context';

export type ListboxGroupProps = PropsOf<'div'>;

/**
 * Groups related `Listbox.Item` options (`role="group"`), named by a `Listbox.GroupLabel`.
 */
export const ListboxGroup = component$<ListboxGroupProps>((props) => {
  const labelId = `${useId()}-label`;
  useContextProvider(listboxGroupContextId, { labelId });

  return (
    // biome-ignore lint/a11y/useSemanticElements: a <fieldset> is for form controls; the APG Listbox uses role="group" for groups of options
    <div
      {...props}
      role="group"
      aria-labelledby={props['aria-labelledby'] ?? (props['aria-label'] ? undefined : labelId)}
      data-leve-listbox-group=""
    >
      <Slot />
    </div>
  );
});
