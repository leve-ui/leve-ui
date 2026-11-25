import { component$, type PropsOf, Slot } from '@builder.io/qwik';

export type PaginationListProps = PropsOf<'ul'>;

/**
 * Unordered list container for pagination items, triggers, and ellipses.
 */
export const PaginationList = component$<PaginationListProps>((props) => {
  return (
    <ul {...props} data-leve-pagination-list="">
      <Slot />
    </ul>
  );
});
