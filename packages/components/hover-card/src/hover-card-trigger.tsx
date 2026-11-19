import { $, type Component, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { hoverCardContextId } from './hover-card-context';

export type HoverCardTriggerProps = PropsOf<'a'> & {
  /**
   * The element or component to render instead of `<a>`. A component must spread the props it receives onto one element.
   * @default 'a'
   */
  // biome-ignore lint/suspicious/noExplicitAny: Component props are contravariant, so only any accepts every component (adr/0038)
  as?: keyof HTMLElementTagNameMap | Component<any>;
  [key: string]: unknown;
};

/**
 * ホバーカードを開くリンクです。既定では `<a>` を描画します（`href` を渡してください）。
 * `as` で Qwik City の `<Link>` などほかの要素やコンポーネントに差し替えられます。
 */
export const HoverCardTrigger = component$<HoverCardTriggerProps>(
  ({
    as: Component = 'a',
    onPointerEnter$,
    onPointerLeave$,
    onPointerDown$,
    onFocus$,
    onBlur$,
    ...props
  }) => {
    const context = useContext(hoverCardContextId);
    const Element = Component as 'a';

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
      <Element
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
      </Element>
    );
  },
);
