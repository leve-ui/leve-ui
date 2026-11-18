import {
  $,
  component$,
  type PropsOf,
  sync$,
  useContext,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import {
  dataAttr,
  getAdjacentItem,
  getCollectionItems,
  getElementByIdInContainer,
  itemId,
  useFieldControl,
} from '@leve-ui/utils';
import { comboboxContextId, getItemText, ITEM_SELECTOR } from './combobox-context';

export type ComboboxInputProps = Omit<PropsOf<'input'>, 'value' | 'type'> & {
  /** Whether the value is invalid. Inside a Field, the Field's `invalid` also applies. */
  invalid?: boolean;
};

/**
 * 入力欄（`role="combobox"`）です。フォーカスは常にここにあり、強調中の項目を
 * `aria-activedescendant` で示します。
 *
 * - 入力すると一覧を開きます（絞り込みは利用者が `bind:inputValue` で行います）。
 * - ↓ / ↑ で開いて最初 / 最後の項目を強調し、開いているときは強調を移します。Alt+↓ は強調せずに開き、
 *   Alt+↑ は閉じます。Enter で強調中の項目を選び、その文字列を入力欄に入れて閉じます。
 * - Escape は開いていれば閉じ、閉じていれば入力と選択を消します。
 * - `openOnClick` のときは、クリックでも開きます。
 * - フォーカスが外れると一覧を閉じ、入力欄を選択中の項目の文字列に戻します（空なら選択を消します）。
 */
export const ComboboxInput = component$<ComboboxInputProps>(
  ({ invalid, onInput$, onKeyDown$, onFocusOut$, onClick$, ...props }) => {
    const context = useContext(comboboxContextId);
    const control = useFieldControl({
      invalid,
      disabled: context.disabled.value,
      required: context.required.value,
      'aria-describedby': props['aria-describedby'],
    });

    const ref = useSignal<HTMLInputElement>();
    // The text is not rendered as the value: Qwik writes the value property on every render, which
    // would overwrite what the user is typing. It is written here instead, on load, when it is set
    // by selecting or clearing, and when the consumer changes it while the input is not focused.
    // biome-ignore lint/correctness/noQwikUseVisibleTask: writing the value property needs the element
    useVisibleTask$(
      ({ track }) => {
        const text = track(() => context.inputValue.value);
        const written = track(() => context.writtenText.value);
        const element = ref.value;
        if (!element || element.value === text) return;
        const focused = element.ownerDocument.activeElement === element;
        if (!focused || written?.text === text) element.value = text;
      },
      { strategy: 'document-ready' },
    );

    const input$ = $(async (_event: Event, element: HTMLInputElement) => {
      await context.setInputValue$(element.value, 'input');
      if (!context.open.value) await context.setOpen$(true);
    });

    // The caret would move to the start / end, Enter would submit the form, and Escape would
    // clear a search input on its own
    const preventDefault$ = sync$((event: KeyboardEvent, element: HTMLInputElement) => {
      const open = element.getAttribute('aria-expanded') === 'true';
      const key = event.key;
      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Escape') event.preventDefault();
      if (key === 'Enter' && open && element.hasAttribute('aria-activedescendant')) {
        event.preventDefault();
      }
    });

    const keyDown$ = $(async (event: KeyboardEvent, element: HTMLInputElement) => {
      if (event.isComposing) return;
      const list = getElementByIdInContainer(element, context.ids.list);
      const items = list ? getCollectionItems(list, ITEM_SELECTOR) : [];
      const current =
        items.find((item) => item.getAttribute('data-value') === context.highlighted.value) ?? null;
      const open = context.open.value;
      const highlight = (item: HTMLElement | null) => {
        context.highlighted.value = item?.getAttribute('data-value') ?? null;
      };

      switch (event.key) {
        case 'ArrowDown':
          if (event.altKey) return context.setOpen$(true);
          if (!open) return context.setOpen$(true, 'first');
          return highlight(
            getAdjacentItem(items, current, 'next', { loop: context.loop.value }) ?? current,
          );
        case 'ArrowUp':
          if (event.altKey) return context.setOpen$(false);
          if (!open) return context.setOpen$(true, 'last');
          return highlight(
            getAdjacentItem(items, current, 'previous', { loop: context.loop.value }) ?? current,
          );
        case 'Enter':
          if (open && current) {
            return context.select$(current.getAttribute('data-value') ?? '', getItemText(current));
          }
          return;
        case 'Escape':
          if (open) return context.setOpen$(false);
          return context.clear$();
      }
    });

    const click$ = $(() => {
      if (context.openOnClick.value && !context.open.value)
        return context.setOpen$(true, 'selected');
    });

    const focusOut$ = $(async (event: FocusEvent, element: HTMLInputElement) => {
      const related = event.relatedTarget as Node | null;
      const content = getElementByIdInContainer(element, context.ids.list)?.closest('[popover]');
      if (related && content?.contains(related)) return;
      await context.setOpen$(false);
      // Typing does not select: the input goes back to the selected item, or clears the value
      if (context.inputValue.value === '') return context.clear$();
      await context.setInputValue$(context.selectedText.value, 'blur');
    });

    const highlighted = context.highlighted.value;

    return (
      <input
        {...props}
        ref={ref}
        type="text"
        id={context.ids.input}
        role="combobox"
        autoComplete="off"
        disabled={control.value.disabled}
        required={control.value.required}
        aria-autocomplete="list"
        aria-expanded={context.open.value ? 'true' : 'false'}
        aria-controls={context.ids.list}
        aria-activedescendant={
          context.open.value && highlighted !== null
            ? itemId(context.ids.list, highlighted)
            : undefined
        }
        aria-describedby={control.value.describedBy}
        aria-invalid={control.value.invalid ? 'true' : undefined}
        onInput$={[input$, onInput$]}
        onKeyDown$={[preventDefault$, keyDown$, onKeyDown$]}
        onFocusOut$={[focusOut$, onFocusOut$]}
        onClick$={[click$, onClick$]}
        data-leve-combobox-input=""
        data-state={context.open.value ? 'open' : 'closed'}
        data-disabled={dataAttr(control.value.disabled)}
        data-invalid={dataAttr(control.value.invalid)}
      />
    );
  },
);
