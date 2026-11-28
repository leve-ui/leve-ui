import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { treeViewItemContextId } from './tree-view-context';

export type TreeViewItemIndicatorProps = PropsOf<'span'>;

/**
 * Decorative indicator (`<span aria-hidden="true">`) inside a `TreeView.ItemTrigger`,
 * typically used for a branch chevron or selection checkmark.
 *
 * Exposes `data-state` (`"open"` / `"closed"` on branches, `"checked"` / `"unchecked"` on leaves)
 * and `data-selected` for styling.
 */
export const TreeViewItemIndicator = component$<TreeViewItemIndicatorProps>((props) => {
  const itemContext = useContext(treeViewItemContextId);

  const isBranch = itemContext.branch.value;
  const isExpanded = itemContext.expanded.value;
  const isSelected = itemContext.selected.value;
  const isDisabled = itemContext.disabled.value;
  const state = isBranch ? (isExpanded ? 'open' : 'closed') : isSelected ? 'checked' : 'unchecked';

  return (
    <span
      {...props}
      aria-hidden="true"
      data-leve-tree-view-item-indicator=""
      data-state={state}
      data-selected={dataAttr(isSelected)}
      data-branch={dataAttr(isBranch)}
      data-disabled={dataAttr(isDisabled)}
    >
      <Slot />
    </span>
  );
});
