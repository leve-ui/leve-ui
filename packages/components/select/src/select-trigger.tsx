import {
  $,
  component$,
  type PropsOf,
  Slot,
  sync$,
  useContext,
  useSignal,
  useTask$,
} from '@builder.io/qwik';
import {
  dataAttr,
  getAdjacentItem,
  getCollectionItems,
  getElementByIdInContainer,
  getTypeaheadIndex,
  isItemDisabled,
  isTypeaheadKey,
  itemId,
  useFieldControl,
} from '@leve-ui/utils';
import {
  getItemText,
  getItemTypeaheadText,
  ITEM_SELECTOR,
  selectContextId,
} from './select-context';

export type SelectTriggerProps = PropsOf<'button'> & {
  /**
   * Whether the select value is invalid. Inside a Field, the Field's `invalid` also applies.
   * @default false
   */
  invalid?: boolean;
};

/**
 * Button (`role="combobox"`) that toggles the listbox and keeps DOM focus while open.
 *
 * Exposes `aria-activedescendant` for the highlighted option and handles APG Select-Only
 * keyboard navigation, including Arrow keys, Home/End, Enter/Space, Escape, Tab, and typeahead.
 */
export const SelectTrigger = component$<SelectTriggerProps>(
  ({ invalid, onClick$, onKeyDown$, onFocusOut$, ...props }) => {
    const context = useContext(selectContextId);
    const control = useFieldControl({
      id: props.id ?? context.ids.trigger,
      invalid: Boolean(invalid) || props['aria-invalid'] === 'true',
      disabled: context.disabled.value || Boolean(props.disabled),
      required: context.required.value || props['aria-required'] === 'true',
      'aria-describedby': props['aria-describedby'],
    });
    const typeahead = useSignal<{ buffer: string; lastTime: number }>({
      buffer: '',
      lastTime: 0,
    });

    useTask$(({ track }) => {
      const open = track(() => context.open.value);
      if (!open) {
        typeahead.value = { buffer: '', lastTime: 0 };
      }
    });

    const click$ = $(async () => {
      if (control.value.disabled) return;
      await context.setOpen$(!context.open.value, 'selected');
    });

    // Prevent scrolling and suppress native <button> click synthesis for Enter/Space so keyDown$
    // owns open/select behavior without click$ immediately toggling the state back.
    const preventDefault$ = sync$((event: KeyboardEvent) => {
      const key = event.key;
      if (
        key === 'ArrowDown' ||
        key === 'ArrowUp' ||
        key === 'Home' ||
        key === 'End' ||
        key === 'Enter' ||
        key === ' '
      ) {
        event.preventDefault();
      }
    });

    const keyDown$ = $(async (event: KeyboardEvent, element: HTMLButtonElement) => {
      if (control.value.disabled || event.isComposing) return;
      const list = getElementByIdInContainer(element, context.ids.list);
      const items = list ? getCollectionItems(list, ITEM_SELECTOR) : [];
      const open = context.open.value;
      const highlightedItem =
        items.find((item) => item.getAttribute('data-value') === context.highlighted.value) ?? null;

      const now = Date.now();
      const buffer = now - typeahead.value.lastTime <= 500 ? typeahead.value.buffer : '';

      if (isTypeaheadKey(event, buffer)) {
        const nextBuffer = buffer + event.key;
        const labels = items.map(getItemTypeaheadText);
        const isFocusable = items.map((item) => !isItemDisabled(item));

        if (open) {
          typeahead.value = { buffer: nextBuffer, lastTime: now };
          const currentIndex = highlightedItem ? items.indexOf(highlightedItem) : -1;
          const nextIndex = getTypeaheadIndex(nextBuffer, currentIndex, labels, isFocusable);
          if (nextIndex !== null) {
            context.highlighted.value = items[nextIndex].getAttribute('data-value') ?? null;
          }
        } else {
          const currentIndex =
            context.value.value !== null
              ? items.findIndex((item) => item.getAttribute('data-value') === context.value.value)
              : -1;
          const nextIndex = getTypeaheadIndex(nextBuffer, currentIndex, labels, isFocusable);
          const query = nextBuffer.toLocaleLowerCase();
          const currentMatches =
            currentIndex >= 0 &&
            isFocusable[currentIndex] &&
            labels[currentIndex].trim().toLocaleLowerCase().startsWith(query);

          const targetIndex = nextIndex ?? (currentMatches ? currentIndex : null);
          if (targetIndex !== null) {
            typeahead.value = { buffer: nextBuffer, lastTime: now };
            context.highlighted.value = items[targetIndex].getAttribute('data-value') ?? null;
            await context.setOpen$(true);
          } else {
            typeahead.value = { buffer: '', lastTime: 0 };
          }
        }
        return;
      }

      switch (event.key) {
        case 'ArrowDown':
          if (!open) {
            return context.setOpen$(true, 'selected');
          }
          if (event.altKey) return;
          context.highlighted.value =
            getAdjacentItem(items, highlightedItem, 'next', {
              loop: context.loop.value,
            })?.getAttribute('data-value') ?? null;
          return;
        case 'ArrowUp':
          if (!open) {
            return context.setOpen$(true, 'selected-last');
          }
          if (event.altKey) {
            return context.setOpen$(false);
          }
          context.highlighted.value =
            getAdjacentItem(items, highlightedItem, 'previous', {
              loop: context.loop.value,
            })?.getAttribute('data-value') ?? null;
          return;
        case 'Home':
          if (!open) {
            return context.setOpen$(true, 'first');
          }
          context.highlighted.value =
            getAdjacentItem(items, null, 'first')?.getAttribute('data-value') ?? null;
          return;
        case 'End':
          if (!open) {
            return context.setOpen$(true, 'last');
          }
          context.highlighted.value =
            getAdjacentItem(items, null, 'last')?.getAttribute('data-value') ?? null;
          return;
        case 'Enter':
        case ' ':
          if (!open) {
            return context.setOpen$(true, 'selected');
          }
          if (highlightedItem && !isItemDisabled(highlightedItem)) {
            return context.select$(
              highlightedItem.getAttribute('data-value') ?? '',
              getItemText(highlightedItem),
            );
          }
          return context.setOpen$(false);
        case 'Escape': {
          if (!open) return;
          const content = getElementByIdInContainer(element, context.ids.list)?.closest(
            '[popover]',
          );
          let popoverOpen = false;
          try {
            popoverOpen = Boolean(content?.matches(':popover-open'));
          } catch {
            popoverOpen = false;
          }
          // In browsers with Popover API, openPopoverElement (closeOnEscape) already closes it
          if (!popoverOpen) {
            return context.setOpen$(false);
          }
          return;
        }
        case 'Tab':
          if (open) {
            return context.setOpen$(false);
          }
          return;
      }
    });

    const focusOut$ = $(async (event: FocusEvent, element: HTMLButtonElement) => {
      const related = event.relatedTarget as Node | null;
      const content = getElementByIdInContainer(element, context.ids.list)?.closest('[popover]');
      if (related && content?.contains(related)) return;
      await context.setOpen$(false);
    });

    const highlighted = context.highlighted.value;
    const isPlaceholder = context.value.value === null;

    return (
      <button
        {...props}
        type="button"
        id={control.value.id}
        role="combobox"
        disabled={control.value.disabled}
        aria-haspopup="listbox"
        aria-expanded={context.open.value ? 'true' : 'false'}
        aria-controls={context.ids.list}
        aria-activedescendant={
          context.open.value && highlighted !== null
            ? itemId(context.ids.list, highlighted)
            : undefined
        }
        aria-labelledby={
          props['aria-labelledby'] ?? (props['aria-label'] ? undefined : context.ids.label)
        }
        aria-describedby={control.value.describedBy}
        aria-invalid={control.value.invalid ? 'true' : undefined}
        aria-required={control.value.required ? 'true' : undefined}
        onClick$={[click$, onClick$]}
        onKeyDown$={[preventDefault$, keyDown$, onKeyDown$]}
        onFocusOut$={[focusOut$, onFocusOut$]}
        data-leve-select-trigger=""
        data-state={context.open.value ? 'open' : 'closed'}
        data-placeholder={dataAttr(isPlaceholder)}
        data-disabled={dataAttr(control.value.disabled)}
        data-invalid={dataAttr(control.value.invalid)}
      >
        <Slot />
      </button>
    );
  },
);
