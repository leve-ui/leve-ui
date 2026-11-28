import { createContextId, type QRL, type ReadonlySignal, type Signal } from '@builder.io/qwik';
import {
  getAdjacentItem,
  getCollectionItems,
  getTypeaheadIndex,
  isItemDisabled,
  isTypeaheadKey,
} from '@leve-ui/utils';

export const ROOT_SELECTOR = '[data-leve-tree-view]';
export const ITEM_SELECTOR = '[data-leve-tree-view-item]';
export const GROUP_SELECTOR = '[data-leve-tree-view-group]';

/** An item registered with a TreeView, used only to pick the initial tab stop during SSR. */
export interface TreeViewItemRegistration {
  value: string;
  disabled: boolean;
  visible: boolean;
}

export function isTreeItemAvailable(item: TreeViewItemRegistration): boolean {
  return item.visible && !item.disabled;
}

export interface TreeViewContext {
  selectedValues: ReadonlySignal<string[]>;
  expandedValues: ReadonlySignal<string[]>;
  multiple: ReadonlySignal<boolean>;
  disabled: ReadonlySignal<boolean>;
  focusedValue: Signal<string | null>;
  items: TreeViewItemRegistration[];
  selectItem$: QRL<(value: string) => Promise<void>>;
  toggleExpanded$: QRL<(value: string) => Promise<void>>;
  expandItem$: QRL<(value: string) => Promise<void>>;
  collapseItem$: QRL<(value: string) => Promise<void>>;
  expandItems$: QRL<(values: string[]) => Promise<void>>;
}

export const treeViewContextId = createContextId<TreeViewContext>('leve-ui.tree-view');

export interface TreeViewItemContext {
  value: string;
  branch: ReadonlySignal<boolean>;
  expanded: ReadonlySignal<boolean>;
  selected: ReadonlySignal<boolean>;
  disabled: ReadonlySignal<boolean>;
  visible: ReadonlySignal<boolean>;
  depth: ReadonlySignal<number>;
}

export const treeViewItemContextId = createContextId<TreeViewItemContext>('leve-ui.tree-view-item');

export interface TreeViewGroupContext {
  depth: ReadonlySignal<number>;
  visible: ReadonlySignal<boolean>;
  disabled: ReadonlySignal<boolean>;
}

export const treeViewGroupContextId =
  createContextId<TreeViewGroupContext>('leve-ui.tree-view-group');

/**
 * Sorts registered items in DOM order within the enclosing TreeView root (`adr/0035`).
 */
export function sortTreeViewItems(
  el: Element | null | undefined,
  items: TreeViewItemRegistration[],
): void {
  const root = el?.closest(ROOT_SELECTOR);
  if (root && items.length > 1) {
    const order = getCollectionItems(root, ITEM_SELECTOR, ROOT_SELECTOR).map((node) =>
      node.getAttribute('data-value'),
    );
    const rank = new Map(order.map((value, index) => [value, index]));
    items.sort((a, b) => (rank.get(a.value) ?? order.length) - (rank.get(b.value) ?? order.length));
  }
}

/**
 * Returns `true` when no ancestor container between `item` and `root` is hidden or collapsed.
 */
export function isTreeItemVisible(item: HTMLElement, root: Element): boolean {
  let current: HTMLElement | null = item.parentElement;
  while (current && current !== root) {
    if (
      current.hasAttribute('hidden') ||
      (current.hasAttribute('data-leve-tree-view-group') &&
        current.getAttribute('data-state') === 'closed')
    ) {
      return false;
    }
    current = current.parentElement;
  }
  return true;
}

/**
 * Returns all visible tree items belonging to `root` in DOM order.
 */
export function getVisibleTreeItems(root: Element): HTMLElement[] {
  return getCollectionItems(root, ITEM_SELECTOR, ROOT_SELECTOR).filter((item) =>
    isTreeItemVisible(item, root),
  );
}

/**
 * Returns the direct child `TreeView.Group` element owned by `item`, if any.
 */
export function getDirectChildGroup(item: Element): HTMLElement | null {
  const groups = Array.from(item.querySelectorAll<HTMLElement>(GROUP_SELECTOR));
  return groups.find((group) => group.closest(ITEM_SELECTOR) === item) ?? null;
}

/**
 * Returns the direct child `TreeView.Item` elements owned by `group` in DOM order.
 */
