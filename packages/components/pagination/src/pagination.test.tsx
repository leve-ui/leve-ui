import { $, component$, type PropsOf, Slot, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { getPaginationRange, Pagination } from './index';

const CustomLink = component$<PropsOf<'a'> & { prefetch?: boolean }>(
  ({ prefetch: _prefetch, ...props }) => (
    <a {...props} data-custom-link="">
      <Slot />
    </a>
  ),
);

describe('getPaginationRange', () => {
  it('returns single page when totalPages is 1 or less', () => {
    expect(getPaginationRange({ page: 1, totalPages: 1 })).toEqual([{ type: 'page', value: 1 }]);
    expect(getPaginationRange({ page: 1, totalPages: 0 })).toEqual([{ type: 'page', value: 1 }]);
    expect(getPaginationRange({ page: 1, totalPages: -3 })).toEqual([{ type: 'page', value: 1 }]);
  });

  it('returns all pages without ellipsis when totalPages fits within window', () => {
    expect(getPaginationRange({ page: 1, totalPages: 5 })).toEqual([
      { type: 'page', value: 1 },
      { type: 'page', value: 2 },
      { type: 'page', value: 3 },
      { type: 'page', value: 4 },
      { type: 'page', value: 5 },
    ]);
    expect(getPaginationRange({ page: 4, totalPages: 7 })).toEqual([
      { type: 'page', value: 1 },
      { type: 'page', value: 2 },
      { type: 'page', value: 3 },
      { type: 'page', value: 4 },
      { type: 'page', value: 5 },
      { type: 'page', value: 6 },
      { type: 'page', value: 7 },
    ]);
  });

  it('shows end ellipsis near start of range', () => {
    expect(getPaginationRange({ page: 1, totalPages: 10 })).toEqual([
      { type: 'page', value: 1 },
      { type: 'page', value: 2 },
      { type: 'page', value: 3 },
      { type: 'page', value: 4 },
      { type: 'page', value: 5 },
      { type: 'ellipsis', key: 'end-ellipsis' },
      { type: 'page', value: 10 },
    ]);
  });

  it('shows both start and end ellipses in middle of range', () => {
    expect(getPaginationRange({ page: 5, totalPages: 10 })).toEqual([
      { type: 'page', value: 1 },
      { type: 'ellipsis', key: 'start-ellipsis' },
      { type: 'page', value: 4 },
      { type: 'page', value: 5 },
      { type: 'page', value: 6 },
      { type: 'ellipsis', key: 'end-ellipsis' },
      { type: 'page', value: 10 },
    ]);
  });

  it('shows start ellipsis near end of range', () => {
    expect(getPaginationRange({ page: 9, totalPages: 10 })).toEqual([
      { type: 'page', value: 1 },
      { type: 'ellipsis', key: 'start-ellipsis' },
      { type: 'page', value: 6 },
      { type: 'page', value: 7 },
      { type: 'page', value: 8 },
      { type: 'page', value: 9 },
      { type: 'page', value: 10 },
    ]);
  });

  it('supports custom siblingCount and boundaryCount', () => {
    expect(
      getPaginationRange({ page: 6, totalPages: 12, siblingCount: 2, boundaryCount: 2 }),
    ).toEqual([
      { type: 'page', value: 1 },
      { type: 'page', value: 2 },
      { type: 'page', value: 3 },
      { type: 'page', value: 4 },
      { type: 'page', value: 5 },
      { type: 'page', value: 6 },
      { type: 'page', value: 7 },
      { type: 'page', value: 8 },
      { type: 'ellipsis', key: 'end-ellipsis' },
      { type: 'page', value: 11 },
      { type: 'page', value: 12 },
    ]);

    expect(
      getPaginationRange({ page: 8, totalPages: 15, siblingCount: 2, boundaryCount: 2 }),
    ).toEqual([
      { type: 'page', value: 1 },
      { type: 'page', value: 2 },
      { type: 'ellipsis', key: 'start-ellipsis' },
      { type: 'page', value: 6 },
      { type: 'page', value: 7 },
      { type: 'page', value: 8 },
      { type: 'page', value: 9 },
      { type: 'page', value: 10 },
      { type: 'ellipsis', key: 'end-ellipsis' },
      { type: 'page', value: 14 },
      { type: 'page', value: 15 },
    ]);

    expect(
      getPaginationRange({ page: 5, totalPages: 10, siblingCount: 1, boundaryCount: 0 }),
    ).toEqual([
      { type: 'ellipsis', key: 'start-ellipsis' },
      { type: 'page', value: 4 },
      { type: 'page', value: 5 },
      { type: 'page', value: 6 },
      { type: 'ellipsis', key: 'end-ellipsis' },
    ]);
  });

  it('clamps out-of-range page values', () => {
    expect(getPaginationRange({ page: -5, totalPages: 10 })).toEqual(
      getPaginationRange({ page: 1, totalPages: 10 }),
    );
    expect(getPaginationRange({ page: 99, totalPages: 10 })).toEqual(
      getPaginationRange({ page: 10, totalPages: 10 }),
    );
  });
});

describe('Pagination', () => {
  it('renders all parts with expected elements, ARIA attributes, and data attributes', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Pagination.Root totalPages={5} defaultPage={2} class="custom-nav">
        <Pagination.List class="custom-list">
          <li>
            <Pagination.PrevTrigger>Prev</Pagination.PrevTrigger>
          </li>
          <li>
            <Pagination.Item value={1}>1</Pagination.Item>
          </li>
          <li>
            <Pagination.Item value={2}>2</Pagination.Item>
          </li>
          <li>
            <Pagination.Ellipsis>...</Pagination.Ellipsis>
          </li>
          <li>
            <Pagination.Item value={5}>5</Pagination.Item>
          </li>
          <li>
            <Pagination.NextTrigger>Next</Pagination.NextTrigger>
          </li>
        </Pagination.List>
      </Pagination.Root>,
    );

    const root = screen.querySelector('[data-leve-pagination]');
    expect(root?.tagName).toBe('NAV');
    expect(root?.getAttribute('aria-label')).toBe('Pagination');
    expect(root?.classList.contains('custom-nav')).toBe(true);
    expect(root?.hasAttribute('data-disabled')).toBe(false);

    const list = screen.querySelector('[data-leve-pagination-list]');
    expect(list?.tagName).toBe('UL');
    expect(list?.classList.contains('custom-list')).toBe(true);

    const ellipsis = screen.querySelector('[data-leve-pagination-ellipsis]');
    expect(ellipsis?.tagName).toBe('SPAN');
    expect(ellipsis?.getAttribute('aria-hidden')).toBe('true');

    const items = Array.from(screen.querySelectorAll('[data-leve-pagination-item]'));
    expect(items).toHaveLength(3);
    expect(items[0]?.tagName).toBe('BUTTON');
    expect(items[0]?.getAttribute('type')).toBe('button');
    expect(items[0]?.getAttribute('aria-current')).toBeNull();
    expect(items[0]?.getAttribute('data-state')).toBe('unselected');
    expect(items[0]?.hasAttribute('data-selected')).toBe(false);

    expect(items[1]?.getAttribute('aria-current')).toBe('page');
    expect(items[1]?.getAttribute('data-state')).toBe('selected');
    expect(items[1]?.hasAttribute('data-selected')).toBe(true);
  });

  it('respects custom aria-label and aria-labelledby on Root', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Pagination.Root totalPages={3} aria-label="Search results pages">
        <Pagination.List>
          <li>
            <Pagination.Item value={1}>1</Pagination.Item>
          </li>
        </Pagination.List>
      </Pagination.Root>,
    );

    expect(screen.querySelector('[data-leve-pagination]')?.getAttribute('aria-label')).toBe(
      'Search results pages',
    );
  });

  it('navigates pages via Item, PrevTrigger, and NextTrigger in uncontrolled mode', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Pagination.Root count={25} pageSize={10}>
        <Pagination.List>
          <li>
            <Pagination.PrevTrigger>Prev</Pagination.PrevTrigger>
          </li>
          <li>
            <Pagination.Item value={1}>1</Pagination.Item>
          </li>
          <li>
            <Pagination.Item value={2}>2</Pagination.Item>
          </li>
          <li>
            <Pagination.Item value={3}>3</Pagination.Item>
          </li>
          <li>
            <Pagination.NextTrigger>Next</Pagination.NextTrigger>
          </li>
        </Pagination.List>
      </Pagination.Root>,
    );

    const prev = screen.querySelector('[data-leve-pagination-prev-trigger]') as HTMLButtonElement;
    const next = screen.querySelector('[data-leve-pagination-next-trigger]') as HTMLButtonElement;
    const items = Array.from(screen.querySelectorAll('[data-leve-pagination-item]'));

    expect(prev.hasAttribute('disabled')).toBe(true);
    expect(prev.hasAttribute('data-disabled')).toBe(true);
    expect(next.hasAttribute('disabled')).toBe(false);
    expect(items[0]?.getAttribute('aria-current')).toBe('page');

    await userEvent('[data-leve-pagination-next-trigger]', 'click');
    expect(items[1]?.getAttribute('aria-current')).toBe('page');
    expect(prev.hasAttribute('data-disabled')).toBe(false);
    expect(prev.hasAttribute('disabled')).toBe(false);
    expect(next.hasAttribute('disabled')).toBe(false);

    await userEvent(items[2] as Element, 'click');
    expect(items[2]?.getAttribute('aria-current')).toBe('page');
    expect(next.hasAttribute('disabled')).toBe(true);
    expect(next.hasAttribute('data-disabled')).toBe(true);

    await userEvent('[data-leve-pagination-prev-trigger]', 'click');
    expect(items[1]?.getAttribute('aria-current')).toBe('page');
  });

  it('prefers totalPages over count and pageSize, and clamps defaultPage', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Pagination.Root count={100} pageSize={10} totalPages={3} defaultPage={99}>
        <Pagination.List>
          <li>
            <Pagination.Item value={1}>1</Pagination.Item>
          </li>
          <li>
            <Pagination.Item value={3}>3</Pagination.Item>
          </li>
          <li>
            <Pagination.NextTrigger>Next</Pagination.NextTrigger>
          </li>
        </Pagination.List>
      </Pagination.Root>,
    );

    const items = Array.from(screen.querySelectorAll('[data-leve-pagination-item]'));
    const next = screen.querySelector('[data-leve-pagination-next-trigger]') as HTMLButtonElement;
    expect(items[1]?.getAttribute('aria-current')).toBe('page');
    expect(next.hasAttribute('disabled')).toBe(true);
  });

  it('supports controlled bind:page and onPageChange$', async () => {
    const changes: number[] = [];
    const Controlled = component$(() => {
      const page = useSignal(2);
      const handleChange$ = $((nextPage: number) => {
        changes.push(nextPage);
      });

      return (
        <div>
          <span data-testid="current">{page.value}</span>
          <Pagination.Root totalPages={4} bind:page={page} onPageChange$={handleChange$}>
            <Pagination.List>
              <li>
                <Pagination.PrevTrigger>Prev</Pagination.PrevTrigger>
              </li>
              <li>
                <Pagination.Item value={1}>1</Pagination.Item>
              </li>
              <li>
                <Pagination.Item value={2}>2</Pagination.Item>
              </li>
              <li>
                <Pagination.Item value={3}>3</Pagination.Item>
              </li>
              <li>
                <Pagination.NextTrigger>Next</Pagination.NextTrigger>
              </li>
            </Pagination.List>
          </Pagination.Root>
        </div>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<Controlled />);

    expect(screen.querySelector('[data-testid="current"]')?.textContent).toBe('2');

    await userEvent('[data-leve-pagination-next-trigger]', 'click');
    expect(screen.querySelector('[data-testid="current"]')?.textContent).toBe('3');
    expect(changes).toEqual([3]);
  });

  it('renders anchor elements in link mode and omits href when disabled', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Pagination.Root totalPages={3} defaultPage={1}>
        <Pagination.List>
          <li>
            <Pagination.PrevTrigger href="/items?page=1">Prev</Pagination.PrevTrigger>
          </li>
          <li>
            <Pagination.Item value={1} href="/items?page=1">
              1
            </Pagination.Item>
          </li>
          <li>
            <Pagination.Item value={2} href="/items?page=2">
              2
            </Pagination.Item>
          </li>
          <li>
            <Pagination.Item value={3} href="/items?page=3" disabled>
              3
            </Pagination.Item>
          </li>
          <li>
            <Pagination.NextTrigger href="/items?page=2">Next</Pagination.NextTrigger>
          </li>
        </Pagination.List>
      </Pagination.Root>,
    );

    const prev = screen.querySelector('[data-leve-pagination-prev-trigger]');
    expect(prev?.tagName).toBe('A');
    expect(prev?.hasAttribute('href')).toBe(false);
    expect(prev?.getAttribute('aria-disabled')).toBe('true');
    expect(prev?.getAttribute('tabindex')).toBe('-1');
    expect(prev?.hasAttribute('data-disabled')).toBe(true);

    const items = Array.from(screen.querySelectorAll('[data-leve-pagination-item]'));
    expect(items[0]?.tagName).toBe('A');
    expect(items[0]?.getAttribute('href')).toBe('/items?page=1');
    expect(items[0]?.getAttribute('aria-current')).toBe('page');

    expect(items[2]?.tagName).toBe('A');
    expect(items[2]?.hasAttribute('href')).toBe(false);
    expect(items[2]?.getAttribute('aria-disabled')).toBe('true');
    expect(items[2]?.getAttribute('tabindex')).toBe('-1');

    const next = screen.querySelector('[data-leve-pagination-next-trigger]');
    expect(next?.tagName).toBe('A');
    expect(next?.getAttribute('href')).toBe('/items?page=2');
  });

  it('supports polymorphic as prop on Item, PrevTrigger, and NextTrigger', async () => {
    const { screen, render } = await createDOM();
    await render(
      <Pagination.Root totalPages={3} defaultPage={2}>
        <Pagination.List>
          <li>
            <Pagination.PrevTrigger as={CustomLink} href="/page/1" prefetch>
              Prev
            </Pagination.PrevTrigger>
          </li>
          <li>
            <Pagination.Item as={CustomLink} value={2} href="/page/2" prefetch>
              2
            </Pagination.Item>
          </li>
          <li>
            <Pagination.NextTrigger as="span">Next</Pagination.NextTrigger>
          </li>
        </Pagination.List>
      </Pagination.Root>,
    );

    const prev = screen.querySelector('[data-leve-pagination-prev-trigger]');
    expect(prev?.tagName).toBe('A');
    expect(prev?.hasAttribute('data-custom-link')).toBe(true);
    expect(prev?.getAttribute('href')).toBe('/page/1');

    const item = screen.querySelector('[data-leve-pagination-item]');
    expect(item?.tagName).toBe('A');
    expect(item?.hasAttribute('data-custom-link')).toBe(true);
    expect(item?.getAttribute('aria-current')).toBe('page');

    const next = screen.querySelector('[data-leve-pagination-next-trigger]');
    expect(next?.tagName).toBe('SPAN');
  });

  it('disables all interactive controls when Root is disabled', async () => {
    const changes: number[] = [];
    const handleChange$ = $((nextPage: number) => {
      changes.push(nextPage);
    });
    const { screen, render, userEvent } = await createDOM();
    await render(
      <Pagination.Root totalPages={3} defaultPage={2} disabled onPageChange$={handleChange$}>
        <Pagination.List>
          <li>
            <Pagination.PrevTrigger>Prev</Pagination.PrevTrigger>
          </li>
          <li>
            <Pagination.Item value={1}>1</Pagination.Item>
          </li>
          <li>
            <Pagination.Item value={2}>2</Pagination.Item>
          </li>
          <li>
            <Pagination.NextTrigger>Next</Pagination.NextTrigger>
          </li>
        </Pagination.List>
      </Pagination.Root>,
    );

    const root = screen.querySelector('[data-leve-pagination]');
    expect(root?.hasAttribute('data-disabled')).toBe(true);

    const items = Array.from(screen.querySelectorAll('[data-leve-pagination-item]'));
    expect(items[0]?.hasAttribute('disabled')).toBe(true);
    expect(items[0]?.hasAttribute('data-disabled')).toBe(true);

    await userEvent(items[0] as Element, 'click');
    await userEvent('[data-leve-pagination-next-trigger]', 'click');
    expect(changes).toEqual([]);
    expect(items[1]?.getAttribute('aria-current')).toBe('page');
  });
});
