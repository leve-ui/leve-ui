import { createContextId, type QRL, type ReadonlySignal, type Signal } from '@builder.io/qwik';
import { getAdjacentItem, getItemTextValue, isItemDisabled } from '@leve-ui/utils';

export interface ListboxContext {
  rootId: string;
  value: ReadonlySignal<string[]>;
  highlighted: Signal<string | null>;
  anchorValue: Signal<string | null>;
  shiftBase: Signal<string[] | null>;
  multiple: ReadonlySignal<boolean>;
  disabled: ReadonlySignal<boolean>;
  orientation: ReadonlySignal<'vertical' | 'horizontal'>;
  loop: ReadonlySignal<boolean>;
  setValue$: QRL<(next: string[]) => Promise<void>>;
}

export const listboxContextId = createContextId<ListboxContext>('leve-ui.listbox');

export interface ListboxItemContext {
  value: string;
  selected: ReadonlySignal<boolean>;
  highlighted: ReadonlySignal<boolean>;
  disabled: ReadonlySignal<boolean>;
}

export const listboxItemContextId = createContextId<ListboxItemContext>('leve-ui.listbox-item');

export interface ListboxGroupContext {
  labelId: string;
}

export const listboxGroupContextId = createContextId<ListboxGroupContext>('leve-ui.listbox-group');

/** Selector for option elements inside a Listbox root */
export const ITEM_SELECTOR = '[data-leve-listbox-item]';

/** Resolves the typeahead label of an option: explicit `textValue`, `ItemText`, or text content. */
export function getItemText(item: Element): string {
  const explicit = item.getAttribute('data-text-value');
  if (explicit !== null) return explicit;
  const itemText = item.querySelector('[data-leve-listbox-item-text]')?.textContent?.trim();
  return itemText || getItemTextValue(item);
}

/** Finds the first selected enabled option, or falls back to the first enabled option. */
export function getInitialHighlightItem(
  items: readonly HTMLElement[],
  selectedValues: readonly string[],
): HTMLElement | null {
  return (
    items.find(
      (el) => selectedValues.includes(el.getAttribute('data-value') ?? '') && !isItemDisabled(el),
    ) ?? getAdjacentItem(items, null, 'first')
  );
}

/** Computes the next selection array for single or multiple toggle selection, or `null` if unchanged. */
export function computeToggleOrSelect(
  current: readonly string[],
  itemValue: string,
  multiple: boolean,
): string[] | null {
  if (multiple) {
    return current.includes(itemValue)
      ? current.filter((v) => v !== itemValue)
      : [...current, itemValue];
  }
  if (current.length === 1 && current[0] === itemValue) return null;
  return [itemValue];
}

/** Computes the next selection array when extending a range from `anchorValue` to `targetValue`. */
export function computeRangeSelection(
  items: readonly HTMLElement[],
  anchorValue: string,
  targetValue: string,
  base: readonly string[],
): string[] {
  const targetIndex = items.findIndex((el) => el.getAttribute('data-value') === targetValue);
  if (targetIndex === -1) return [...base];

  const rawAnchorIndex = items.findIndex((el) => el.getAttribute('data-value') === anchorValue);
  const anchorIndex = rawAnchorIndex === -1 ? targetIndex : rawAnchorIndex;

  const start = Math.min(anchorIndex, targetIndex);
  const end = Math.max(anchorIndex, targetIndex);
  const rangeValues = items
    .slice(start, end + 1)
    .filter((el) => !isItemDisabled(el))
    .map((el) => el.getAttribute('data-value'))
    .filter((v): v is string => v !== null);

  const baseSet = new Set(base);
  return [...base, ...rangeValues.filter((v) => !baseSet.has(v))];
}

interface SelectionQueueState {
  inFlight: boolean;
  latest: string[];
  hasPending: boolean;
}

const selectionQueues = new WeakMap<Element, SelectionQueueState>();

/** Returns the latest synchronous selection (including queued updates not yet flushed by `setValue$`). */
export function getLatestSelection(root: Element | null, committed: readonly string[]): string[] {
  if (!root) return [...committed];
  const state = selectionQueues.get(root);
  return state?.inFlight || state?.hasPending ? [...state.latest] : [...committed];
}

/**
 * Serializes `setValue$` updates per root element so rapid consecutive key/click events
 * never overwrite a newer selection when `setValue$` executes asynchronously.
 */
export async function commitSelection(
  root: Element | null,
  next: string[],
  currentCommitted: readonly string[],
  setValue$: QRL<(value: string[]) => Promise<void>>,
): Promise<void> {
  if (!root) {
    await setValue$(next);
    return;
  }

  let state = selectionQueues.get(root);
  if (!state) {
    state = { inFlight: false, latest: [...currentCommitted], hasPending: false };
    selectionQueues.set(root, state);
  }

  const prev = state.inFlight || state.hasPending ? state.latest : currentCommitted;
  if (next.length === prev.length && next.every((v, idx) => v === prev[idx])) {
    return;
  }

  state.latest = next;
  state.hasPending = true;
  if (state.inFlight) return;

  state.inFlight = true;
  try {
    while (state.hasPending) {
      const target = state.latest;
      state.hasPending = false;
      await setValue$(target);
    }
  } finally {
    state.inFlight = false;
    state.hasPending = false;
  }
}

const TYPEAHEAD_TIMEOUT = 500;

interface TypeaheadState {
  buffer: string;
  lastTime: number;
}

const typeaheadStates = new WeakMap<Element, TypeaheadState>();

/** Returns the active typeahead buffer for a listbox root, or `''` if timed out. */
export function getActiveTypeaheadBuffer(root: Element): string {
  const state = typeaheadStates.get(root);
  if (!state) return '';
  if (Date.now() - state.lastTime > TYPEAHEAD_TIMEOUT) {
    typeaheadStates.delete(root);
    return '';
  }
  return state.buffer;
}

/** Appends to the typeahead buffer and refreshes its timestamp. */
export function updateTypeaheadBuffer(root: Element, buffer: string): string {
  typeaheadStates.set(root, { buffer, lastTime: Date.now() });
  return buffer;
}

/** Clears the typeahead buffer for a listbox root. */
export function resetListboxTypeahead(root: Element): void {
  typeaheadStates.delete(root);
}
