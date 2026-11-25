import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { getPaginationRange, Pagination } from '@leve-ui/pagination';
import { LuChevronLeft, LuChevronRight, LuMoreHorizontal } from '@qwikest/icons/lucide';
import styles from './link-mode.css?inline';

export default component$(() => {
  useStyles$(styles);
  const page = useSignal(2);
  const totalPages = 8;
  const range = getPaginationRange({ page: page.value, totalPages });

  return (
    <Pagination.Root totalPages={totalPages} bind:page={page} class="pagination-link-mode">
      <Pagination.List class="pagination-link-mode-list">
        <li>
          <Pagination.PrevTrigger
            href={`#page-${Math.max(1, page.value - 1)}`}
            class="pagination-link-mode-trigger"
            aria-label="Previous page"
          >
            <LuChevronLeft class="pagination-link-mode-icon" aria-hidden="true" />
          </Pagination.PrevTrigger>
        </li>
        {range.map((entry) =>
          entry.type === 'ellipsis' ? (
            <li key={entry.key}>
              <Pagination.Ellipsis class="pagination-link-mode-ellipsis">
                <LuMoreHorizontal class="pagination-link-mode-icon" aria-hidden="true" />
              </Pagination.Ellipsis>
            </li>
          ) : (
            <li key={entry.value}>
              <Pagination.Item
                value={entry.value}
                href={`#page-${entry.value}`}
                class="pagination-link-mode-item"
              >
                {entry.value}
              </Pagination.Item>
            </li>
          ),
        )}
        <li>
          <Pagination.NextTrigger
            href={`#page-${Math.min(totalPages, page.value + 1)}`}
            class="pagination-link-mode-trigger"
            aria-label="Next page"
          >
            <LuChevronRight class="pagination-link-mode-icon" aria-hidden="true" />
          </Pagination.NextTrigger>
        </li>
      </Pagination.List>
    </Pagination.Root>
  );
});
