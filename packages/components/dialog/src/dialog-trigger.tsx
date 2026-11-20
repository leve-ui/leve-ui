import { $, type Component, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dialogContextId } from './dialog-context';

export type DialogTriggerProps = PropsOf<'button'> & {
  /**
   * The element or component to render instead of `<button>`. A component must spread the props it receives onto one element.
   * @default 'button'
   */
  // biome-ignore lint/suspicious/noExplicitAny: Component props are contravariant, so only any accepts every component (adr/0038)
  as?: keyof HTMLElementTagNameMap | Component<any>;
  [key: string]: unknown;
};

/**
 * ダイアログを開くボタンです。
 *
 * `aria-haspopup="dialog"`、`aria-expanded`、`aria-controls`（Content の ID）を出力します。
 * ダイアログを閉じると、フォーカスはこのボタン（開いたときにフォーカスがあった要素）に戻ります。
 * `as` でほかの要素やコンポーネントに差し替えられます。
 */
export const DialogTrigger = component$<DialogTriggerProps>(
  ({ as: Component = 'button', type, onClick$, ...props }) => {
    const context = useContext(dialogContextId);
    const Element = Component as 'button';
    const open$ = $(() => context.setOpen$(true));

    return (
      <Element
        {...props}
        type={Component === 'button' ? (type ?? 'button') : type}
        id={context.ids.trigger}
        aria-haspopup="dialog"
        aria-expanded={context.open.value ? 'true' : 'false'}
        aria-controls={context.ids.content}
        onClick$={[open$, onClick$]}
        data-leve-dialog-trigger=""
        data-state={context.open.value ? 'open' : 'closed'}
      >
        <Slot />
      </Element>
    );
  },
);
