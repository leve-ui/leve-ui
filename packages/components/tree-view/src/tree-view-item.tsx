import {
  $,
  component$,
  getPlatform,
  type PropsOf,
  type Signal,
  Slot,
  useComputed$,
  useContext,
  useContextProvider,
  useSignal,
  useTask$,
} from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import {
  isTreeItemAvailable,
  ROOT_SELECTOR,
  setTreeTabStop,
  sortTreeViewItems,
  treeViewContextId,
  treeViewGroupContextId,
  treeViewItemContextId,
} from './tree-view-context';

export type TreeViewItemProps = Omit<PropsOf<'li'>, 'value'> & {
  /** A unique value that identifies this tree item. */
  value: string;
  /**
   * Whether this item is a branch node that can be expanded or collapsed.
   * Set `true` on items that contain a nested `TreeView.Group`.
   * @default false
   */
  branch?: boolean;
  /**
   * Disables this item and any nested items inside it.
   * @default false
   */
  disabled?: boolean;
  /** The text used by typeahead when the item's text content is not suitable. */
  textValue?: string;
  /** Overrides `aria-level` for this item. Derived from nesting depth (`1` at the root level) by default. */
  level?: number;
  /** Sets `aria-setsize` for this item when rendering a flat or virtualized structure. */
  setsize?: number;
  /** Sets `aria-posinset` for this item when rendering a flat or virtualized structure. */
  posinset?: number;
};

/**
 * An individual node (`<li role="treeitem">`) inside a `TreeView`.
 *
 * Manages roving `tabIndex`, selection (`aria-selected`), branch expansion (`aria-expanded`),
 * and nesting depth (`aria-level` and `data-depth`).
 */
