import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { getPaginationRange, Pagination } from '@leve-ui/pagination';
import { LuChevronLeft, LuChevronRight, LuMoreHorizontal } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);
  const page = useSignal(1);
  const totalPages = 10;
  const range = getPaginationRange({ page: page.value, totalPages });

  return (
    <Pagination.Root totalPages={totalPages} bind:page={page} class="pagination-default">
      <Pagination.List class="pagination-default-list">
        <li>
          <Pagination.PrevTrigger class="pagination-default-trigger" aria-label="Previous page">
            <LuChevronLeft class="pagination-default-icon" aria-hidden="true" />
          </Pagination.PrevTrigger>
        </li>
        {range.map((entry) =>
          entry.type === 'ellipsis' ? (
            <li key={entry.key}>
              <Pagination.Ellipsis class="pagination-default-ellipsis">
                <LuMoreHorizontal class="pagination-default-icon" aria-hidden="true" />
              </Pagination.Ellipsis>
            </li>
          ) : (
            <li key={entry.value}>
              <Pagination.Item value={entry.value} class="pagination-default-item">
                {entry.value}
              </Pagination.Item>
            </li>
          ),
        )}
        <li>
          <Pagination.NextTrigger class="pagination-default-trigger" aria-label="Next page">
            <LuChevronRight class="pagination-default-icon" aria-hidden="true" />
          </Pagination.NextTrigger>
        </li>
      </Pagination.List>
    </Pagination.Root>
  );
});
