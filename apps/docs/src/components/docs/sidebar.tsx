import { $, component$, type QRL, useSignal } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { css } from 'styled-system/css';
import { docsNav, normalizePath } from '../../docs-nav';
import { LuMenu, LuX } from '../icons';

const sectionTitleStyles = css({
  fontSize: 'xs',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'fg.subtle',
  px: '3',
  mb: '2',
});

const linkStyles = css({
  display: 'block',
  px: '3',
  py: '1.5',
  borderRadius: 'md',
  fontSize: 'sm',
  color: 'fg.muted',
  textDecoration: 'none',
  transition: 'background-color 0.15s ease, color 0.15s ease',
  _hover: { bg: 'bg.muted', color: 'fg.default' },
  _focusVisible: { outline: '2px solid', outlineColor: 'accent.default', outlineOffset: '-2px' },
  '&[aria-current="page"]': {
    bg: 'accent.subtle',
    color: 'accent.text',
    fontWeight: '600',
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
                  aria-current={item.href === pathname ? 'page' : undefined}
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
      py: '10',
      pr: '4',
      borderRight: '1px solid {colors.border.default}',
    })}
  >
    <DocsNavList />
  </aside>
));

const menuButtonStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2',
  px: '3',
  py: '1.5',
  borderRadius: 'md',
  border: '1px solid',
  borderColor: 'border.default',
  bg: 'bg.canvas',
  color: 'fg.default',
  fontFamily: 'inherit',
  fontSize: 'sm',
  cursor: 'pointer',
  _hover: { bg: 'bg.muted' },
  _focusVisible: { outline: '2px solid', outlineColor: 'accent.default', outlineOffset: '2px' },
  '& svg': { w: '4', h: '4' },
});

/** The docs navigation for small screens, opened in a modal dialog. */
export const MobileNav = component$(() => {
  const dialog = useSignal<HTMLDialogElement>();

  const close$ = $(() => dialog.value?.close());

  return (
    <div class={css({ display: { base: 'block', lg: 'none' }, mb: '6' })}>
      <button type="button" class={menuButtonStyles} onClick$={() => dialog.value?.showModal()}>
        <LuMenu aria-hidden="true" />
        Docs menu
      </button>
      {/* TODO(leve-ui): replace with Drawer (#35) */}
      <dialog
        ref={dialog}
        aria-label="Docs navigation"
        onClick$={(event, el) => {
          // Close when the backdrop (the dialog element itself) is clicked
          if (event.target === el) el.close();
        }}
        class={css({
          m: 0,
          p: 0,
          border: 'none',
          maxW: '320px',
          w: '85vw',
          h: '100dvh',
          maxH: '100dvh',
          bg: 'bg.canvas',
          color: 'fg.default',
          boxShadow: 'xl',
          _backdrop: { bg: 'rgb(15 23 42 / 0.4)' },
        })}
      >
        <div class={css({ p: '5', h: 'full', overflowY: 'auto' })}>
          <div class={css({ display: 'flex', justifyContent: 'flex-end', mb: '4' })}>
            <button type="button" class={menuButtonStyles} aria-label="Close" onClick$={close$}>
              <LuX aria-hidden="true" />
            </button>
          </div>
          <DocsNavList onNavigate$={close$} />
        </div>
      </dialog>
    </div>
  );
});
