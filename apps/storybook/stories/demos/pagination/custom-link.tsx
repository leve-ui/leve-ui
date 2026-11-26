import {
  $,
  component$,
  type PropsOf,
  type QRL,
  Slot,
  sync$,
  useSignal,
  useStyles$,
} from '@builder.io/qwik';
import { getPaginationRange, Pagination } from '@leve-ui/pagination';
import { LuChevronLeft, LuChevronRight, LuMoreHorizontal } from '@qwikest/icons/lucide';
import styles from './custom-link.css?inline';

type ClientLinkProps = PropsOf<'a'> & {
  onNavigate$?: QRL<(href: string) => void>;
};

// Example of a router link component (such as Qwik City's <Link>) that reads href before Pagination updates the page
const ClientLink = component$<ClientLinkProps>(({ onNavigate$, onClick$, ...props }) => {
  const preventDefault$ = sync$((event: MouseEvent) => {
    if (!(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) {
      event.preventDefault();
    }
  });
  const handleClick$ = $((_event: MouseEvent, element: HTMLAnchorElement) => {
    const href = element.getAttribute('href');
    if (href) {
      onNavigate$?.(href);
    }
  });

  return (
    <a {...props} onClick$={[preventDefault$, handleClick$, onClick$]}>
      <Slot />
    </a>
  );
});

export default component$(() => {
  useStyles$(styles);
  const page = useSignal(2);
  const currentUrl = useSignal('/items?page=2');
  const totalPages = 8;
  const range = getPaginationRange({ page: page.value, totalPages });

  const handleNavigate$ = $((href: string) => {
    currentUrl.value = href;
  });

  return (
    <div class="pagination-custom-link-wrapper">
      <Pagination.Root totalPages={totalPages} bind:page={page} class="pagination-custom-link">
        <Pagination.List class="pagination-custom-link-list">
          <li>
            <Pagination.PrevTrigger
              as={ClientLink}
              href={`/items?page=${Math.max(1, page.value - 1)}`}
              onNavigate$={handleNavigate$}
              class="pagination-custom-link-trigger"
              aria-label="Previous page"
            >
              <LuChevronLeft class="pagination-custom-link-icon" aria-hidden="true" />
            </Pagination.PrevTrigger>
          </li>
          {range.map((entry) =>
            entry.type === 'ellipsis' ? (
              <li key={entry.key}>
                <Pagination.Ellipsis class="pagination-custom-link-ellipsis">
                  <LuMoreHorizontal class="pagination-custom-link-icon" aria-hidden="true" />
                </Pagination.Ellipsis>
              </li>
            ) : (
              <li key={entry.value}>
                <Pagination.Item
                  as={ClientLink}
                  value={entry.value}
                  href={`/items?page=${entry.value}`}
                  onNavigate$={handleNavigate$}
                  class="pagination-custom-link-item"
                >
                  {entry.value}
                </Pagination.Item>
              </li>
            ),
          )}
          <li>
            <Pagination.NextTrigger
              as={ClientLink}
              href={`/items?page=${Math.min(totalPages, page.value + 1)}`}
              onNavigate$={handleNavigate$}
              class="pagination-custom-link-trigger"
              aria-label="Next page"
            >
              <LuChevronRight class="pagination-custom-link-icon" aria-hidden="true" />
            </Pagination.NextTrigger>
          </li>
        </Pagination.List>
      </Pagination.Root>
      <p class="pagination-custom-link-status">Navigated to: {currentUrl.value}</p>
    </div>
  );
});
