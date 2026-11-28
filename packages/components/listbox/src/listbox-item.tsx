import {
  $,
  component$,
  type PropsOf,
  Slot,
  useComputed$,
  useContext,
  useContextProvider,
} from '@builder.io/qwik';
import { dataAttr, getCollectionItems, itemId } from '@leve-ui/utils';
import {
  commitSelection,
  computeRangeSelection,
  computeToggleOrSelect,
  getLatestSelection,
  ITEM_SELECTOR,
  listboxContextId,
  listboxItemContextId,
  resetListboxTypeahead,
} from './listbox-context';

export type ListboxItemProps = PropsOf<'div'> & {
  /** The value of the item. Unique in the listbox. */
  value: string;
  /**
   * Whether the item cannot be selected. Arrow keys and typeahead skip it.
   * @default false
   */
  disabled?: boolean;
  /** The text used by typeahead when it differs from the item's text content. */
  textValue?: string;
};

/**
 * An option inside a `Listbox.Root` (`role="option"`).
 *
 * Exposes `aria-selected` for selection state and `data-highlighted` when pointed to
 * by the root's `aria-activedescendant`.
 */
export const ListboxItem = component$<ListboxItemProps>((props) => {
  const {
    value: _value,
    disabled: _disabled,
    textValue: _textValue,
    onClick$,
    ...restProps
  } = props;
  const context = useContext(listboxContextId);

  const isDisabled = useComputed$(() => Boolean(props.disabled) || context.disabled.value);
  const selected = useComputed$(() => context.value.value.includes(props.value));
  const highlighted = useComputed$(
    () => !isDisabled.value && context.highlighted.value === props.value,
  );

  useContextProvider(listboxItemContextId, {
    value: props.value,
    selected,
    highlighted,
    disabled: isDisabled,
  });

  const handleClick$ = $(async (event: MouseEvent, element: HTMLElement) => {
    if (isDisabled.value) return;
    const root = element.closest<HTMLElement>('[data-leve-listbox]');
    const previousHighlighted = context.highlighted.value;
    context.highlighted.value = props.value;

    let next: string[] | null = null;
    const latest = getLatestSelection(root, context.value.value);

    if (event.shiftKey && context.multiple.value && root) {
      const items = getCollectionItems(root, ITEM_SELECTOR, '[data-leve-listbox]');
      const anchor = context.anchorValue.value ?? previousHighlighted ?? props.value;
      context.anchorValue.value = anchor;
      if (context.shiftBase.value === null) {
        context.shiftBase.value = latest;
      }
      next = computeRangeSelection(items, anchor, props.value, context.shiftBase.value);
    } else {
      context.anchorValue.value = props.value;
      context.shiftBase.value = null;
      next = computeToggleOrSelect(latest, props.value, context.multiple.value);
    }

    if (root) {
      resetListboxTypeahead(root);
      if (root.ownerDocument.activeElement !== root) {
        root.focus?.();
      }
    }

    if (next !== null) {
      await commitSelection(root, next, context.value.value, context.setValue$);
    }
  });

  return (
    // biome-ignore lint/a11y/useFocusableInteractive: focus stays on Root; the option is highlighted via aria-activedescendant (adr/0035)
    <div
      {...restProps}
      id={itemId(context.rootId, props.value)}
      role="option"
      aria-selected={selected.value ? 'true' : 'false'}
      aria-disabled={isDisabled.value ? 'true' : undefined}
      data-leve-listbox-item=""
      data-value={props.value}
      data-text-value={props.textValue}
      data-state={selected.value ? 'checked' : 'unchecked'}
      data-highlighted={dataAttr(highlighted.value)}
      data-disabled={dataAttr(isDisabled.value)}
      data-orientation={context.orientation.value}
      onClick$={[handleClick$, onClick$]}
    >
      <Slot />
    </div>
  );
});
