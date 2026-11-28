import { $, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import {
  focusTreeItem,
  ITEM_SELECTOR,
  ROOT_SELECTOR,
  treeViewContextId,
  treeViewItemContextId,
} from './tree-view-context';

export type TreeViewItemTriggerProps = PropsOf<'div'>;

/**
 * Clickable row trigger inside a `TreeView.Item` (`<div>`).
 *
 * Focuses the enclosing `treeitem`, updates selection, and toggles expansion when the item is a branch.
 * Kept as a `<div>` rather than `<button>` so the parent `<li role="treeitem">` owns focus and
 * keyboard interactions without nesting interactive elements.
 */
export const TreeViewItemTrigger = component$<TreeViewItemTriggerProps>(
  ({ onClick$, ...props }) => {
    const rootContext = useContext(treeViewContextId);
    const itemContext = useContext(treeViewItemContextId);

    const handleClick$ = $(async (_event: MouseEvent, trigger: HTMLElement) => {
      if (itemContext.disabled.value) return;
      const item = trigger.closest<HTMLElement>(ITEM_SELECTOR);
      const root = trigger.closest<HTMLElement>(ROOT_SELECTOR);
      if (item && root) {
        focusTreeItem(root, item, rootContext.focusedValue);
      }
      await rootContext.selectItem$(itemContext.value);
      if (itemContext.branch.value) {
        await rootContext.toggleExpanded$(itemContext.value);
      }
    });

    const isBranch = itemContext.branch.value;
    const isExpanded = itemContext.expanded.value;
    const isSelected = itemContext.selected.value;
    const isDisabled = itemContext.disabled.value;
    const state = isBranch
      ? isExpanded
        ? 'open'
        : 'closed'
      : isSelected
        ? 'checked'
        : 'unchecked';

    return (
      <div
        {...props}
        onClick$={[handleClick$, onClick$]}
        data-leve-tree-view-item-trigger=""
        data-state={state}
        data-selected={dataAttr(isSelected)}
        data-branch={dataAttr(isBranch)}
        data-disabled={dataAttr(isDisabled)}
        data-depth={itemContext.depth.value}
      >
        <Slot />
      </div>
    );
  },
);
