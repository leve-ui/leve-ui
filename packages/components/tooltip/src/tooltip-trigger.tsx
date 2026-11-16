import { $, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { tooltipContextId } from './tooltip-context';

export type TooltipTriggerProps = PropsOf<'button'>;

/**
 * ツールチップで説明される要素です。`<button type="button">` を描画し、`aria-describedby` で
 * Content を指します。今はボタンだけを描画します。リンクなどほかの要素に付ける方法（asChild）は
 * #153 で検討しています。
 */
export const TooltipTrigger = component$<TooltipTriggerProps>(
  ({ onPointerEnter$, onPointerLeave$, onPointerDown$, onFocus$, onBlur$, ...props }) => {
    const context = useContext(tooltipContextId);

    const enter$ = $((event: PointerEvent) => {
      // Touch has no hover; a tap would show it and leave it open
      if (event.pointerType === 'touch') return;
      context.pointerInside.value = true;
      context.show$(false);
    });
    const leave$ = $(() => {
      context.pointerInside.value = false;
      context.hide$(false);
    });
    const press$ = $(() => context.hide$(true));
    const focus$ = $(() => context.show$(true));
    const blur$ = $(() => context.hide$(true));

    return (
      <button
        type="button"
        {...props}
        id={context.ids.trigger}
        aria-describedby={context.ids.content}
        onPointerEnter$={[enter$, onPointerEnter$]}
        onPointerLeave$={[leave$, onPointerLeave$]}
        onPointerDown$={[press$, onPointerDown$]}
        onFocus$={[focus$, onFocus$]}
        onBlur$={[blur$, onBlur$]}
        data-leve-tooltip-trigger=""
        data-state={context.open.value ? 'open' : 'closed'}
      >
        <Slot />
      </button>
    );
  },
);
