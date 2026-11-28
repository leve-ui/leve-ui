import {
  component$,
  type PropsOf,
  Slot,
  useComputed$,
  useContext,
  useContextProvider,
} from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import {
  treeViewContextId,
  treeViewGroupContextId,
  treeViewItemContextId,
} from './tree-view-context';

export type TreeViewGroupProps = PropsOf<'ul'>;

/**
 * Container for child tree items (`<ul role="group">`) nested inside a branch `TreeView.Item`.
 *
 * Hidden via the `hidden` attribute while its parent item is collapsed, and increments
 * the nesting depth in context so child items compute `aria-level` and `data-depth`.
 */
export const TreeViewGroup = component$<TreeViewGroupProps>((props) => {
  const rootContext = useContext(treeViewContextId);
  const itemContext = useContext(treeViewItemContextId, null);

  const expandedSignal = useComputed$(() => (itemContext ? itemContext.expanded.value : true));
  const depthSignal = useComputed$(() => (itemContext ? itemContext.depth.value + 1 : 0));
  const visibleSignal = useComputed$(() =>
    itemContext ? itemContext.visible.value && itemContext.expanded.value : true,
  );
  const disabledSignal = useComputed$(() =>
    itemContext ? itemContext.disabled.value : rootContext.disabled.value,
  );

  useContextProvider(treeViewGroupContextId, {
    depth: depthSignal,
    visible: visibleSignal,
    disabled: disabledSignal,
  });

  const expanded = expandedSignal.value;

  return (
    // biome-ignore lint/a11y/useSemanticElements: WAI-ARIA APG Tree View pattern uses <ul role="group"> for nested item lists
    <ul
      {...props}
      role="group"
      hidden={!expanded}
      data-leve-tree-view-group=""
      data-state={expanded ? 'open' : 'closed'}
      data-disabled={dataAttr(disabledSignal.value)}
      data-depth={depthSignal.value}
    >
      <Slot />
    </ul>
  );
});
