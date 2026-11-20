import { type Component, component$, type PropsOf, Slot, useComputed$ } from '@builder.io/qwik';
import { useToolbarItem } from '@leve-ui/utils';

export type ToolbarLinkProps = PropsOf<'a'> & {
  /**
   * The element or component to render instead of `<a>`. A component must spread the props it receives onto one element.
   * @default 'a'
   */
  // biome-ignore lint/suspicious/noExplicitAny: Component props are contravariant, so only any accepts every component (adr/0038)
  as?: keyof HTMLElementTagNameMap | Component<any>;
  [key: string]: unknown;
};

/**
 * ツールバーのリンクです。既定ではネイティブの `<a>` を使います。
 * `as` で Qwik City の `<Link>` などのコンポーネントに差し替えられます。
 */
export const ToolbarLink = component$<ToolbarLinkProps>(
  ({ as: Component = 'a', onFocus$, ...props }) => {
    const disabled = useComputed$(() => false);
    const item = useToolbarItem(disabled);
    const tabIndex = useComputed$(() => item.tabIndex.value);
    const Element = Component as 'a';

    return (
      <Element
        {...props}
        tabIndex={tabIndex.value}
        onFocus$={[item.onFocus$, onFocus$]}
        data-leve-toolbar-link=""
        data-leve-toolbar-item={item.itemId}
      >
        <Slot />
      </Element>
    );
  },
);
