import { $, type Component, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { popoverContextId } from './popover-context';

export type PopoverCloseProps = PropsOf<'button'> & {
  /**
   * The element or component to render instead of `<button>`. A component must spread the props it receives onto one element.
   * @default 'button'
   */
  // biome-ignore lint/suspicious/noExplicitAny: Component props are contravariant, so only any accepts every component (adr/0038)
  as?: keyof HTMLElementTagNameMap | Component<any>;
  [key: string]: unknown;
};

/**
 * ポップオーバーを閉じるボタンです。アイコンだけのボタンには `aria-label` を付けてください。
 * `as` でほかの要素やコンポーネントに差し替えられます。
 */
export const PopoverClose = component$<PopoverCloseProps>(
  ({ as: Component = 'button', type, onClick$, ...props }) => {
    const context = useContext(popoverContextId);
    const Element = Component as 'button';
    const close$ = $(() => context.setOpen$(false));

    return (
      <Element
        {...props}
        type={Component === 'button' ? (type ?? 'button') : type}
        onClick$={[close$, onClick$]}
        data-leve-popover-close=""
        data-state={context.open.value ? 'open' : 'closed'}
      >
        <Slot />
      </Element>
    );
  },
);
