import {
  $,
  type Component,
  component$,
  type PropsOf,
  Slot,
  sync$,
  useComputed$,
  useContext,
} from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { paginationContextId } from './pagination-context';

export type PaginationItemProps = PropsOf<'button'> & {
  /** 1-based page number represented by this item. */
  value: number;
  /** Destination URL. When provided and `as` is omitted, renders an `<a>` element instead of `<button>`. */
  href?: string;
  /**
   * Disables this page item.
   * @default false
   */
  disabled?: boolean;
  /**
   * The element or component to render instead of `<button>` or `<a>`. A component must spread the props it receives onto one element.
   */
  // biome-ignore lint/suspicious/noExplicitAny: Component props are contravariant, so only any accepts every component (adr/0038)
  as?: keyof HTMLElementTagNameMap | Component<any>;
  [key: string]: unknown;
};

const preventDisabledClick$ = sync$((event: MouseEvent, target: HTMLElement) => {
  const el = target || (event.currentTarget as HTMLElement | null);
  if (el && typeof el.getAttribute === 'function' && el.getAttribute('aria-disabled') === 'true') {
    event.preventDefault();
  }
});

/**
 * Interactive control for a specific page number. Renders `<button type="button">` by default, or `<a>` when `href` is provided.
 */
export const PaginationItem = component$<PaginationItemProps>((allProps) => {
  const { as, value, href, disabled = false, onClick$, ...restProps } = allProps;
  const ctx = useContext(paginationContextId);
  const isNativeButton = as === 'button' || (as === undefined && href === undefined);
  const resolvedElement = as ?? (href !== undefined ? 'a' : 'button');
  const isHostElement = typeof resolvedElement === 'string';
  const Element = resolvedElement as Component<Record<string, unknown>>;

  const isCurrent = useComputed$(() => ctx.page.value === value);
  const isDisabled = useComputed$(() => ctx.disabled.value || Boolean(disabled));
  const disabledAttr = useComputed$(() => dataAttr(isDisabled.value));
  const buttonDisabled = useComputed$(() => (isNativeButton ? isDisabled.value : undefined));
  const ariaDisabled = useComputed$(() =>
    isNativeButton ? undefined : isDisabled.value ? 'true' : allProps['aria-disabled'],
  );
  const hrefAttr = useComputed$(() => (isNativeButton || isDisabled.value ? undefined : href));
  const tabIndexAttr = useComputed$(() =>
    isNativeButton ? allProps.tabIndex : isDisabled.value ? -1 : allProps.tabIndex,
  );
  const ariaCurrentAttr = useComputed$(() => (isCurrent.value ? 'page' : undefined));
  const dataStateAttr = useComputed$(() => (isCurrent.value ? 'selected' : 'unselected'));
  const dataSelectedAttr = useComputed$(() => dataAttr(isCurrent.value));

  const handleClick$ = $(async () => {
    if (isDisabled.value) return;
    await ctx.setPage$(value);
  });

  return (
    <Element
      {...restProps}
      type={isNativeButton ? 'button' : undefined}
      href={hrefAttr.value}
      disabled={buttonDisabled.value}
      aria-disabled={ariaDisabled.value}
      tabIndex={tabIndexAttr.value}
      aria-current={ariaCurrentAttr.value}
      data-leve-pagination-item=""
      data-state={dataStateAttr.value}
      data-selected={dataSelectedAttr.value}
      data-disabled={disabledAttr.value}
      onClick$={[isHostElement ? preventDisabledClick$ : undefined, handleClick$, onClick$]}
    >
      <Slot />
    </Element>
  );
});
