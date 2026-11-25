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

export type PaginationNextTriggerProps = PropsOf<'button'> & {
  /** Destination URL. When provided and `as` is omitted, renders an `<a>` element instead of `<button>`. */
  href?: string;
  /**
   * Disables the next page trigger. Automatically disabled when on the last page.
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
 * Navigates to the next page. Automatically disabled on the last page.
 */
export const PaginationNextTrigger = component$<PaginationNextTriggerProps>((allProps) => {
  const { as, href, disabled = false, onClick$, ...restProps } = allProps;
  const ctx = useContext(paginationContextId);
  const isNativeButton = as === 'button' || (as === undefined && href === undefined);
  const Element = (as ?? (href !== undefined ? 'a' : 'button')) as Component<
    Record<string, unknown>
  >;

  const isDisabled = useComputed$(
    () => ctx.page.value >= ctx.totalPages.value || ctx.disabled.value || Boolean(disabled),
  );
  const disabledAttr = useComputed$(() => dataAttr(isDisabled.value));
  const buttonDisabled = useComputed$(() => (isNativeButton ? isDisabled.value : undefined));
  const ariaDisabled = useComputed$(() =>
    isNativeButton ? undefined : isDisabled.value ? 'true' : allProps['aria-disabled'],
  );
  const hrefAttr = useComputed$(() => (isNativeButton || isDisabled.value ? undefined : href));
  const tabIndexAttr = useComputed$(() =>
    isNativeButton ? allProps.tabIndex : isDisabled.value ? -1 : allProps.tabIndex,
  );

  const handleClick$ = $(async () => {
    if (isDisabled.value) return;
    await ctx.setPage$(Math.min(ctx.totalPages.value, ctx.page.value + 1));
  });

  return (
    <Element
      {...restProps}
      type={isNativeButton ? 'button' : undefined}
      href={hrefAttr.value}
      disabled={buttonDisabled.value}
      aria-disabled={ariaDisabled.value}
      tabIndex={tabIndexAttr.value}
      data-leve-pagination-next-trigger=""
      data-disabled={disabledAttr.value}
      onClick$={[preventDisabledClick$, handleClick$, onClick$]}
    >
      <Slot />
    </Element>
  );
});
