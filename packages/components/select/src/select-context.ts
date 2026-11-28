import { createContextId, type QRL, type ReadonlySignal, type Signal } from '@builder.io/qwik';
import { getCollectionItems, getElementByIdInContainer } from '@leve-ui/utils';

export interface SelectIds {
  label: string;
  trigger: string;
  list: string;
}

/** Which item to highlight when the listbox opens */
export type SelectHighlight = 'first' | 'last' | 'selected' | 'selected-last' | null;

export interface SelectContext {
  ids: SelectIds;
  open: ReadonlySignal<boolean>;
  value: ReadonlySignal<string | null>;
  /** The value of the highlighted item (`aria-activedescendant`) */
  highlighted: Signal<string | null>;
  /** The display text of the selected item */
  selectedText: Signal<string>;
  disabled: ReadonlySignal<boolean>;
  required: ReadonlySignal<boolean>;
  loop: ReadonlySignal<boolean>;
  /** Opens or closes the listbox; opening highlights an item */
  setOpen$: QRL<(open: boolean, highlight?: SelectHighlight) => Promise<void>>;
  /** Selects an item: sets the value, updates the displayed text, and closes */
  select$: QRL<(value: string, text: string) => Promise<void>>;
  /** Resets the uncontrolled value to its initial defaultValue */
  reset$: QRL<() => Promise<void>>;
}

export const selectContextId = createContextId<SelectContext>('leve-ui.select');

export interface SelectItemContext {
  value: string;
  selected: ReadonlySignal<boolean>;
  highlighted: ReadonlySignal<boolean>;
  disabled: ReadonlySignal<boolean>;
}

export const selectItemContextId = createContextId<SelectItemContext>('leve-ui.select-item');

export interface SelectGroupContext {
  labelId: string;
}

export const selectGroupContextId = createContextId<SelectGroupContext>('leve-ui.select-group');

/** The item elements of the listbox, in DOM order */
export const ITEM_SELECTOR = '[data-leve-select-item]';

/** The display text of an item: its ItemText, its textValue, or its text */
export function getItemText(item: Element): string {
  const text = item.querySelector('[data-leve-select-item-text]')?.textContent?.trim();
  return text || item.getAttribute('data-text-value') || item.textContent?.trim() || '';
}

/** The text used for typeahead matching: `textValue` first, then `getItemText` */
export function getItemTypeaheadText(item: Element): string {
  return item.getAttribute('data-text-value') || getItemText(item);
}

/** Finds the Select trigger element by id first, falling back to `[data-leve-select-trigger]` inside Root. */
export function getSelectTrigger(
  anchor: HTMLElement | null | undefined,
  triggerId: string,
): HTMLButtonElement | null {
  if (!anchor) return null;
  const byId = getElementByIdInContainer<HTMLButtonElement>(anchor, triggerId);
  if (byId) return byId;
  const root = anchor.closest<HTMLElement>('[data-leve-select]');
  return root?.querySelector<HTMLButtonElement>('[data-leve-select-trigger]') ?? null;
}

/** Resolves the display text of the currently selected value from the rendered list items in the DOM. */
export function resolveSelectedText(
  anchor: HTMLElement | undefined,
  listId: string,
  value: string | null,
): string {
  if (!anchor || value === null) return '';
  const list = getElementByIdInContainer(anchor, listId);
  if (!list) return '';
  const items = getCollectionItems(list, ITEM_SELECTOR);
  const matched = items.find((element) => element.getAttribute('data-value') === value);
  return matched ? getItemText(matched) : '';
}
