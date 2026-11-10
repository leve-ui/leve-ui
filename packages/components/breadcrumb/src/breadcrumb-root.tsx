import { component$, type PropsOf, Slot } from '@builder.io/qwik';

export type BreadcrumbRootProps = PropsOf<'nav'>;

/**
 * 現在のページの、階層の中での位置を示します。
 *
 * APG の Breadcrumb パターン（https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/）に従い、
 * `<nav>` のランドマークにします。アクセシブルネームは既定で `aria-label="Breadcrumb"` です
 * （`aria-label` / `aria-labelledby` で変更できます）。
 */
export const BreadcrumbRoot = component$<BreadcrumbRootProps>((props) => {
  return (
    <nav
      {...props}
      aria-label={
        props['aria-labelledby'] ? props['aria-label'] : (props['aria-label'] ?? 'Breadcrumb')
      }
      data-leve-breadcrumb=""
    >
      <Slot />
    </nav>
  );
});
