import { type Component, component$, type PropsOf, Slot } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';

export type BreadcrumbLinkProps = PropsOf<'a'> & {
  /**
   * The element or component to render instead of `<a>`. A component must spread the props it receives onto one element.
   * @default 'a'
   */
  // biome-ignore lint/suspicious/noExplicitAny: Component props are contravariant, so only any accepts every component (adr/0038)
  as?: keyof HTMLElementTagNameMap | Component<any>;
  /**
   * Marks the link as the current page (outputs `aria-current="page"`).
   * @default false
   */
  current?: boolean;
  [key: string]: unknown;
};

/** パンくずのリンクです */
export const BreadcrumbLink = component$<BreadcrumbLinkProps>(
  ({ as: Component = 'a', current = false, ...props }) => {
    const Element = Component as 'a';

    return (
      <Element
        {...props}
        aria-current={current ? 'page' : props['aria-current']}
        data-leve-breadcrumb-link=""
        data-current={dataAttr(current)}
      >
        <Slot />
      </Element>
    );
  },
);