export const TreeViewItem = component$<TreeViewItemProps>((props) => {
  const {
    value: _value,
    branch: _branch,
    disabled: _disabled,
    textValue: _textValue,
    level: _level,
    setsize: _setsize,
    posinset: _posinset,
    onFocus$,
    ref: _ref,
    ...restProps
  } = props;

  const rootContext = useContext(treeViewContextId);
  const groupContext = useContext(treeViewGroupContextId, null);

  const internalRef = useSignal<HTMLLIElement>();
  const itemRef = (props.ref as Signal<HTMLLIElement | undefined> | undefined) ?? internalRef;

  const depthSignal = useComputed$(() => (groupContext ? groupContext.depth.value : 0));
  const isVisibleSignal = useComputed$(() => (groupContext ? groupContext.visible.value : true));
  const isBranchSignal = useComputed$(() => Boolean(props.branch));
  const isDisabledSignal = useComputed$(
    () =>
      Boolean(props.disabled) ||
      Boolean(rootContext.disabled.value) ||
      Boolean(groupContext?.disabled.value),
  );
  const isSelectedSignal = useComputed$(() =>
    rootContext.selectedValues.value.includes(props.value),
  );
  const isExpandedSignal = useComputed$(
    () => isBranchSignal.value && rootContext.expandedValues.value.includes(props.value),
  );

  useTask$(({ track, cleanup }) => {
    const disabled = track(() => isDisabledSignal.value);
    const visible = track(() => isVisibleSignal.value);
    const val = track(() => props.value);
    const element = track(() => itemRef.value);

    const existing = rootContext.items.find((item) => item.value === val);
    if (existing) {
      existing.disabled = disabled;
      existing.visible = visible;
    } else {
      rootContext.items.push({ value: val, disabled, visible });
    }

    if (element) {
      sortTreeViewItems(element, rootContext.items);
    } else if (!getPlatform().isServer) {
      queueMicrotask(() => {
        sortTreeViewItems(itemRef.value, rootContext.items);
      });
    }

    // Keep SSR-rendered item registrations intact until client unmount (same pattern as Tabs/Toolbar)
    if (!getPlatform().isServer) {
      cleanup(() => {
        const index = rootContext.items.findIndex((item) => item.value === val);
        if (index !== -1) {
          rootContext.items.splice(index, 1);
        }
      });
    }
  });

  const tabIndexSignal = useComputed$(() => {
    if (isDisabledSignal.value || !isVisibleSignal.value) return -1;

    // 1. If focusedValue points to a visible, enabled registered item, it holds the tab stop
    const focused = rootContext.focusedValue.value;
    if (focused !== null) {
      const isFocusedAvailable = rootContext.items.some(
        (item) => item.value === focused && isTreeItemAvailable(item),
      );
      if (isFocusedAvailable) {
        return focused === props.value ? 0 : -1;
      }
    }

    const selected = rootContext.selectedValues.value;

    // 2. If this item is selected, visible, and enabled, pick the first such item
    if (isSelectedSignal.value) {
      const earlierSelected = rootContext.items.find(
        (item) => isTreeItemAvailable(item) && selected.includes(item.value),
      );
      if (earlierSelected && earlierSelected.value !== props.value) {
        return -1;
      }
      return 0;
    }

    // 3. Another registered item is selected, visible, and enabled
    const hasOtherAvailableSelected = rootContext.items.some(
      (item) => isTreeItemAvailable(item) && selected.includes(item.value),
    );
    if (hasOtherAvailableSelected) {
      return -1;
    }

    // 4. Fall back to the first visible enabled item when nothing is selected or all selected items are unavailable
    const allSelectedKnownUnavailable =
      selected.length > 0 &&
      selected.every((val) => {
        const registered = rootContext.items.find((item) => item.value === val);
        return registered ? !isTreeItemAvailable(registered) : false;
      });

    if (selected.length === 0 || allSelectedKnownUnavailable) {
      const firstAvailable = rootContext.items.find(isTreeItemAvailable)?.value ?? props.value;
      return firstAvailable === props.value ? 0 : -1;
    }

    // 5. Handle selected values not registered yet during initial SSR
    const matchingRegistered = rootContext.items.some((item) => selected.includes(item.value));
    if (!matchingRegistered) {
      const currentIndex = rootContext.items.findIndex((item) => item.value === props.value);
      const hasItemsAfter = currentIndex !== -1 && currentIndex < rootContext.items.length - 1;
      if (hasItemsAfter) {
        const firstAvailable = rootContext.items.find(isTreeItemAvailable)?.value ?? props.value;
        return firstAvailable === props.value ? 0 : -1;
      }
    }

    return -1;
  });

  useContextProvider(treeViewItemContextId, {
    value: props.value,
    branch: isBranchSignal,
    expanded: isExpandedSignal,
    selected: isSelectedSignal,
    disabled: isDisabledSignal,
    visible: isVisibleSignal,
    depth: depthSignal,
  });

  const handleFocus$ = $((_event: FocusEvent, element: HTMLLIElement) => {
    if (isDisabledSignal.value || element.ownerDocument.activeElement !== element) return;
    rootContext.focusedValue.value = props.value;
    const root = element.closest(ROOT_SELECTOR);
    if (root) {
      setTreeTabStop(root, element);
    }
  });

  const isBranch = isBranchSignal.value;
  const isExpanded = isExpandedSignal.value;
  const isSelected = isSelectedSignal.value;
  const isDisabled = isDisabledSignal.value;
  const depth = depthSignal.value;
  const state = isBranch ? (isExpanded ? 'open' : 'closed') : isSelected ? 'checked' : 'unchecked';

  return (
    <li
      {...restProps}
      ref={itemRef}
      role="treeitem"
      aria-expanded={isBranch ? (isExpanded ? 'true' : 'false') : undefined}
      aria-selected={isSelected ? 'true' : 'false'}
      aria-level={props.level ?? props['aria-level'] ?? depth + 1}
      aria-setsize={props.setsize ?? props['aria-setsize']}
      aria-posinset={props.posinset ?? props['aria-posinset']}
      aria-disabled={isDisabled ? 'true' : undefined}
      tabIndex={tabIndexSignal.value}
      onFocus$={[handleFocus$, onFocus$]}
      data-leve-tree-view-item=""
      data-value={props.value}
      data-text-value={props.textValue}
      data-state={state}
      data-selected={dataAttr(isSelected)}
      data-branch={dataAttr(isBranch)}
      data-disabled={dataAttr(isDisabled)}
      data-depth={depth}
    >
      <Slot />
    </li>
  );
});
