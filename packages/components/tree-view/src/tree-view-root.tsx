import {
  $,
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  sync$,
  useComputed$,
  useContextProvider,
  useSignal,
  useStore,
} from '@builder.io/qwik';
import { dataAttr, isItemDisabled, useControllableState } from '@leve-ui/utils';
import {
  focusTreeItem,
  GROUP_SELECTOR,
  getDirectChildGroup,
  getDirectChildItems,
  getVisibleTreeItems,
  ITEM_SELECTOR,
  moveTreeRovingFocus,
  moveTreeTypeaheadFocus,
  ROOT_SELECTOR,
  resetTreeTypeahead,
  type TreeViewItemRegistration,
  treeViewContextId,
} from './tree-view-context';

export type TreeViewRootProps = PropsOf<'ul'> & {
  /**
   * Whether multiple tree items can be selected at once.
   * @default false
   */
  multiple?: boolean;
  /**
   * The values of the items selected initially (uncontrolled).
   * @default []
   */
  defaultValue?: string[];
  /** A signal with the values of the selected items (controlled). */
  'bind:value'?: Signal<string[]>;
  /** Called when the selected items change. */
  onValueChange$?: QRL<(value: string[]) => void>;
  /**
   * The values of the branch items expanded initially (uncontrolled).
   * @default []
   */
  defaultExpandedValue?: string[];
  /** A signal with the values of the expanded branch items (controlled). */
  'bind:expandedValue'?: Signal<string[]>;
  /** Called when the expanded branch items change. */
  onExpandedValueChange$?: QRL<(value: string[]) => void>;
  /**
   * Disables all items in the tree view.
   * @default false
   */
  disabled?: boolean;
};

/**
 * Synchronously prevents default page scrolling on tree navigation and activation keys.
 */
export const syncKeyDown$ = sync$((event: KeyboardEvent) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  const target = event.target as HTMLElement | null;
  if (!target?.closest('[data-leve-tree-view-item]')) return;
  if (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  ) {
    return;
  }
  const key = event.key;
  if (
    key === 'ArrowDown' ||
    key === 'ArrowUp' ||
    key === 'ArrowRight' ||
    key === 'ArrowLeft' ||
    key === 'Home' ||
    key === 'End' ||
    key === ' '
  ) {
    event.preventDefault();
  }
});

/**
 * Root container for a hierarchical tree view (`<ul role="tree">`).
 *
 * Complies with the WAI-ARIA APG Tree View pattern with roving tabindex focus management,
 * single or multiple selection, controlled/uncontrolled expansion and selection state,
 * arrow key navigation, `*` sibling expansion, and typeahead search.
 */
