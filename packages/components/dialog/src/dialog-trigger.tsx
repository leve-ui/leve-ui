import { $, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dialogContextId } from './dialog-context';

export type DialogTriggerProps = PropsOf<'button'>;

/**
 * ダイアログを開くボタンです。
 *
 * `aria-haspopup="dialog"`、`aria-expanded`、`aria-controls`（Content の ID）を出力します。
 * ダイアログを閉じると、フォーカスはこのボタン（開いたときにフォーカスがあった要素）に戻ります。
 */
export const DialogTrigger = component$<DialogTriggerProps>(({ onClick$, ...props }) => {
  const context = useContext(dialogContextId);
  const open$ = $(() => context.setOpen$(true));

  return (
    <button
      {...props}
      type="button"
      id={context.ids.trigger}
      aria-haspopup="dialog"
      aria-expanded={context.open.value ? 'true' : 'false'}
      aria-controls={context.ids.content}
      onClick$={[open$, onClick$]}
      data-leve-dialog-trigger=""
      data-state={context.open.value ? 'open' : 'closed'}
    >
      <Slot />
    </button>
  );
});
