import { $, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { popoverContextId } from './popover-context';

export type PopoverTriggerProps = PropsOf<'button'>;

/**
 * ポップオーバーを開閉するボタンです。
 * `aria-haspopup="dialog"`、`aria-expanded`、`aria-controls`（Content の ID）を出力します。
 */
export const PopoverTrigger = component$<PopoverTriggerProps>(({ onClick$, ...props }) => {
  const context = useContext(popoverContextId);
  const toggle$ = $(() => context.setOpen$(!context.open.value));

  return (
    <button
      {...props}
      type="button"
      id={context.ids.trigger}
      aria-haspopup="dialog"
      aria-expanded={context.open.value ? 'true' : 'false'}
      aria-controls={context.ids.content}
      onClick$={[toggle$, onClick$]}
      data-leve-popover-trigger=""
      data-state={context.open.value ? 'open' : 'closed'}
    >
      <Slot />
    </button>
  );
});
