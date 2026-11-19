import { $, type Component, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { tooltipContextId } from './tooltip-context';

export type TooltipTriggerProps = PropsOf<'button'> & {
  /**
   * The element or component to render instead of `<button>`. A component must spread the props it receives onto one element.
   * @default 'button'
   */
  // biome-ignore lint/suspicious/noExplicitAny: Component props are contravariant, so only any accepts every component (adr/0038)
  as?: keyof HTMLElementTagNameMap | Component<any>;
  [key: string]: unknown;
};

/**
 * ツールチップで説明される要素です。既定では `<button type="button">` を描画し、
 * `aria-describedby` で Content を指します。`as` でリンクなどほかの要素やコンポーネントに差し替えられます。
 */
export const TooltipTrigger = component$<TooltipTriggerProps>(
  ({
    as: Component = 'button',
    type,
    onPointerEnter$,
    onPointerLeave$,
    onPointerDown$,
    onFocus$,
    onBlur$,
    ...props
  }) => {
    const context = useContext(tooltipContextId);
    const Element = Component as 'button';

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
    const focus$ = $(() => context.show$(true));
    const blur$ = $(() => context.hide$(true));

    return (
      <Element
        type={Component === 'button' ? (type ?? 'button') : type}
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
      </Element>
    );
  },
);
