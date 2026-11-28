import {
  $,
  component$,
  type PropsOf,
  Slot,
  useComputed$,
  useContext,
  useContextProvider,
} from '@builder.io/qwik';
import { dataAttr, itemId } from '@leve-ui/utils';
import { getItemText, selectContextId, selectItemContextId } from './select-context';

export type SelectItemProps = PropsOf<'div'> & {
  /** The value of the item. Must be unique within the select. */
  value: string;
  /**
   * Whether the item cannot be selected. Arrow keys and typeahead skip it.
   * @default false
   */
  disabled?: boolean;
  /** The display and typeahead text for the item, when it differs from `ItemText` or its text content. */
  textValue?: string;
};

/**
 * Selectable option (`role="option"`). Exposes `aria-selected` for selection and
 * `data-highlighted` for visual focus while DOM focus stays on `Select.Trigger`.
 */
export const SelectItem = component$<SelectItemProps>(
  ({ value, disabled, textValue, onClick$, onPointerMove$, ...props }) => {
    const context = useContext(selectContextId);
    const selected = useComputed$(() => context.value.value === value);
    const highlighted = useComputed$(() => context.highlighted.value === value);
    const isDisabled = useComputed$(() => Boolean(disabled));
    useContextProvider(selectItemContextId, {
      value,
      selected,
      highlighted,
      disabled: isDisabled,
    });

    const highlight$ = $(() => {
      if (!isDisabled.value && !highlighted.value) context.highlighted.value = value;
    });
    const select$ = $((_event: Event, element: HTMLElement) => {
      if (isDisabled.value) return;
      return context.select$(value, getItemText(element));
    });

    return (
      // biome-ignore lint/a11y/useFocusableInteractive: focus stays on the trigger; the option is highlighted with aria-activedescendant (adr/0035)
      <div
        {...props}
        id={itemId(context.ids.list, value)}
        role="option"
        aria-selected={selected.value ? 'true' : 'false'}
        aria-disabled={isDisabled.value ? 'true' : undefined}
        // Keeps focus on the trigger
        preventdefault:mousedown
        onPointerMove$={[highlight$, onPointerMove$]}
        onClick$={[select$, onClick$]}
        data-leve-select-item=""
        data-value={value}
        data-text-value={textValue}
        data-state={selected.value ? 'checked' : 'unchecked'}
        data-highlighted={dataAttr(highlighted.value)}
        data-disabled={dataAttr(isDisabled.value)}
      >
        <Slot />
      </div>
    );
  },
);
