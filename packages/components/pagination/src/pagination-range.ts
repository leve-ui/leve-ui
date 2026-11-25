import { clamp } from '@leve-ui/utils';

export interface GetPaginationRangeOptions {
  /** Current 1-based page number. */
  page: number;
  /** Total number of pages (clamped to at least 1). */
  totalPages: number;
  /**
   * Number of sibling pages shown on each side of the current page.
   * @default 1
   */
  siblingCount?: number;
  /**
   * Number of boundary pages shown at the start and end.
   * @default 1
   */
  boundaryCount?: number;
}

export type PaginationRangeItem =
  | { type: 'page'; value: number }
  | { type: 'ellipsis'; key: string };

function createRange(start: number, end: number): number[] {
  if (start > end) return [];
  const length = end - start + 1;
  return Array.from({ length }, (_, index) => start + index);
}

/**
 * Computes the sequence of page numbers and ellipsis items to render for a given pagination state.
 */
export function getPaginationRange({
  page,
  totalPages,
  siblingCount = 1,
  boundaryCount = 1,
}: GetPaginationRangeOptions): PaginationRangeItem[] {
  const safeTotalPages = Math.max(1, Math.floor(totalPages) || 1);
  const safePage = clamp(Math.floor(page) || 1, 1, safeTotalPages);
  const safeSiblingCount = Math.max(0, Math.floor(siblingCount));
  const safeBoundaryCount = Math.max(0, Math.floor(boundaryCount));

  if (safeBoundaryCount === 0) {
    const windowSize = safeSiblingCount * 2;
    const siblingsStart = clamp(
      safePage - safeSiblingCount,
      1,
      Math.max(1, safeTotalPages - windowSize),
    );
    const siblingsEnd = Math.min(safeTotalPages, siblingsStart + windowSize);
    const items: PaginationRangeItem[] = [];

    if (siblingsStart > 1) {
      items.push({ type: 'ellipsis', key: 'start-ellipsis' });
    }
    for (const value of createRange(siblingsStart, siblingsEnd)) {
      items.push({ type: 'page', value });
    }
    if (siblingsEnd < safeTotalPages) {
      items.push({ type: 'ellipsis', key: 'end-ellipsis' });
    }
    return items;
  }

  if (safeTotalPages <= safeBoundaryCount * 2 + safeSiblingCount * 2 + 3) {
    return createRange(1, safeTotalPages).map((value) => ({ type: 'page', value }));
  }

  const startPages = createRange(1, safeBoundaryCount);
  const endPages = createRange(safeTotalPages - safeBoundaryCount + 1, safeTotalPages);

  const siblingsStart = Math.max(
    Math.min(
      safePage - safeSiblingCount,
      safeTotalPages - safeBoundaryCount - safeSiblingCount * 2 - 1,
    ),
    safeBoundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(safePage + safeSiblingCount, safeBoundaryCount + safeSiblingCount * 2 + 2),
    endPages[0] - 2,
  );

  const items: PaginationRangeItem[] = startPages.map((value) => ({ type: 'page', value }));

  if (siblingsStart > safeBoundaryCount + 2) {
    items.push({ type: 'ellipsis', key: 'start-ellipsis' });
  } else if (safeBoundaryCount + 1 < safeTotalPages - safeBoundaryCount) {
    items.push({ type: 'page', value: safeBoundaryCount + 1 });
  }

  for (const value of createRange(siblingsStart, siblingsEnd)) {
    items.push({ type: 'page', value });
  }

  if (siblingsEnd < safeTotalPages - safeBoundaryCount - 1) {
    items.push({ type: 'ellipsis', key: 'end-ellipsis' });
  } else if (safeTotalPages - safeBoundaryCount > safeBoundaryCount) {
    items.push({ type: 'page', value: safeTotalPages - safeBoundaryCount });
  }

  for (const value of endPages) {
    items.push({ type: 'page', value });
  }

  return items;
}
