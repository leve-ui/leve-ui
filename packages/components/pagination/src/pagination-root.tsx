import {
  $,
  component$,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useComputed$,
  useContextProvider,
} from '@builder.io/qwik';
import { clamp, dataAttr, useControllableState } from '@leve-ui/utils';
import { paginationContextId } from './pagination-context';

export type PaginationRootProps = PropsOf<'nav'> & {
  /** Total number of items. Used with `pageSize` when `totalPages` is not specified. */
  count?: number;
  /**
   * Number of items per page.
   * @default 10
   */
  pageSize?: number;
  /** Total number of pages. Takes precedence over `Math.ceil(count / pageSize)`. */
  totalPages?: number;
  /**
   * Initial 1-based page number when uncontrolled.
   * @default 1
   */
  defaultPage?: number;
  /** A signal with the current 1-based page number (controlled). */
  'bind:page'?: Signal<number>;
  /** Called when the current page changes. */
  onPageChange$?: QRL<(page: number) => void>;
  /**
   * Disables all interactive pagination controls.
   * @default false
   */
  disabled?: boolean;
};

function computeTotalPages(count: number | undefined, pageSize: number, totalPages?: number) {
  if (totalPages !== undefined) {
    return Math.max(1, Math.floor(totalPages) || 1);
  }
  if (count !== undefined) {
    return Math.max(1, Math.ceil(count / Math.max(1, pageSize)) || 1);
  }
  return 1;
}

/**
 * Navigation landmark that provides pagination state and controls to child parts.
 */
export const PaginationRoot = component$<PaginationRootProps>(
  ({
    count,
    pageSize = 10,
    totalPages,
    defaultPage = 1,
    'bind:page': bindPage,
    onPageChange$,
    disabled = false,
    ...props
  }) => {
    const totalPagesSignal = useComputed$(() => computeTotalPages(count, pageSize, totalPages));
    const disabledSignal = useComputed$(() => Boolean(disabled));

    const initialTotal = computeTotalPages(count, pageSize, totalPages);
    const [rawPage, setRawPage$] = useControllableState({
      value: bindPage,
      defaultValue: clamp(Math.floor(defaultPage) || 1, 1, initialTotal),
      onChange$: onPageChange$,
    });

    const page = useComputed$(() =>
      clamp(Math.floor(rawPage.value) || 1, 1, totalPagesSignal.value),
    );

    const setPage$ = $(async (nextPage: number) => {
      if (disabledSignal.value) return;
      const clamped = clamp(Math.floor(nextPage) || 1, 1, totalPagesSignal.value);
      await setRawPage$(clamped);
    });

    useContextProvider(paginationContextId, {
      page,
      totalPages: totalPagesSignal,
      disabled: disabledSignal,
      setPage$,
    });

    return (
      <nav
        {...props}
        aria-label={
          props['aria-labelledby'] ? props['aria-label'] : (props['aria-label'] ?? 'Pagination')
        }
        data-leve-pagination=""
        data-disabled={dataAttr(disabledSignal.value)}
      >
        <Slot />
      </nav>
    );
  },
);
