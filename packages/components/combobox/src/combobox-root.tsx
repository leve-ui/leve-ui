import {
  $,
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useComputed$,
  useContextProvider,
  useId,
  useSignal,
} from '@builder.io/qwik';
import {
  dataAttr,
  getAdjacentItem,
  getCollectionItems,
  useControllableState,
  useFieldContext,
  useInheritedDisabled,
} from '@leve-ui/utils';
import {
  type ComboboxHighlight,
  type ComboboxIds,
  type ComboboxInputValueChangeReason,
  comboboxContextId,
  ITEM_SELECTOR,
} from './combobox-context';

export type ComboboxRootProps = PropsOf<'div'> & {
  /** Overrides the element IDs of the parts. Inside a Field, the Field's ids are used. */
  ids?: Partial<ComboboxIds>;
  /** The value of the selected item initially (uncontrolled). */
  defaultValue?: string | null;
  /** A signal with the value of the selected item (controlled). `null` when nothing is selected. */
  'bind:value'?: Signal<string | null>;
  /** Called when the user selects an item or clears the combobox. */
  onValueChange$?: QRL<(value: string | null) => void>;
  /**
   * The text in the input initially (uncontrolled). With `defaultValue`, pass the text of that item.
   * @default ''
   */
  defaultInputValue?: string;
  /** A signal with the text in the input (controlled). Use it to filter the items. */
  'bind:inputValue'?: Signal<string>;
  /**
   * Called when the text in the input changes. `reason` tells why: `'input'` when the user typed,
   * `'select'`, `'clear'` or `'blur'` otherwise. Filter only on `'input'` to show all the items
   * when the listbox opens again after a selection.
   */
  onInputValueChange$?: QRL<
    (value: string, details: { reason: ComboboxInputValueChangeReason }) => void
  >;
  /**
   * Whether the listbox is open initially (uncontrolled).
   * @default false
   */
  defaultOpen?: boolean;
  /** A signal with the open state of the listbox (controlled). */
  'bind:open'?: Signal<boolean>;
  /** Called when the listbox opens or closes by a user interaction. */
  onOpenChange$?: QRL<(open: boolean) => void>;
  /**
   * Whether the combobox is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether a value is required in a form.
   * @default false
   */
  required?: boolean;
  /**
   * Whether ArrowDown on the last item moves to the first one, and ArrowUp on the first to the last.
   * @default false
   */
  loop?: boolean;
  /**
   * Whether typing highlights the first item, so Enter selects it.
   * @default false
   */
  autoHighlight?: boolean;
  /**
   * Whether clicking the input opens the listbox.
   * @default false
   */
  openOnClick?: boolean;
};

/**
 * コンボボックス（入力して候補から選ぶ）のルート要素です。状態を持ち、Context を提供します。
 *
 * WAI-ARIA APG の Combobox パターン（リストの自動補完）に準拠します。フォーカスは Input に置いたまま、
 * 強調中の項目を `aria-activedescendant` で示します（`adr/0035`）。候補の絞り込みは利用者が
 * `bind:inputValue` で行います。Content は `popover="manual"` で最前面に出し（`adr/0029`）、
 * Floating UI で Control の下に置きます（`adr/0030`）。
 */
