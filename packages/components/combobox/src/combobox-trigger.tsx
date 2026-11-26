import { $, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { comboboxContextId, getComboboxInput } from './combobox-context';

export type ComboboxTriggerProps = PropsOf<'button'>;

/**
 * 候補の一覧を開閉するボタンです。Tab では止まらず（`tabindex="-1"`）、押しても Input の
 * フォーカスを保ちます。アイコンだけのときは `aria-label` を付けてください。
 */
export const ComboboxTrigger = component$<ComboboxTriggerProps>(({ onClick$, ...props }) => {
  const context = useContext(comboboxContextId);

  const toggle$ = $(async (_event: Event, element: HTMLElement) => {
    getComboboxInput(element, context.ids.input)?.focus();
    await context.setOpen$(!context.open.value, 'selected');
  });

  return (
    <button
      {...props}
      type="button"
      id={context.ids.trigger}
      tabIndex={-1}
      disabled={context.disabled.value}
      aria-expanded={context.open.value ? 'true' : 'false'}
      aria-controls={context.ids.list}
      // Keeps focus in the input
      preventdefault:mousedown
      onClick$={[toggle$, onClick$]}
      data-leve-combobox-trigger=""
      data-state={context.open.value ? 'open' : 'closed'}
      data-disabled={dataAttr(context.disabled.value)}
    >
      <Slot />
    </button>
  );
});
