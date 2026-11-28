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
  useId,
  useSignal,
} from '@builder.io/qwik';
import {
  dataAttr,
  getAdjacentItem,
  getCollectionItems,
  getTypeaheadIndex,
  isItemDisabled,
  isTypeaheadKey,
  itemId,
  useControllableState,
  useInheritedDisabled,
} from '@leve-ui/utils';
import {
  commitSelection,
  computeRangeSelection,
  computeToggleOrSelect,
  getActiveTypeaheadBuffer,
  getInitialHighlightItem,
  getItemText,
  getLatestSelection,
  ITEM_SELECTOR,
  listboxContextId,
  resetListboxTypeahead,
  updateTypeaheadBuffer,
} from './listbox-context';

export type ListboxRootProps = PropsOf<'div'> & {
  /**
   * The values of the selected items initially (uncontrolled).
   * @default []
   */
  defaultValue?: string[];
  /** A signal with the values of the selected items (controlled). */
  'bind:value'?: Signal<string[]>;
  /** Called when the selected items change. */
  onValueChange$?: QRL<(value: string[]) => void>;
  /**
   * Whether multiple items can be selected at once.
   * @default false
   */
  multiple?: boolean;
  /**
   * Whether the listbox is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether arrow keys wrap from the last item to the first and vice versa.
   * @default false
   */
  loop?: boolean;
  /**
   * The orientation of the listbox, which decides the arrow keys that move highlight.
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
};

/**
 * Root container for a standalone listbox (`role="listbox"`).
 *
 * Follows the WAI-ARIA APG Listbox pattern (`aria-activedescendant` focus model per `adr/0035`).
 * Focus stays on the root element while arrow keys, Home/End, and typeahead move the active
 * descendant highlight across enabled options. Supports both single and multiple selection.
 *
 * Provide an accessible name via `aria-label` or `aria-labelledby`.
 */
export const ListboxRoot = component$<ListboxRootProps>((props) => {
  const {
    defaultValue = [],
    'bind:value': bindValue,
    onValueChange$,
    multiple: _multiple,
    disabled: _disabled,
    loop: _loop,
    orientation: _orientation,
    onFocus$,
    onBlur$,
    onKeyDown$,
    ...restProps
  } = props;

  const [value, setValue$] = useControllableState<string[]>({
    value: bindValue,
    defaultValue: defaultValue ?? [],
    onChange$: onValueChange$,
  });

  const baseId = useId();
  const rootId = props.id ?? baseId;

  const multiple = useComputed$(() => Boolean(props.multiple));
  const inheritedDisabled = useInheritedDisabled();
  const disabled = useComputed$(() => Boolean(props.disabled) || inheritedDisabled.value);
  const loop = useComputed$(() => Boolean(props.loop));
  const orientation = useComputed$(() => props.orientation ?? 'vertical');

  const highlighted = useSignal<string | null>(null);
  const anchorValue = useSignal<string | null>(null);
  const shiftBase = useSignal<string[] | null>(null);

  const activeDescendant = useComputed$(() =>
    !disabled.value && highlighted.value !== null ? itemId(rootId, highlighted.value) : undefined,
  );
  const tabIndexAttr = useComputed$(() => (disabled.value ? -1 : (props.tabIndex ?? 0)));
  const disabledAttr = useComputed$(() => dataAttr(disabled.value));

  const handleFocus$ = $((_event: FocusEvent, root: HTMLElement) => {
    if (disabled.value) return;
    const items = getCollectionItems(root, ITEM_SELECTOR, '[data-leve-listbox]');
    if (items.length === 0) return;

    // Keep an existing enabled highlight (e.g. when clicking an option focuses the root)
    if (highlighted.value !== null) {
      const existing = items.find(
        (el) => el.getAttribute('data-value') === highlighted.value && !isItemDisabled(el),
      );
      if (existing) return;
    }

    const targetItem = getInitialHighlightItem(items, getLatestSelection(root, value.value));
    const nextValue = targetItem?.getAttribute('data-value') ?? null;
    highlighted.value = nextValue;
    anchorValue.value = nextValue;
    shiftBase.value = null;
    targetItem?.scrollIntoView?.({ block: 'nearest' });
  });

  const handleBlur$ = $((_event: FocusEvent, root: HTMLElement) => {
    highlighted.value = null;
    anchorValue.value = null;
    shiftBase.value = null;
    resetListboxTypeahead(root);
  });

  // Prevent browser scrolling and select-all synchronously before Qwik's async keydown handler runs
  const syncKeyDown$ = sync$((event: KeyboardEvent, target: HTMLElement) => {
    const el = target || (event.currentTarget as HTMLElement);
    if (!el || el.getAttribute('aria-disabled') === 'true') return;
    const isHorizontal = el.getAttribute('data-orientation') === 'horizontal';
    const key = event.key;
    if (!event.altKey && !event.ctrlKey && !event.metaKey) {
      const isNextPrev = isHorizontal
        ? key === 'ArrowRight' || key === 'ArrowLeft'
        : key === 'ArrowDown' || key === 'ArrowUp';
      if (isNextPrev || key === 'Home' || key === 'End' || key === ' ') {
        event.preventDefault();
      }
    }
    if (
      (event.ctrlKey || event.metaKey) &&
      !event.altKey &&
      key.toLowerCase() === 'a' &&
      el.getAttribute('aria-multiselectable') === 'true'
    ) {
      event.preventDefault();
    }
  });

  const handleKeyDown$ = $(async (event: KeyboardEvent, root: HTMLElement) => {
    if (disabled.value || event.isComposing) return;

    const items = getCollectionItems(root, ITEM_SELECTOR, '[data-leve-listbox]');
    if (items.length === 0) return;

    // If a key arrives before the lazy onFocus$ QRL finishes loading, initialize highlight first
    if (highlighted.value === null && root.ownerDocument.activeElement === root) {
      const initialItem = getInitialHighlightItem(items, getLatestSelection(root, value.value));
      const initialValue = initialItem?.getAttribute('data-value') ?? null;
      highlighted.value = initialValue;
      anchorValue.value = initialValue;
      shiftBase.value = null;
    }

    const current =
      items.find((item) => item.getAttribute('data-value') === highlighted.value) ?? null;

    // Ctrl+A / Cmd+A selects all enabled options in multiple mode
    if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === 'a') {
      if (!multiple.value) return;
      event.preventDefault();
      resetListboxTypeahead(root);
      shiftBase.value = null;
      const enabledValues = items
        .filter((item) => !isItemDisabled(item))
        .map((item) => item.getAttribute('data-value'))
        .filter((v): v is string => v !== null);
      await commitSelection(root, enabledValues, value.value, setValue$);
      return;
    }

    if (event.altKey || event.ctrlKey || event.metaKey) return;

    const isHorizontal = orientation.value === 'horizontal';
    let direction: 'first' | 'last' | 'next' | 'previous' | null = null;

    if (event.key === 'Home') {
      direction = 'first';
    } else if (event.key === 'End') {
      direction = 'last';
    } else if (isHorizontal) {
      const isRtl =
        typeof window !== 'undefined' && typeof window.getComputedStyle === 'function'
          ? window.getComputedStyle(root).direction === 'rtl'
          : root.closest('[dir]')?.getAttribute('dir') === 'rtl';
      if (event.key === 'ArrowRight') {
        direction = isRtl ? 'previous' : 'next';
      } else if (event.key === 'ArrowLeft') {
        direction = isRtl ? 'next' : 'previous';
      }
    } else if (event.key === 'ArrowDown') {
      direction = 'next';
    } else if (event.key === 'ArrowUp') {
      direction = 'previous';
    }

    if (direction !== null) {
      event.preventDefault();
      resetListboxTypeahead(root);
      const targetItem = getAdjacentItem(items, current, direction, {
        loop: !event.shiftKey && loop.value,
      });
      if (!targetItem) return;
      const targetValue = targetItem.getAttribute('data-value');
      if (targetValue === null) return;

      highlighted.value = targetValue;
      targetItem.scrollIntoView?.({ block: 'nearest' });

      if (event.shiftKey && multiple.value) {
        const anchor = anchorValue.value ?? current?.getAttribute('data-value') ?? targetValue;
        anchorValue.value = anchor;
        if (shiftBase.value === null) {
          shiftBase.value = getLatestSelection(root, value.value);
        }
        const next = computeRangeSelection(items, anchor, targetValue, shiftBase.value);
        await commitSelection(root, next, value.value, setValue$);
      } else {
        anchorValue.value = targetValue;
        shiftBase.value = null;
      }
      return;
    }

    // Check typeahead before Space selection so buffered spaces continue multi-word queries
    const typeaheadBuffer = getActiveTypeaheadBuffer(root);
    if (isTypeaheadKey(event, typeaheadBuffer)) {
      event.preventDefault();
      const nextBuffer = updateTypeaheadBuffer(root, typeaheadBuffer + event.key);
      const labels = items.map((item) => getItemText(item));
      const isFocusable = items.map((item) => !isItemDisabled(item));
      const currentIndex = current ? items.indexOf(current) : -1;
      const nextIndex = getTypeaheadIndex(nextBuffer, currentIndex, labels, isFocusable);
      if (nextIndex !== null) {
        const nextItem = items[nextIndex];
        const nextValue = nextItem?.getAttribute('data-value') ?? null;
        if (nextValue !== null) {
          highlighted.value = nextValue;
          anchorValue.value = nextValue;
          shiftBase.value = null;
          nextItem.scrollIntoView?.({ block: 'nearest' });
        }
      }
      return;
    }

    if (event.key === ' ' || event.key === 'Enter') {
      if (!current || isItemDisabled(current)) return;
      const currentValue = current.getAttribute('data-value');
      if (currentValue === null) return;
      event.preventDefault();
      resetListboxTypeahead(root);
      anchorValue.value = currentValue;
      shiftBase.value = null;
      const latest = getLatestSelection(root, value.value);
      const next = computeToggleOrSelect(latest, currentValue, multiple.value);
      if (next !== null) {
        await commitSelection(root, next, value.value, setValue$);
      }
    }
  });

  useContextProvider(listboxContextId, {
    rootId,
    value,
    highlighted,
    anchorValue,
    shiftBase,
    multiple,
    disabled,
    orientation,
    loop,
    setValue$,
  });

  return (
    <div
      {...restProps}
      id={rootId}
      role="listbox"
      tabIndex={tabIndexAttr.value}
      aria-multiselectable={multiple.value ? 'true' : undefined}
      aria-activedescendant={activeDescendant.value}
      aria-orientation={orientation.value}
      aria-disabled={disabled.value ? 'true' : undefined}
      data-leve-listbox=""
      data-orientation={orientation.value}
      data-disabled={disabledAttr.value}
      onFocus$={[handleFocus$, onFocus$]}
      onBlur$={[handleBlur$, onBlur$]}
      onKeyDown$={[syncKeyDown$, handleKeyDown$, onKeyDown$]}
    >
      <Slot />
    </div>
  );
});
