import { $, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { popoverContextId } from './popover-context';

export type PopoverCloseProps = PropsOf<'button'>;

/**
 * ポップオーバーを閉じるボタンです。アイコンだけのボタンには `aria-label` を付けてください。
 */
export const PopoverClose = component$<PopoverCloseProps>(({ onClick$, ...props }) => {
  const context = useContext(popoverContextId);
  const close$ = $(() => context.setOpen$(false));

  return (
    <button
      {...props}
      type="button"
      onClick$={[close$, onClick$]}
      data-leve-popover-close=""
      data-state={context.open.value ? 'open' : 'closed'}
    >
      <Slot />
    </button>
  );
});
