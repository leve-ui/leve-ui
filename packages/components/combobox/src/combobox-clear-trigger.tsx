import { $, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { comboboxContextId } from './combobox-context';

export type ComboboxClearTriggerProps = PropsOf<'button'>;

/**
 * 入力と選択を消すボタンです。押すと Input にフォーカスを戻します。消すものがない間は `hidden` に
 * なります。Trigger と同じく Tab では止まりません（キーボードでは、閉じているときの Escape で消せます）。
 * アイコンだけのときは `aria-label` を付けてください。
 */
export const ComboboxClearTrigger = component$<ComboboxClearTriggerProps>(
  ({ onClick$, ...props }) => {
    const context = useContext(comboboxContextId);

    const clear$ = $(async (_event: Event, element: HTMLElement) => {
      await context.clear$();
      context.highlighted.value = null;
      element.ownerDocument.getElementById(context.ids.input)?.focus();
    });

    const empty = context.value.value === null && context.inputValue.value === '';

    return (
      <button
        {...props}
        type="button"
        tabIndex={-1}
        hidden={empty}
        disabled={context.disabled.value}
        aria-controls={context.ids.input}
        // Keeps focus in the input
        preventdefault:mousedown
        onClick$={[clear$, onClick$]}
        data-leve-combobox-clear-trigger=""
        data-state={empty ? 'empty' : 'filled'}
        data-disabled={dataAttr(context.disabled.value)}
      >
        <Slot />
      </button>
    );
  },
);
