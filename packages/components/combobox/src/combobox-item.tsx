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
import { comboboxContextId, comboboxItemContextId, getItemText } from './combobox-context';

export type ComboboxItemProps = PropsOf<'div'> & {
  /** The value of the item. Unique in the combobox. */
  value: string;
  /**
   * Whether the item cannot be selected. Arrow keys skip it.
   * @default false
   */
  disabled?: boolean;
  /** The text put in the input when the item is selected, when it differs from the ItemText. */
  textValue?: string;
};

/**
 * 候補 1 件（`role="option"`）です。`aria-selected` で選択中を、`data-highlighted` で強調中を示します。
 *
 * ポインタを載せると強調し、クリックで選びます。押しても Input のフォーカスを保ちます。
 */
export const ComboboxItem = component$<ComboboxItemProps>(
  ({ value, disabled, textValue, onClick$, onPointerMove$, ...props }) => {
    const context = useContext(comboboxContextId);
    const selected = useComputed$(() => context.value.value === value);
    const highlighted = useComputed$(() => context.highlighted.value === value);
    const isDisabled = useComputed$(() => Boolean(disabled));
    useContextProvider(comboboxItemContextId, {
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
      // biome-ignore lint/a11y/useFocusableInteractive: focus stays in the input; the option is highlighted with aria-activedescendant (adr/0035)
      <div
        {...props}
        id={itemId(context.ids.list, value)}
        role="option"
        aria-selected={selected.value ? 'true' : 'false'}
        aria-disabled={isDisabled.value ? 'true' : undefined}
        // Keeps focus in the input
        preventdefault:mousedown
        onPointerMove$={[highlight$, onPointerMove$]}
        onClick$={[select$, onClick$]}
        data-leve-combobox-item=""
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
