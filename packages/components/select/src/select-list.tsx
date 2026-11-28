import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { selectContextId } from './select-context';

export type SelectListProps = PropsOf<'div'>;

/**
 * Listbox container (`role="listbox"`) for `Select.Item` and `Select.Group`, labelled by `Select.Label`.
 */
export const SelectList = component$<SelectListProps>((props) => {
  const context = useContext(selectContextId);

  return (
    <div
      {...props}
      id={context.ids.list}
      role="listbox"
      tabIndex={props.tabIndex ?? -1}
      aria-labelledby={
        props['aria-labelledby'] ?? (props['aria-label'] ? undefined : context.ids.label)
      }
      data-leve-select-list=""
    >
      <Slot />
    </div>
  );
});
