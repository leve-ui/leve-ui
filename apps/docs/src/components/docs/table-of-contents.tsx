import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import type { ContentHeading } from '@builder.io/qwik-city';
import { css } from 'styled-system/css';

const linkStyles = css({
  display: 'block',
  py: '1',
  fontSize: 'sm',
  color: 'fg.subtle',
  textDecoration: 'none',
  borderLeft: '2px solid transparent',
  ml: '-1px',
  pl: '3',
  transition: 'color 0.15s ease, border-color 0.15s ease',
  _hover: { color: 'fg.default' },
  _focusVisible: { outline: '2px solid', outlineColor: 'accent.default', outlineOffset: '2px' },
  '&[data-level="3"]': { pl: '6' },
  '&[data-active]': { color: 'accent.text', borderColor: 'accent.default', fontWeight: '500' },
});

/**
 * "On this page": links to the h2 / h3 of the current page, highlighting the
 * section being read. Scroll-spy is specific to the docs site, not a library
 * component (decided on #97).
 */
export const TableOfContents = component$<{ headings: ContentHeading[] }>(({ headings }) => {
  const items = headings.filter((h) => h.level === 2 || h.level === 3);
  const active = useSignal<string>();

  // biome-ignore lint/correctness/noQwikUseVisibleTask: observing scroll position needs the DOM; there is no event to hook into instead
  useVisibleTask$(({ track, cleanup }) => {
    const ids = track(() => headings.map((h) => h.id).join(' '));
    const elements = ids
      .split(' ')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // The first visible heading in document order wins
        const first = elements.find((el) => visible.has(el.id));
        if (first) active.value = first.id;
      },
      // Treat the top part of the viewport (below the sticky header) as "being read"
      { rootMargin: '-64px 0px -60% 0px' },
    );
    for (const el of elements) observer.observe(el);
    cleanup(() => observer.disconnect());
  });

  if (items.length === 0)
    return <div class={css({ display: { base: 'none', xl: 'block' }, w: '200px' })} />;

  return (
    <aside
      class={css({
        display: { base: 'none', xl: 'block' },
        position: 'sticky',
        top: '16',
        flexShrink: 0,
        w: '200px',
        maxH: 'calc(100vh - 4rem)',
        overflowY: 'auto',
        py: '10',
      })}
    >
      <nav aria-labelledby="docs-toc-title">
        <p
          id="docs-toc-title"
          class={css({ fontSize: 'sm', fontWeight: '600', color: 'fg.default', mt: 0, mb: '3' })}
        >
          On this page
        </p>
        <ul
          class={css({
            listStyle: 'none',
            p: 0,
            m: 0,
            borderLeft: '1px solid {colors.border.default}',
          })}
        >
          {items.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                class={linkStyles}
                data-level={h.level}
                data-active={active.value === h.id ? '' : undefined}
                aria-current={active.value === h.id ? 'location' : undefined}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
});
