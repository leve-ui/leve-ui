import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { comboboxContextId } from './combobox-context';

export type ComboboxListProps = PropsOf<'div'>;

/**
 * 候補の一覧（`role="listbox"`）です。Label で名前が付きます。中に `Item` と `Group` を置きます。
 */
export const ComboboxList = component$<ComboboxListProps>((props) => {
  const context = useContext(comboboxContextId);

  return (
    <div
      {...props}
      id={context.ids.list}
      role="listbox"
      aria-labelledby={
        props['aria-labelledby'] ?? (props['aria-label'] ? undefined : context.ids.label)
      }
      data-leve-combobox-list=""
    >
      <Slot />
    </div>
  );
});
