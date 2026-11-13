import { $, component$, useSignal } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { css, cx } from 'styled-system/css';
import { normalizePath } from '../../docs-nav';
import { isLocale, LOCALE_NAMES, LOCALES, localizeHref } from '../../i18n/locales';
import { useLocale } from '../../i18n/use-locale';
import { DocsNavList } from '../docs/sidebar';
import { LuBookOpen, LuGithub, LuMenu, LuMoon, LuPackage, LuSearch, LuSun, LuX } from '../icons';

const GITHUB_URL = 'https://github.com/leve-ui/leve-ui';
const NPM_URL = 'https://www.npmjs.com/package/@leve-ui/core';
const STORYBOOK_URL = 'https://leve-ui-storybook.pages.dev';

const focusRing = {
  _focusVisible: { outline: '2px solid', outlineColor: 'accent-default', outlineOffset: '2px' },
} as const;

const navLinkStyles = css({
  fontSize: '14px',
  fontWeight: '500',
  color: 'fg-muted',
  textDecoration: 'none',
  borderRadius: 'sm',
  transition: 'color 0.15s ease',
  _hover: { color: 'fg-default' },
  '&[aria-current="page"]': { color: 'fg-default' },
  ...focusRing,
});

const iconButtonStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  w: '8',
  h: '8',
  borderRadius: 'md',
  color: 'fg-muted',
  bg: 'transparent',
  border: 'none',
  cursor: 'pointer',
  transition: 'color 0.15s ease, background-color 0.15s ease',
  _hover: { color: 'fg-default', bg: 'bg-muted' },
  ...focusRing,
  '& svg': { w: '18px', h: '18px' },
});

// The design uses 20px icons on small screens and 18px icons on larger ones
const mobileIconStyles = css({
  '& svg': { w: { base: '5', md: '18px' }, h: { base: '5', md: '18px' } },
});

const Logo = component$(() => {
  // Hooks must run in the component body, not inside JSX props (they become getters)
  const locale = useLocale();

  return (
    <Link
      href={localizeHref('/', locale)}
      aria-label="leve-ui home"
      class={css({ display: 'flex', flexShrink: 0, borderRadius: 'sm', ...focusRing })}
    >
      {/* The logo is swapped for the theme */}
      <img
        src="/logo-dark.svg"
        alt=""
        width={119}
        height={32}
        class={css({ h: '8', w: 'auto', display: 'block', _dark: { display: 'none' } })}
      />
      <img
        src="/logo-light.svg"
        alt=""
        width={119}
        height={32}
        class={css({ h: '8', w: 'auto', display: 'none', _dark: { display: 'block' } })}
      />
    </Link>
  );
});

const ThemeToggle = component$<{ class?: string }>((props) => {
  const toggleTheme$ = $(() => {
    const root = document.documentElement;
    const dark = !root.classList.contains('dark');
    root.classList.toggle('dark', dark);
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  });

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick$={toggleTheme$}
      class={cx(iconButtonStyles, props.class)}
    >
      <LuMoon aria-hidden="true" class={css({ _dark: { display: 'none' } })} />
      <LuSun aria-hidden="true" class={css({ display: 'none', _dark: { display: 'block' } })} />
    </button>
  );
});

/**
 * Switches to the same page in another language. A full page load, so that
 * `<html lang>` is rendered again for the new locale.
 */
const LanguageSwitcher = component$(() => {
  const loc = useLocation();
  const locale = useLocale();

  return (
    // TODO(leve-ui): replace with Menu (#39)
    <select
      aria-label="Language"
      onChange$={(_, el) => {
        if (!isLocale(el.value)) return;
        const path = normalizePath(loc.url.pathname);
        window.location.assign(localizeHref(path, el.value) + loc.url.hash);
      }}
      class={css({
        h: '8',
        ps: '2',
        pe: '1',
        bg: 'transparent',
        color: 'fg-muted',
        border: '1px solid {colors.border-default}',
        borderRadius: 'md',
        fontFamily: 'inherit',
        fontSize: '13px',
        cursor: 'pointer',
        _hover: { color: 'fg-default' },
        ...focusRing,
      })}
    >
      {LOCALES.map((l) => (
        <option key={l} value={l} lang={l} selected={l === locale}>
          {LOCALE_NAMES[l]}
        </option>
      ))}
    </select>
  );
});

