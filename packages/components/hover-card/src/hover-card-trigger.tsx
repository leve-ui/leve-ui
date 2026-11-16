import { $, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { hoverCardContextId } from './hover-card-context';

export type HoverCardTriggerProps = PropsOf<'a'>;

/**
 * ホバーカードを開くリンクです。`<a>` を描画します（`href` を渡してください）。
 * ほかの要素や Qwik City の `<Link>` にする方法（asChild）は #153 で検討しています。
 */
export const HoverCardTrigger = component$<HoverCardTriggerProps>(
  ({ onPointerEnter$, onPointerLeave$, onPointerDown$, onFocus$, onBlur$, ...props }) => {
    const context = useContext(hoverCardContextId);

    const enter$ = $((event: PointerEvent) => {
      // Touch has no hover; a tap would show it and leave it open
      if (event.pointerType === 'touch') return;
      context.pointerOnTrigger.value = true;
      context.show$(false);
    });
    const leave$ = $(() => {
      context.pointerOnTrigger.value = false;
      context.hide$(false);
    });
    const press$ = $(() => context.hide$(true));
    const focus$ = $(() => {
      context.focused.value = true;
      context.show$(false);
    });
    const blur$ = $(() => {
      context.focused.value = false;
      context.hide$(true);
    });

    return (
      <a
        {...props}
        id={context.ids.trigger}
        onPointerEnter$={[enter$, onPointerEnter$]}
        onPointerLeave$={[leave$, onPointerLeave$]}
        onPointerDown$={[press$, onPointerDown$]}
        onFocus$={[focus$, onFocus$]}
        onBlur$={[blur$, onBlur$]}
        data-leve-hover-card-trigger=""
        data-state={context.open.value ? 'open' : 'closed'}
      >
        <Slot />
      </a>
    );
  },
);
