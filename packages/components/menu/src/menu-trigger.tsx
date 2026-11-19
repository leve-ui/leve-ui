import {
  $,
  type Component,
  component$,
  type PropsOf,
  Slot,
  sync$,
  useContext,
} from '@builder.io/qwik';
import { menuContextId } from './menu-context';

export type MenuTriggerProps = PropsOf<'button'> & {
  /**
   * The element or component to render instead of `<button>`. A component must spread the props it receives onto one element.
   * @default 'button'
   */
  // biome-ignore lint/suspicious/noExplicitAny: Component props are contravariant, so only any accepts every component (adr/0038)
  as?: keyof HTMLElementTagNameMap | Component<any>;
  [key: string]: unknown;
};

/**
 * メニューを開くボタンです。`aria-haspopup="menu"`、`aria-expanded`、`aria-controls` を出力します。
 *
 * クリック、Enter、Space、↓ で開いて最初の項目に、↑ で開いて最後の項目にフォーカスします。
 * `as` でほかの要素やコンポーネントに差し替えられます。
 */
export const MenuTrigger = component$<MenuTriggerProps>(
  ({ as: Component = 'button', type, onClick$, onKeyDown$, ...props }) => {
    const context = useContext(menuContextId);
    const Element = Component as 'button';

    const toggle$ = $(() => {
      context.initialFocus.value = 'first';
      context.point.value = null;
      return context.setOpen$(!context.open.value);
    });

    // Arrow keys would scroll the page; Enter / Space already click the button
    const preventScroll$ = sync$((event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') event.preventDefault();
    });
    const keyDown$ = $((event: KeyboardEvent) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      context.initialFocus.value = event.key === 'ArrowUp' ? 'last' : 'first';
      context.point.value = null;
      return context.setOpen$(true);
    });

    return (
      <Element
        {...props}
        type={Component === 'button' ? (type ?? 'button') : type}
        id={context.ids.trigger}
        aria-haspopup="menu"
        aria-expanded={context.open.value ? 'true' : 'false'}
        aria-controls={context.ids.content}
        onClick$={[toggle$, onClick$]}
        onKeyDown$={[preventScroll$, keyDown$, onKeyDown$]}
        data-leve-menu-trigger=""
        data-state={context.open.value ? 'open' : 'closed'}
      >
        <Slot />
      </Element>
    );
  },
);