/** The docs navigation for small screens, opened from the menu button. */
const MobileMenu = component$(() => {
  const dialog = useSignal<HTMLDialogElement>();
  const close$ = $(() => dialog.value?.close());

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation"
        aria-haspopup="dialog"
        class={cx(iconButtonStyles, mobileIconStyles, css({ color: 'fg-default', ms: '-1.5' }))}
        onClick$={() => dialog.value?.showModal()}
      >
        <LuMenu aria-hidden="true" />
      </button>
      {/* TODO(leve-ui): replace with Drawer (#35) */}
      <dialog
        ref={dialog}
        aria-label="Navigation"
        onClick$={(event, el) => {
          // Close when the backdrop (the dialog element itself) is clicked
          if (event.target === el) el.close();
        }}
        class={css({
          m: 0,
          p: 0,
          border: 'none',
          w: '300px',
          maxW: '85vw',
          h: '100dvh',
          maxH: '100dvh',
          bg: 'bg-canvas',
          color: 'fg-default',
          _backdrop: { bg: 'rgb(15 23 42 / 0.4)' },
        })}
      >
        <div class={css({ p: '4', h: 'full', overflowY: 'auto' })}>
          <div
            class={css({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: '1',
              pb: '2',
              mb: '2',
            })}
          >
            <Logo />
            <button
              type="button"
              aria-label="Close navigation"
              class={cx(iconButtonStyles, mobileIconStyles)}
              onClick$={close$}
            >
              <LuX aria-hidden="true" />
            </button>
          </div>
          <DocsNavList onNavigate$={close$} />
        </div>
      </dialog>
    </>
  );
});

export const Header = component$(() => {
  const loc = useLocation();
  const locale = useLocale();
  const path = normalizePath(loc.url.pathname);

  return (
    <header
      class={css({
        position: 'sticky',
        top: 0,
        zIndex: 50,
        h: { base: '56px', md: '64px' },
        px: { base: '4', md: '6' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '4',
        bg: 'bg-canvas',
        borderBottom: '1px solid {colors.border-default}',
      })}
    >
      <div class={css({ display: 'flex', alignItems: 'center', gap: { base: '3', md: '8' } })}>
        <div class={css({ display: { base: 'flex', md: 'none' } })}>
          <MobileMenu />
        </div>
        <Logo />
        <nav
          aria-label="Main"
          class={css({ display: { base: 'none', md: 'flex' }, alignItems: 'center', gap: '6' })}
        >
          <Link
            href={localizeHref('/overview/introduction/', locale)}
            class={navLinkStyles}
            aria-current={path.startsWith('/overview/') ? 'page' : 'false'}
          >
            Docs
          </Link>
          <Link
            href={localizeHref('/components/', locale)}
            class={navLinkStyles}
            aria-current={path.startsWith('/components/') ? 'page' : 'false'}
          >
            Components
          </Link>
        </nav>
      </div>

      <div class={css({ display: 'flex', alignItems: 'center', gap: { base: '1', md: '4' } })}>
        {/* Decorative until search is implemented */}
        {/* TODO(leve-ui): replace with Combobox (#52) */}
        <div
          class={css({
            display: { base: 'none', md: 'flex' },
            alignItems: 'center',
            gap: '2',
            w: '240px',
            h: '9',
            px: '3',
            bg: 'bg-subtle',
            border: '1px solid {colors.border-default}',
            borderRadius: 'lg',
            _focusWithin: { borderColor: 'accent-default' },
          })}
        >
          <LuSearch aria-hidden="true" class={css({ w: '4', h: '4', color: 'fg-subtle' })} />
          <input
            type="search"
            placeholder="Search docs"
            aria-label="Search docs"
            class={css({
              flex: '1',
              minW: 0,
              bg: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              fontSize: '14px',
              color: 'fg-default',
              _placeholder: { color: 'fg-subtle' },
            })}
          />
        </div>

        <div
          aria-hidden="true"
          class={css({
            display: { base: 'none', md: 'block' },
            w: '1px',
            h: '5',
            bg: 'border-default',
          })}
        />

        <div class={css({ display: { base: 'none', md: 'flex' }, alignItems: 'center', gap: '1' })}>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            class={iconButtonStyles}
          >
            <LuGithub aria-hidden="true" />
          </a>
          <a
            href={NPM_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="npm package"
            class={iconButtonStyles}
          >
            <LuPackage aria-hidden="true" />
          </a>
          <a
            href={STORYBOOK_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Storybook"
            class={iconButtonStyles}
          >
            <LuBookOpen aria-hidden="true" />
          </a>
        </div>
        <LanguageSwitcher />
        <ThemeToggle class={mobileIconStyles} />
      </div>
    </header>
  );
});
