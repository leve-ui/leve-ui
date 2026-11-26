import { createContextId, type QRL, type ReadonlySignal, type Signal } from '@builder.io/qwik';
import { getElementByIdInContainer } from '@leve-ui/utils';

export interface ComboboxIds {
  label: string;
  control: string;
  input: string;
  trigger: string;
  list: string;
}

/**
 * Why the text in the input changed.
 * - `'input'`: the user typed
 * - `'select'`: an item was selected, and its text was put in the input
 * - `'clear'`: Escape or the ClearTrigger cleared it
 * - `'blur'`: the input lost focus, and its text went back to the selected item
 */
export type ComboboxInputValueChangeReason = 'input' | 'select' | 'clear' | 'blur';

/**
 * How the input behaves after selecting an option.
 * - `'replace'` (default): puts the selected option's text in the input and reverts to it on blur.
 * - `'clear'`: clears the input text on selection so multiple picks (e.g. inside TagsInput) can follow.
 * - `'preserve'`: keeps the current input text as-is after selection and on blur.
 */
export type ComboboxSelectionBehavior = 'replace' | 'clear' | 'preserve';

/** Which item to highlight when the listbox opens */
export type ComboboxHighlight = 'first' | 'last' | 'selected' | null;

export interface ComboboxContext {
  ids: ComboboxIds;
  open: ReadonlySignal<boolean>;
  value: ReadonlySignal<string | null>;
  inputValue: ReadonlySignal<string>;
  /** The value of the highlighted item (`aria-activedescendant`) */
  highlighted: Signal<string | null>;
  /** The text of the selected item, put back in the input when it loses focus */
  selectedText: Signal<string>;
  selectionBehavior: ReadonlySignal<ComboboxSelectionBehavior>;
  disabled: ReadonlySignal<boolean>;
  required: ReadonlySignal<boolean>;
  loop: ReadonlySignal<boolean>;
  autoHighlight: ReadonlySignal<boolean>;
  openOnClick: ReadonlySignal<boolean>;
  /** Opens or closes the listbox; opening highlights an item */
  setOpen$: QRL<(open: boolean, highlight?: ComboboxHighlight) => Promise<void>>;
  /** Changes the text. Changes other than `'input'` are also written into the input element. */
  setInputValue$: QRL<(value: string, reason: ComboboxInputValueChangeReason) => Promise<void>>;
  /**
   * The last text set by something else than typing (selecting, clearing). The input writes it into
   * the element while it is still the current text, so an older text never overwrites what the user
   * is typing.
   */
  writtenText: ReadonlySignal<{ text: string } | null>;
  /** Selects an item: sets the value, puts its text in the input and closes */
  select$: QRL<(value: string, text: string) => Promise<void>>;
  /** Clears the value and the input */
  clear$: QRL<() => Promise<void>>;
}

export const comboboxContextId = createContextId<ComboboxContext>('leve-ui.combobox');

export interface ComboboxItemContext {
  value: string;
  selected: ReadonlySignal<boolean>;
  highlighted: ReadonlySignal<boolean>;
  disabled: ReadonlySignal<boolean>;
}

export const comboboxItemContextId = createContextId<ComboboxItemContext>('leve-ui.combobox-item');

export interface ComboboxGroupContext {
  labelId: string;
}

export const comboboxGroupContextId =
  createContextId<ComboboxGroupContext>('leve-ui.combobox-group');

/** The item elements of the listbox, in DOM order */
export const ITEM_SELECTOR = '[data-leve-combobox-item]';

/** The text an item puts in the input: its ItemText, its textValue, or its text */
export function getItemText(item: Element): string {
  const text = item.querySelector('[data-leve-combobox-item-text]')?.textContent?.trim();
  return text || item.getAttribute('data-text-value') || item.textContent?.trim() || '';
}

/** Finds the Combobox input element by id first, falling back to `[data-leve-combobox-input]` inside Root (for composed inputs with custom ids). */
export function getComboboxInput(
  anchor: HTMLElement | null | undefined,
  inputId: string,
): HTMLInputElement | null {
  if (!anchor) return null;
  const byId = getElementByIdInContainer<HTMLInputElement>(anchor, inputId);
  if (byId) return byId;
  const root = anchor.closest<HTMLElement>('[data-leve-combobox]');
  return root?.querySelector<HTMLInputElement>('[data-leve-combobox-input]') ?? null;
}
