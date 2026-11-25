import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { getPaginationRange, Pagination } from '@leve-ui/pagination';
import { LuChevronLeft, LuChevronRight, LuMoreHorizontal } from '@qwikest/icons/lucide';
import styles from './controlled.css?inline';

export default component$(() => {
  useStyles$(styles);
  const page = useSignal(3);
  const totalPages = 8;
  const range = getPaginationRange({ page: page.value, totalPages });

  return (
    <div class="pagination-controlled-wrapper">
      <p class="pagination-controlled-status">
        Page {page.value} of {totalPages}
      </p>
      <Pagination.Root totalPages={totalPages} bind:page={page} class="pagination-controlled">
        <Pagination.List class="pagination-controlled-list">
          <li>
            <Pagination.PrevTrigger
              class="pagination-controlled-trigger"
              aria-label="Previous page"
            >
              <LuChevronLeft class="pagination-controlled-icon" aria-hidden="true" />
            </Pagination.PrevTrigger>
          </li>
          {range.map((entry) =>
            entry.type === 'ellipsis' ? (
              <li key={entry.key}>
                <Pagination.Ellipsis class="pagination-controlled-ellipsis">
                  <LuMoreHorizontal class="pagination-controlled-icon" aria-hidden="true" />
                </Pagination.Ellipsis>
              </li>
            ) : (
              <li key={entry.value}>
                <Pagination.Item value={entry.value} class="pagination-controlled-item">
                  {entry.value}
                </Pagination.Item>
              </li>
            ),
          )}
          <li>
            <Pagination.NextTrigger class="pagination-controlled-trigger" aria-label="Next page">
              <LuChevronRight class="pagination-controlled-icon" aria-hidden="true" />
            </Pagination.NextTrigger>
          </li>
        </Pagination.List>
      </Pagination.Root>
    </div>
  );
});