export const TreeViewRoot = component$<TreeViewRootProps>((props) => {
  const {
    multiple: _multiple,
    defaultValue = [],
    'bind:value': bindValue,
    onValueChange$,
    defaultExpandedValue = [],
    'bind:expandedValue': bindExpandedValue,
    onExpandedValueChange$,
    disabled: _disabled,
    onKeyDown$,
    ...restProps
  } = props;

  const [selectedValues, setSelectedValues$] = useControllableState<string[]>({
    value: bindValue,
    defaultValue: defaultValue ?? [],
    onChange$: onValueChange$,
  });

  const [expandedValues, setExpandedValues$] = useControllableState<string[]>({
    value: bindExpandedValue,
    defaultValue: defaultExpandedValue ?? [],
    onChange$: onExpandedValueChange$,
  });

  const multipleSignal = useComputed$(() => Boolean(props.multiple));
  const disabledSignal = useComputed$(() => Boolean(props.disabled));
  const focusedValue = useSignal<string | null>(null);
  const items = useStore<TreeViewItemRegistration[]>([]);

  const selectItem$ = $(async (itemValue: string) => {
    if (disabledSignal.value) return;
    const current = selectedValues.value;
    if (multipleSignal.value) {
      const next = current.includes(itemValue)
        ? current.filter((v) => v !== itemValue)
        : [...current, itemValue];
      await setSelectedValues$(next);
    } else {
      if (current.length === 1 && current[0] === itemValue) return;
      await setSelectedValues$([itemValue]);
    }
  });

  const toggleExpanded$ = $(async (itemValue: string) => {
    if (disabledSignal.value) return;
    const current = expandedValues.value;
    const next = current.includes(itemValue)
      ? current.filter((v) => v !== itemValue)
      : [...current, itemValue];
    await setExpandedValues$(next);
  });

  const expandItem$ = $(async (itemValue: string) => {
    if (disabledSignal.value) return;
    const current = expandedValues.value;
    if (current.includes(itemValue)) return;
    await setExpandedValues$([...current, itemValue]);
  });

  const collapseItem$ = $(async (itemValue: string) => {
    if (disabledSignal.value) return;
    const current = expandedValues.value;
    if (!current.includes(itemValue)) return;
    await setExpandedValues$(current.filter((v) => v !== itemValue));
  });

  const expandItems$ = $(async (itemValues: string[]) => {
    if (disabledSignal.value || itemValues.length === 0) return;
    const current = expandedValues.value;
    const toAdd = itemValues.filter((v) => !current.includes(v));
    if (toAdd.length === 0) return;
    await setExpandedValues$([...current, ...toAdd]);
  });

  useContextProvider(treeViewContextId, {
    selectedValues,
    expandedValues,
    multiple: multipleSignal,
    disabled: disabledSignal,
    focusedValue,
    items,
    selectItem$,
    toggleExpanded$,
    expandItem$,
    collapseItem$,
    expandItems$,
  });

  const handleKeyDown$ = $(async (event: KeyboardEvent, root: HTMLElement) => {
    if (disabledSignal.value) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const rawTarget = event.target as HTMLElement | null;
    if (
      !rawTarget ||
      rawTarget.tagName === 'INPUT' ||
      rawTarget.tagName === 'TEXTAREA' ||
      rawTarget.tagName === 'SELECT' ||
      rawTarget.isContentEditable
    ) {
      return;
    }

    const item = rawTarget.closest<HTMLElement>(ITEM_SELECTOR);
    if (!item || item.closest(ROOT_SELECTOR) !== root) return;
    if (isItemDisabled(item)) return;

    const itemValue = item.getAttribute('data-value');
    if (itemValue === null) return;

    const visibleItems = getVisibleTreeItems(root);

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Home':
      case 'End': {
        resetTreeTypeahead(root);
        moveTreeRovingFocus(event, root, visibleItems, item, focusedValue);
        return;
      }

      case 'ArrowRight': {
        resetTreeTypeahead(root);
        event.preventDefault();
        const expanded = item.getAttribute('aria-expanded');
        if (expanded === 'false') {
          await expandItem$(itemValue);
        } else if (expanded === 'true') {
          const group = getDirectChildGroup(item);
          if (group) {
            const firstChild = getDirectChildItems(group).find((child) => !isItemDisabled(child));
            if (firstChild) {
              focusTreeItem(root, firstChild, focusedValue);
            }
          }
        }
        return;
      }

      case 'ArrowLeft': {
        resetTreeTypeahead(root);
        event.preventDefault();
        const expanded = item.getAttribute('aria-expanded');
        if (expanded === 'true') {
          await collapseItem$(itemValue);
        } else {
          let ancestor = item.parentElement?.closest<HTMLElement>(ITEM_SELECTOR) ?? null;
          while (ancestor && root.contains(ancestor)) {
            if (ancestor.closest(ROOT_SELECTOR) !== root) break;
            if (!isItemDisabled(ancestor)) {
              focusTreeItem(root, ancestor, focusedValue);
              break;
            }
            ancestor = ancestor.parentElement?.closest<HTMLElement>(ITEM_SELECTOR) ?? null;
          }
        }
        return;
      }

      case 'Enter':
      case ' ': {
        resetTreeTypeahead(root);
        event.preventDefault();
        await selectItem$(itemValue);
        return;
      }

      case '*': {
        resetTreeTypeahead(root);
        event.preventDefault();
        const container = item.parentElement?.closest<HTMLElement>(
          `${GROUP_SELECTOR}, ${ROOT_SELECTOR}`,
        );
        if (!container || !root.contains(container)) return;
        const siblings = Array.from(container.querySelectorAll<HTMLElement>(ITEM_SELECTOR)).filter(
          (el) => el.closest(`${GROUP_SELECTOR}, ${ROOT_SELECTOR}`) === container,
        );
        const toExpand = siblings
          .filter((el) => el.getAttribute('aria-expanded') === 'false' && !isItemDisabled(el))
          .map((el) => el.getAttribute('data-value'))
          .filter((val): val is string => val !== null);
        await expandItems$(toExpand);
        return;
      }

      default: {
        moveTreeTypeaheadFocus(event, root, visibleItems, item, focusedValue);
      }
    }
  });

  return (
    <ul
      {...restProps}
      // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: WAI-ARIA APG Tree View pattern uses <ul role="tree">
      role="tree"
      aria-multiselectable={multipleSignal.value ? 'true' : undefined}
      aria-disabled={disabledSignal.value ? 'true' : undefined}
      onKeyDown$={[syncKeyDown$, handleKeyDown$, onKeyDown$]}
      data-leve-tree-view=""
      data-disabled={dataAttr(disabledSignal.value)}
    >
      <Slot />
    </ul>
  );
});
