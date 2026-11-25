import { component$, useStyles$ } from '@builder.io/qwik';
import { getPaginationRange, Pagination } from '@leve-ui/pagination';
import { LuChevronLeft, LuChevronRight, LuMoreHorizontal } from '@qwikest/icons/lucide';
import styles from './disabled.css?inline';

export default component$(() => {
  useStyles$(styles);
  const range = getPaginationRange({ page: 2, totalPages: 8 });

  return (
    <Pagination.Root totalPages={8} defaultPage={2} disabled class="pagination-disabled">
      <Pagination.List class="pagination-disabled-list">
        <li>
          <Pagination.PrevTrigger class="pagination-disabled-trigger" aria-label="Previous page">
            <LuChevronLeft class="pagination-disabled-icon" aria-hidden="true" />
          </Pagination.PrevTrigger>
        </li>
        {range.map((entry) =>
          entry.type === 'ellipsis' ? (
            <li key={entry.key}>
              <Pagination.Ellipsis class="pagination-disabled-ellipsis">
                <LuMoreHorizontal class="pagination-disabled-icon" aria-hidden="true" />
              </Pagination.Ellipsis>
            </li>
          ) : (
            <li key={entry.value}>
              <Pagination.Item value={entry.value} class="pagination-disabled-item">
                {entry.value}
              </Pagination.Item>
            </li>
          ),
        )}
        <li>
          <Pagination.NextTrigger class="pagination-disabled-trigger" aria-label="Next page">
            <LuChevronRight class="pagination-disabled-icon" aria-hidden="true" />
          </Pagination.NextTrigger>
        </li>
      </Pagination.List>
    </Pagination.Root>
  );
});
