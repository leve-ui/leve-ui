import { component$, type PropsOf, Slot } from '@builder.io/qwik';

export type PaginationEllipsisProps = PropsOf<'span'>;

/**
 * Decorative indicator for omitted pages in the pagination range.
 */
export const PaginationEllipsis = component$<PaginationEllipsisProps>((props) => {
  return (
    <span {...props} aria-hidden="true" data-leve-pagination-ellipsis="">
      <Slot />
    </span>
  );
});
