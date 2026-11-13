import { component$, type QRL } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { css } from 'styled-system/css';
import { docsNav, normalizePath } from '../../docs-nav';

const sectionTitleStyles = css({
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'fg-subtle',
  m: 0,
  mb: '1.5',
});

const linkStyles = css({
  display: 'block',
  px: '3',
  py: { base: '2', lg: '7px' },
  borderRadius: 'md',
  fontSize: '14px',
  lineHeight: '16px',
  color: 'fg-muted',
  textDecoration: 'none',
  transition: 'background-color 0.15s ease, color 0.15s ease',
  _hover: { bg: 'bg-muted', color: 'fg-default' },
  _focusVisible: { outline: '2px solid', outlineColor: 'accent-default', outlineOffset: '-2px' },
  '&[aria-current="page"]': {
    bg: 'accent-subtle',
    color: 'accent-text',
    fontWeight: '500',
  },
});

/** The list of docs pages (shared by the desktop sidebar and the mobile menu). */
export const DocsNavList = component$<{ onNavigate$?: QRL<() => void> }>(({ onNavigate$ }) => {
  const loc = useLocation();
  const pathname = normalizePath(loc.url.pathname);

  return (
    <nav aria-label="Docs" class={css({ display: 'flex', flexDirection: 'column', gap: '6' })}>
      {docsNav.map((section) => (
        <div key={section.title}>
          <p class={sectionTitleStyles}>{section.title}</p>
          <ul class={css({ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: '0.5' })}>
            {section.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  class={linkStyles}
                  // 'false' instead of undefined: after an SPA navigation, Link keeps an
                  // attribute that changes to undefined, so the old page stayed marked
                  aria-current={item.href === pathname ? 'page' : 'false'}
                  onClick$={onNavigate$}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
});

export const Sidebar = component$(() => (
  <aside
    class={css({
      display: { base: 'none', lg: 'block' },
      position: 'sticky',
      top: '16',
      flexShrink: 0,
      w: '272px',
      h: 'calc(100vh - 4rem)',
      overflowY: 'auto',
      py: '8',
      px: '6',
      borderRight: '1px solid {colors.border-default}',
    })}
  >
    <DocsNavList />
  </aside>
));
