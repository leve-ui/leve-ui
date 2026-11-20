import { type Component, component$, type PropsOf, Slot, useComputed$ } from '@builder.io/qwik';
import { dataAttr, useToolbarItem } from '@leve-ui/utils';

export type ToolbarButtonProps = PropsOf<'button'> & {
  /**
   * The element or component to render instead of `<button>`. A component must spread the props it receives onto one element.
   * @default 'button'
   */
  // biome-ignore lint/suspicious/noExplicitAny: Component props are contravariant, so only any accepts every component (adr/0038)
  as?: keyof HTMLElementTagNameMap | Component<any>;
  [key: string]: unknown;
};

/**
 * ツールバーのボタンです。既定ではネイティブの `<button type="button">` を使います。
 * `as` でほかの要素やコンポーネントに差し替えられます。
 */
export const ToolbarButton = component$<ToolbarButtonProps>(
  ({ as: Component = 'button', type, onFocus$, ...props }) => {
    const disabled = useComputed$(() => Boolean(props.disabled));
    const disabledAttr = useComputed$(() => dataAttr(disabled.value));
    const item = useToolbarItem(disabled);
    const tabIndex = useComputed$(() => item.tabIndex.value);
    const Element = Component as 'button';

    return (
      <Element
        type={Component === 'button' ? (type ?? 'button') : type}
        {...props}
        tabIndex={tabIndex.value}
        onFocus$={[item.onFocus$, onFocus$]}
        data-leve-toolbar-button=""
        data-leve-toolbar-item={item.itemId}
        data-disabled={disabledAttr.value}
      >
        <Slot />
      </Element>
    );
  },
);
