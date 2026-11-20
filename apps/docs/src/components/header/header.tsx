import { $, component$, useSignal } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { Drawer, Menu } from '@leve-ui/core';
import { css, cx } from 'styled-system/css';
import { normalizePath } from '../../docs-nav';
import { LOCALE_NAMES, LOCALES, localizeHref } from '../../i18n/locales';
import { t } from '../../i18n/translate';
import { useLocale } from '../../i18n/use-locale';
import { DocsNavList } from '../docs/sidebar';
import {
  LuBookOpen,
  LuCheck,
  LuChevronDown,
  LuGithub,
  LuLanguages,
  LuMenu,
  LuMoon,
  LuPackage,
  LuSun,
  LuX,
  XIcon,
} from '../icons';
import { DocsSearch } from './docs-search';

const GITHUB_URL = 'https://github.com/leve-ui/leve-ui';
const NPM_URL = 'https://www.npmjs.com/package/@leve-ui/core';
const STORYBOOK_URL = 'https://storybook.leve-ui.dev';
const X_URL = 'https://x.com/leve_ui';

const focusRing = {
  _focusVisible: { outline: '2px solid', outlineColor: 'accent-default', outlineOffset: '2px' },
} as const;

const navLinkStyles = css({
  fontSize: '14px',
  fontWeight: '500',
  color: 'fg-muted',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
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
      aria-label={t(locale, 'leve-ui home')}
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
  const locale = useLocale();
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
      aria-label={t(locale, 'Toggle color theme')}
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
    <Menu.Root>
      <Menu.Trigger
        aria-label={t(locale, 'Language')}
        class={cx(
          mobileIconStyles,
          css({
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { base: '0', md: '1' },
            w: { base: '8', md: 'auto' },
            h: { base: '8', md: 'auto' },
            px: { base: '0', md: '2.5' },
            py: { base: '0', md: '1.5' },
            borderRadius: 'md',
            bg: 'transparent',
            border: 'none',
            color: 'fg-muted',
            fontFamily: 'inherit',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'color 0.15s ease, background-color 0.15s ease',
            _hover: { color: 'fg-default', bg: 'bg-muted' },
            ...focusRing,
          }),
        )}
      >
        <LuLanguages aria-hidden="true" />
        <span class={css({ display: { base: 'none', md: 'inline' } })}>{locale.toUpperCase()}</span>
        <LuChevronDown
          aria-hidden="true"
          class={css({ display: { base: 'none', md: 'block' }, w: '3.5!', h: '3.5!' })}
        />
      </Menu.Trigger>
      <Menu.Content
        side="bottom"
        align="end"
        sideOffset={4}
        class={css({
          m: 0,
          minW: '140px',
          bg: 'bg-canvas',
          color: 'fg-default',
          border: '1px solid {colors.border-default}',
          borderRadius: 'lg',
          p: '1',
          boxShadow: '0 10px 25px -5px rgb(15 23 42 / 0.14)',
        })}
      >
        {LOCALES.map((l) => (
          <Menu.Item
            key={l}
            lang={l}
            onSelect$={() => {
              if (l === locale) return;
              const path = normalizePath(loc.url.pathname);
              window.location.assign(localizeHref(path, l) + loc.url.hash);
            }}
            class={css({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2',
              px: '2.5',
              py: '1.5',
              borderRadius: 'md',
              fontSize: '13px',
              fontWeight: l === locale ? '600' : '400',
              color: l === locale ? 'accent-text' : 'fg-default',
              cursor: 'pointer',
              outline: 'none',
              '&[data-highlighted]': {
                bg: 'bg-muted',
              },
              '& svg': { w: '3.5', h: '3.5' },
            })}
          >
            <span>{LOCALE_NAMES[l]}</span>
            {l === locale && <LuCheck aria-hidden="true" />}
          </Menu.Item>
        ))}
      </Menu.Content>
    </Menu.Root>
  );
});

/** The docs navigation for small screens, opened from the menu button. */
const MobileMenu = component$(() => {
  const locale = useLocale();
  const open = useSignal(false);
  const close$ = $(() => {
    open.value = false;
  });

  return (
    <Drawer.Root bind:open={open} modal side="left">
      <Drawer.Trigger
        aria-label={t(locale, 'Open navigation')}
        class={cx(iconButtonStyles, mobileIconStyles, css({ color: 'fg-default', ms: '-1.5' }))}
      >
        <LuMenu aria-hidden="true" />
      </Drawer.Trigger>
      <Drawer.Content
        class={css({
          m: 0,
          p: 0,
          border: 'none',
          insetInlineStart: 0,
          insetInlineEnd: 'auto',
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
            <Drawer.Title class={css({ srOnly: true })}>{t(locale, 'Navigation')}</Drawer.Title>
            <Drawer.Close
              aria-label={t(locale, 'Close navigation')}
              class={cx(iconButtonStyles, mobileIconStyles)}
            >
              <LuX aria-hidden="true" />
            </Drawer.Close>
          </div>
          <DocsNavList onNavigate$={close$} />
        </div>
      </Drawer.Content>
    </Drawer.Root>
  );
});

export const Header = component$(() => {
  const loc = useLocation();
  const locale = useLocale();
  const path = normalizePath(loc.url.pathname);
  const isRoadmap = path.startsWith('/overview/roadmap/');

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
          aria-label={t(locale, 'Main')}
          class={css({ display: { base: 'none', md: 'flex' }, alignItems: 'center', gap: '6' })}
        >
          <Link
            href={localizeHref('/overview/introduction/', locale)}
            class={navLinkStyles}
            aria-current={path.startsWith('/overview/') && !isRoadmap ? 'page' : 'false'}
          >
            {t(locale, 'Docs')}
          </Link>
          <Link
            href={localizeHref('/components/', locale)}
            class={navLinkStyles}
            aria-current={path.startsWith('/components/') ? 'page' : 'false'}
          >
            {t(locale, 'Components')}
          </Link>
          <Link
            href={localizeHref('/overview/roadmap/', locale)}
            class={navLinkStyles}
            aria-current={isRoadmap ? 'page' : 'false'}
          >
            {t(locale, 'Roadmap')}
          </Link>
        </nav>
      </div>

      <div class={css({ display: 'flex', alignItems: 'center', gap: { base: '1', md: '4' } })}>
        <DocsSearch />

        <LanguageSwitcher />

        <div
          aria-hidden="true"
          class={css({
            display: { base: 'none', md: 'block' },
            w: '1px',
            h: '5',
            bg: 'border-default',
          })}
        />

        <div class={css({ display: 'flex', alignItems: 'center', gap: { base: '1', md: '0.5' } })}>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={t(locale, 'GitHub repository')}
            class={cx(iconButtonStyles, css({ display: { base: 'none', md: 'inline-flex' } }))}
          >
            <LuGithub aria-hidden="true" />
          </a>
          <a
            href={NPM_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={t(locale, 'npm package')}
            class={cx(iconButtonStyles, css({ display: { base: 'none', md: 'inline-flex' } }))}
          >
            <LuPackage aria-hidden="true" />
          </a>
          <a
            href={STORYBOOK_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Storybook"
            class={cx(iconButtonStyles, css({ display: { base: 'none', md: 'inline-flex' } }))}
          >
            <LuBookOpen aria-hidden="true" />
          </a>
          <a
            href={X_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="X (@leve_ui)"
            class={cx(iconButtonStyles, css({ display: { base: 'none', md: 'inline-flex' } }))}
          >
            <XIcon aria-hidden="true" />
          </a>
          <ThemeToggle class={mobileIconStyles} />
        </div>
      </div>
    </header>
  );
});
