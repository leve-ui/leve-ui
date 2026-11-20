import { $, type Component, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { popoverContextId } from './popover-context';

export type PopoverTriggerProps = PropsOf<'button'> & {
  /**
   * The element or component to render instead of `<button>`. A component must spread the props it receives onto one element.
   * @default 'button'
   */
  // biome-ignore lint/suspicious/noExplicitAny: Component props are contravariant, so only any accepts every component (adr/0038)
  as?: keyof HTMLElementTagNameMap | Component<any>;
  [key: string]: unknown;
};

/**
 * ポップオーバーを開閉するボタンです。
 * `aria-haspopup="dialog"`、`aria-expanded`、`aria-controls`（Content の ID）を出力します。
 * `as` でほかの要素やコンポーネントに差し替えられます。
 */
export const PopoverTrigger = component$<PopoverTriggerProps>(
  ({ as: Component = 'button', type, onClick$, ...props }) => {
    const context = useContext(popoverContextId);
    const Element = Component as 'button';
    const toggle$ = $(() => context.setOpen$(!context.open.value));

    return (
      <Element
        {...props}
        type={Component === 'button' ? (type ?? 'button') : type}
        id={context.ids.trigger}
        aria-haspopup="dialog"
        aria-expanded={context.open.value ? 'true' : 'false'}
        aria-controls={context.ids.content}
        onClick$={[toggle$, onClick$]}
        data-leve-popover-trigger=""
        data-state={context.open.value ? 'open' : 'closed'}
      >
        <Slot />
      </Element>
    );
  },
);
