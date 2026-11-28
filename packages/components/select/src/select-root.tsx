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
  useVisibleTask$,
} from '@builder.io/qwik';
import {
  dataAttr,
  getAdjacentItem,
  getCollectionItems,
  getElementByIdInContainer,
  isItemDisabled,
  useControllableState,
  useFieldContext,
  useInheritedDisabled,
} from '@leve-ui/utils';
import {
  ITEM_SELECTOR,
  resolveSelectedText,
  type SelectHighlight,
  type SelectIds,
  selectContextId,
} from './select-context';

export type SelectRootProps = PropsOf<'div'> & {
  /** Overrides the element IDs of the parts. Inside a Field, the Field's IDs are used for the label and trigger. */
  ids?: Partial<SelectIds>;
  /**
   * The value of the selected item initially (uncontrolled).
   * @default null
   */
  defaultValue?: string | null;
  /** A signal with the value of the selected item (controlled). `null` when nothing is selected. */
  'bind:value'?: Signal<string | null>;
  /** Called when the selected value changes. */
  onValueChange$?: QRL<(value: string | null) => void>;
  /**
   * Whether the listbox is open initially (uncontrolled).
   * @default false
   */
  defaultOpen?: boolean;
  /** A signal with the open state of the listbox (controlled). */
  'bind:open'?: Signal<boolean>;
  /** Called when the listbox opens or closes. */
  onOpenChange$?: QRL<(open: boolean) => void>;
  /**
   * Whether the select is disabled. Inside a Field or Fieldset, inherited `disabled` also applies.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether a value is required in a form. Inside a Field, the Field's `required` also applies.
   * @default false
   */
  required?: boolean;
  /**
   * Whether ArrowDown on the last item moves to the first one, and ArrowUp on the first to the last.
   * @default false
   */
  loop?: boolean;
};

/**
 * Root container for the Select component. Holds selection and open state and provides context.
 *
 * Follows the WAI-ARIA APG Select-Only Combobox pattern. Focus stays on `Trigger`, while the
 * highlighted option is exposed via `aria-activedescendant` (`adr/0035`). `Content` renders in
 * the top layer with `popover="manual"` (`adr/0029`) and is positioned via Floating UI (`adr/0030`).
 */
export const SelectRoot = component$<SelectRootProps>(
  ({
    ids: propIds,
    defaultValue,
    'bind:value': bindValue,
    onValueChange$,
    defaultOpen,
    'bind:open': bindOpen,
    onOpenChange$,
    disabled: _disabled,
    required: _required,
    loop: _loop,
    ...props
  }) => {
    const [value, setValue$, resetValue$] = useControllableState<string | null>({
      value: bindValue,
      defaultValue: defaultValue ?? null,
      onChange$: onValueChange$,
    });
    const [open, setOpenState$] = useControllableState<boolean>({
      value: bindOpen,
      defaultValue: defaultOpen ?? false,
      onChange$: onOpenChange$,
    });
    const root = useSignal<HTMLElement>();
    const highlighted = useSignal<string | null>(null);
    const selectedText = useSignal('');

    const field = useFieldContext();
    const inheritedDisabled = useInheritedDisabled();
    const disabled = useComputed$(() => Boolean(_disabled) || inheritedDisabled.value);
    const required = useComputed$(() => Boolean(_required) || Boolean(field?.required.value));
    const loop = useComputed$(() => Boolean(_loop));

    const base = useId();
    const ids: SelectIds = {
      label: field?.ids.label ?? propIds?.label ?? `${base}-label`,
      trigger: field?.ids.control ?? propIds?.trigger ?? `${base}-trigger`,
      list: propIds?.list ?? `${base}-list`,
    };

    // biome-ignore lint/correctness/noQwikUseVisibleTask: reading the selected item's text from the rendered list requires the DOM (for defaultValue, controlled updates, and form reset)
    useVisibleTask$(
      ({ track }) => {
        const current = track(() => value.value);
        const nextText = resolveSelectedText(root.value, ids.list, current);
        if (selectedText.value !== nextText) {
          selectedText.value = nextText;
        }
      },
      { strategy: 'document-ready' },
    );

    const setOpen$ = $(async (next: boolean, highlight: SelectHighlight = null) => {
      if (next && disabled.value) return;
      if (next && highlight) {
        const list = root.value && getElementByIdInContainer(root.value, ids.list);
        const items = list ? getCollectionItems(list, ITEM_SELECTOR) : [];
        let item: HTMLElement | null = null;
        if (highlight === 'selected' || highlight === 'selected-last') {
          const selected =
            value.value !== null
              ? items.find(
                  (element) =>
                    element.getAttribute('data-value') === value.value && !isItemDisabled(element),
                )
              : undefined;
          item =
            selected ??
            getAdjacentItem(items, null, highlight === 'selected-last' ? 'last' : 'first');
        } else {
          item = getAdjacentItem(items, null, highlight);
        }
        highlighted.value = item?.getAttribute('data-value') ?? null;
      }
      if (!next) highlighted.value = null;
      if (open.value !== next) await setOpenState$(next);
    });

    const select$ = $(async (next: string, text: string) => {
      if (disabled.value) return;
      selectedText.value = text;
      if (value.value !== next) await setValue$(next);
      await setOpen$(false);
    });

    const reset$ = $(async () => {
      await resetValue$();
      selectedText.value = resolveSelectedText(root.value, ids.list, value.value);
    });

    useContextProvider(selectContextId, {
      ids,
      open,
      value,
      highlighted,
      selectedText,
      disabled,
      required,
      loop,
      setOpen$,
      select$,
      reset$,
    });

    return (
      <div
        {...props}
        ref={root}
        data-leve-select=""
        data-state={open.value ? 'open' : 'closed'}
        data-disabled={dataAttr(disabled.value)}
      >
        <Slot />
      </div>
    );
  },
);