export const ComboboxRoot = component$<ComboboxRootProps>(
  ({
    ids: propIds,
    defaultValue,
    'bind:value': bindValue,
    onValueChange$,
    defaultInputValue,
    'bind:inputValue': bindInputValue,
    onInputValueChange$,
    defaultOpen,
    'bind:open': bindOpen,
    onOpenChange$,
    disabled: _disabled,
    required: _required,
    loop: _loop,
    autoHighlight: _autoHighlight,
    openOnClick: _openOnClick,
    ...props
  }) => {
    const [value, setValue$] = useControllableState<string | null>({
      value: bindValue,
      defaultValue: defaultValue ?? null,
      onChange$: onValueChange$,
    });
    const inputValueReason = useSignal<ComboboxInputValueChangeReason>('input');
    const [inputValue, setInputValueState$] = useControllableState<string>({
      value: bindInputValue,
      defaultValue: defaultInputValue ?? '',
      onChange$: $((next: string) =>
        onInputValueChange$?.(next, { reason: inputValueReason.value }),
      ),
    });
    const [open, setOpenState$] = useControllableState<boolean>({
      value: bindOpen,
      defaultValue: defaultOpen ?? false,
      onChange$: onOpenChange$,
    });
    const root = useSignal<HTMLElement>();
    const highlighted = useSignal<string | null>(null);
    const selectedText = useSignal(defaultValue ? (defaultInputValue ?? '') : '');

    const field = useFieldContext();
    const inheritedDisabled = useInheritedDisabled();
    const disabled = useComputed$(() => Boolean(_disabled) || inheritedDisabled.value);
    const required = useComputed$(() => Boolean(_required) || Boolean(field?.required.value));
    const loop = useComputed$(() => Boolean(_loop));
    const autoHighlight = useComputed$(() => Boolean(_autoHighlight));
    const openOnClick = useComputed$(() => Boolean(_openOnClick));

    const base = useId();
    const ids: ComboboxIds = {
      label: field?.ids.label ?? propIds?.label ?? `${base}-label`,
      control: propIds?.control ?? `${base}-control`,
      input: field?.ids.control ?? propIds?.input ?? `${base}-input`,
      trigger: propIds?.trigger ?? `${base}-trigger`,
      list: propIds?.list ?? `${base}-list`,
    };

    const setOpen$ = $(async (next: boolean, highlight: ComboboxHighlight = null) => {
      if (next && disabled.value) return;
      if (next && highlight) {
        // The items are in the DOM while the listbox is closed, so the highlight can be set now
        const list = root.value?.ownerDocument.getElementById(ids.list);
        const items = list ? getCollectionItems(list, ITEM_SELECTOR) : [];
        const item =
          highlight === 'selected'
            ? (items.find((element) => element.getAttribute('data-value') === value.value) ?? null)
            : getAdjacentItem(items, null, highlight);
        highlighted.value = item?.getAttribute('data-value') ?? null;
      }
      if (!next) highlighted.value = null;
      if (open.value !== next) await setOpenState$(next);
    });
    const writtenText = useSignal<{ text: string } | null>(null);
    const setInputValue$ = $(async (text: string, reason: ComboboxInputValueChangeReason) => {
      // The calls from typing may finish out of order while their code loads: read the element, so
      // the last one to finish never sets an older text
      const input = root.value?.ownerDocument.getElementById(ids.input) as HTMLInputElement | null;
      const typed = reason === 'input';
      const next = typed && input ? input.value : text;
      if (!typed) writtenText.value = { text: next };
      inputValueReason.value = reason;
      if (inputValue.value !== next) await setInputValueState$(next);
    });
    const select$ = $(async (next: string, text: string) => {
      selectedText.value = text;
      if (value.value !== next) await setValue$(next);
      await setInputValue$(text, 'select');
      await setOpen$(false);
    });
    const clear$ = $(async () => {
      selectedText.value = '';
      if (value.value !== null) await setValue$(null);
      await setInputValue$('', 'clear');
    });

    useContextProvider(comboboxContextId, {
      ids,
      open,
      value,
      inputValue,
      highlighted,
      selectedText,
      disabled,
      required,
      loop,
      autoHighlight,
      openOnClick,
      setOpen$,
      setInputValue$,
      writtenText,
      select$,
      clear$,
    });

    return (
      <div
        {...props}
        ref={root}
        data-leve-combobox=""
        data-state={open.value ? 'open' : 'closed'}
        data-disabled={dataAttr(disabled.value)}
      >
        <Slot />
      </div>
    );
  },
);