export function getDirectChildItems(group: Element): HTMLElement[] {
  return Array.from(group.querySelectorAll<HTMLElement>(ITEM_SELECTOR)).filter(
    (child) => child.closest(GROUP_SELECTOR) === group,
  );
}

function collectVisibleText(node: Node): string {
  if (node.nodeType === 3) {
    return node.textContent ?? '';
  }
  if (node.nodeType !== 1) {
    return '';
  }
  const el = node as Element;
  if (el.hasAttribute('data-leve-tree-view-group') || el.getAttribute('aria-hidden') === 'true') {
    return '';
  }
  let text = '';
  for (const child of Array.from(el.childNodes)) {
    text += collectVisibleText(child);
  }
  return text;
}

/**
 * Extracts the accessible label of a tree item for typeahead matching,
 * ignoring nested groups and decorative `aria-hidden="true"` indicators.
 */
export function getTreeItemLabel(item: HTMLElement): string {
  const explicit = item.getAttribute('data-text-value');
  if (explicit !== null) return explicit;
  return collectVisibleText(item).trim();
}

/**
 * Updates roving `tabIndex` across all items in `root` so only `target` has `tabIndex={0}`.
 */
export function setTreeTabStop(root: Element, target: HTMLElement): void {
  const allItems = getCollectionItems(root, ITEM_SELECTOR, ROOT_SELECTOR);
  for (const el of allItems) {
    el.tabIndex = el === target ? 0 : -1;
  }
}

/**
 * Updates roving `tabIndex`, syncs `focusedValue`, and focuses `target`.
 */
export function focusTreeItem(
  root: Element,
  target: HTMLElement,
  focusedValue?: Signal<string | null>,
): void {
  if (focusedValue) {
    const val = target.getAttribute('data-value');
    if (val !== null) {
      focusedValue.value = val;
    }
  }
  setTreeTabStop(root, target);
  target.focus();
}

/**
 * Moves roving focus among visible enabled tree items using exact element identity
 * (avoiding ancestor-containment ambiguity on nested `treeitem` elements).
 */
export function moveTreeRovingFocus(
  event: KeyboardEvent,
  root: Element,
  visibleItems: readonly HTMLElement[],
  currentItem: HTMLElement,
  focusedValue: Signal<string | null>,
): HTMLElement | null {
  const directionMap: Record<string, 'next' | 'previous' | 'first' | 'last'> = {
    ArrowDown: 'next',
    ArrowUp: 'previous',
    Home: 'first',
    End: 'last',
  };
  const direction = directionMap[event.key];
  if (!direction) return null;

  const nextItem = getAdjacentItem(visibleItems, currentItem, direction, { loop: false });
  if (!nextItem || nextItem === currentItem) return null;

  event.preventDefault();
  focusTreeItem(root, nextItem, focusedValue);
  return nextItem;
}

const treeTypeaheadStates = new WeakMap<Element, { buffer: string; lastTime: number }>();

/**
 * Clears the typeahead buffer associated with `root`.
 */
export function resetTreeTypeahead(root: Element): void {
  treeTypeaheadStates.delete(root);
}

/**
 * Moves focus to the next visible enabled tree item matching typed characters,
 * using exact element identity for nested tree items.
 */
export function moveTreeTypeaheadFocus(
  event: KeyboardEvent,
  root: Element,
  visibleItems: readonly HTMLElement[],
  currentItem: HTMLElement,
  focusedValue: Signal<string | null>,
): HTMLElement | null {
  if (visibleItems.length === 0) return null;

  const state = treeTypeaheadStates.get(root);
  let buffer = '';
  if (state && Date.now() - state.lastTime <= 500) {
    buffer = state.buffer;
  }

  if (!isTypeaheadKey(event, buffer)) {
    return null;
  }

  buffer += event.key;
  treeTypeaheadStates.set(root, { buffer, lastTime: Date.now() });

  const currentIndex = visibleItems.indexOf(currentItem);
  const labels = visibleItems.map(getTreeItemLabel);
  const isFocusable = visibleItems.map((el) => !isItemDisabled(el));

  const nextIndex = getTypeaheadIndex(buffer, currentIndex, labels, isFocusable);
  if (nextIndex !== null) {
    event.preventDefault();
    const nextItem = visibleItems[nextIndex];
    if (nextItem && nextItem !== currentItem) {
      focusTreeItem(root, nextItem, focusedValue);
      return nextItem;
    }
  }

  if (event.key === ' ') {
    event.preventDefault();
  }

  return null;
}
