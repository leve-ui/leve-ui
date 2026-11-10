import { component$, type PropsOf, Slot } from '@builder.io/qwik';

export type BreadcrumbSeparatorProps = PropsOf<'li'>;

/**
 * 項目間の区切り（`/` やアイコンなど）です。Item と Item の間に置きます。
 * 装飾のため、`role="presentation"` と `aria-hidden="true"` で支援技術から隠します
 * （リストの項目数にも数えられません）。
 */
export const BreadcrumbSeparator = component$<BreadcrumbSeparatorProps>((props) => {
  return (
    <li {...props} role="presentation" aria-hidden="true" data-leve-breadcrumb-separator="">
      <Slot />
    </li>
  );
});
