import { createContextId, type QRL, type ReadonlySignal } from '@builder.io/qwik';

export interface PaginationContext {
  page: ReadonlySignal<number>;
  totalPages: ReadonlySignal<number>;
  disabled: ReadonlySignal<boolean>;
  setPage$: QRL<(page: number) => Promise<void>>;
}

export const paginationContextId = createContextId<PaginationContext>('leve-ui.pagination');
