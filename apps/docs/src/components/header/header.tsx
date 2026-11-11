import { $, component$, useSignal } from '@builder.io/qwik';
import { Separator } from '@leve-ui/core';
import { css } from 'styled-system/css';
import { LuGithub, LuMoon, LuSearch, LuSun } from '../icons';

const headerContainerStyles = css({
  position: 'sticky',
  top: 0,
  zIndex: 50,
  width: '100%',
  bg: 'bg.header',
  backdropFilter: 'blur(12px)',
  borderBottom: '1px solid',
  borderColor: 'border.subtle',
  transition: 'background-color 0.2s, border-color 0.2s',
});

const headerInnerStyles = css({
  maxW: '1400px',
  mx: 'auto',
  px: { base: '4', sm: '6', lg: '8' },
  h: '16',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '4',
});

const navLinkStyles = css({
  fontSize: 'sm',
  fontWeight: '600',
  color: 'fg.muted',
  textDecoration: 'none',
  transition: 'color 0.15s ease',
  _hover: {
    color: 'qwik.blue',
  },
});

const searchContainerStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  bg: 'bg.surfaceSubtle',
  px: '3',
  py: '1.5',
  borderRadius: 'lg',
  border: '1px solid',
  borderColor: 'border',
  width: { md: '200px', lg: '240px' },
  transition: 'all 0.2s ease',
  _focusWithin: {
    borderColor: 'qwik.blue',
    bg: 'bg.surface',
    boxShadow: '0 0 0 2px var(--colors-qwik-light-blue)',
  },
});

const searchInputStyles = css({
  bg: 'transparent',
  border: 'none',
  outline: 'none',
  fontSize: 'xs',
  color: 'fg',
  width: 'full',
  '&::placeholder': {
    color: 'fg.subtle',
  },
});

const searchKbdStyles = css({
  fontSize: '2xs',
  fontWeight: 'semibold',
  color: 'fg.subtle',
  bg: 'bg.surface',
  border: '1px solid',
  borderColor: 'border',
  borderRadius: 'sm',
  px: '1.5',
  py: '0.5',
  lineHeight: '1',
  pointerEvents: 'none',
  boxShadow: 'xs',
});

const iconButtonStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'fg.muted',
  p: '2',
  borderRadius: 'lg',
  fontSize: 'xl',
  bg: 'transparent',
  border: 'none',
  cursor: 'pointer',
  transition: 'color 0.15s ease, background-color 0.15s ease',
  _hover: {
    color: 'fg',
    bg: 'bg.surfaceSubtle',
  },
});

const spNavLinkStyles = css({
  display: 'flex',
  alignItems: 'center',
  px: '4',
  py: '3',
  borderRadius: 'xl',
  fontSize: 'base',
  fontWeight: '600',
  color: 'fg',
  textDecoration: 'none',
  transition: 'all 0.15s ease',
  _hover: {
    bg: 'bg.surfaceSubtle',
    color: 'qwik.blue',
  },
});

export const Header = component$(() => {
  const isMenuOpen = useSignal(false);

  const closeModal$ = $(() => {
    isMenuOpen.value = false;
  });

  const toggleMenu$ = $(() => {
    isMenuOpen.value = !isMenuOpen.value;
  });

  const toggleTheme$ = $(() => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });

  const handleKeyDown$ = $((event: KeyboardEvent) => {
    if (event.key === 'Escape' && isMenuOpen.value) {
      isMenuOpen.value = false;
    }
  });

  return (
    <>
      <header
        class={headerContainerStyles}
        style={{
          backgroundColor: isMenuOpen.value ? 'var(--colors-bg-surface)' : undefined,
        }}
        window:onKeyDown$={handleKeyDown$}
      >
        <div class={headerInnerStyles}>
          {/* 左側: ロゴ (Light/Dark で自動切り替え) */}
          <a
            href="/"
            aria-label="leve-ui documentation"
            onClick$={closeModal$}
            class={css({
              display: 'flex',
              alignItems: 'center',
              gap: '2',
              textDecoration: 'none',
              flexShrink: 0,
              transition: 'opacity 0.15s ease',
              _hover: { opacity: 0.8 },
            })}
          >
            {/* Light モード用ロゴ */}
            <img
              src="/logo-dark.svg"
              alt="leve-ui"
              width={108}
              height={29}
              class={css({
                h: '7',
                w: 'auto',
                display: 'block',
                _dark: { display: 'none' },
              })}
            />
            {/* Dark モード用ロゴ */}
            <img
              src="/logo-light.svg"
              alt="leve-ui"
              width={108}
              height={29}
              class={css({
                h: '7',
                w: 'auto',
                display: 'none',
                _dark: { display: 'block' },
              })}
            />
          </a>

          {/* PC: メニュー */}
          <nav
            class={css({
              display: { base: 'none', md: 'flex' },
              alignItems: 'center',
              gap: { md: '5', lg: '6' },
            })}
          >
            <a href="/" class={navLinkStyles}>
              Home
            </a>
            <a href="#overview" class={navLinkStyles}>
              Docs
            </a>
            <a href="#components" class={navLinkStyles}>
              Components
            </a>

            {/* 検索窓 */}
            <div class={searchContainerStyles}>
              <LuSearch class={css({ color: 'fg.subtle', flexShrink: 0, fontSize: 'sm' })} />
              <input
                type="search"
                placeholder="Search docs..."
                aria-label="Search documentation"
                class={searchInputStyles}
              />
              <kbd class={searchKbdStyles}>⌘K</kbd>
            </div>

            <div class={css({ w: '1px', h: '5', bg: 'border' })} />

            {/* Theme 切替ボタン (PC) */}
            <button
              type="button"
              aria-label="Toggle color theme"
              onClick$={toggleTheme$}
              class={iconButtonStyles}
            >
              <span class={css({ display: 'inline-flex', _dark: { display: 'none' } })}>
                <LuMoon />
              </span>
              <span class={css({ display: 'none', _dark: { display: 'inline-flex' } })}>
                <LuSun />
              </span>
            </button>

            {/* GitHub リンク */}
            <a
              href="https://github.com/leve-ui/leve-ui"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
              class={iconButtonStyles}
            >
              <LuGithub />
            </a>
          </nav>

          {/* SP: 右側アイコン群（Theme 切替 ＋ ハンバーガー） */}
          <div
            class={css({ display: { base: 'flex', md: 'none' }, alignItems: 'center', gap: '2' })}
          >
            <button
              type="button"
              aria-label="Toggle color theme"
              onClick$={toggleTheme$}
              class={iconButtonStyles}
            >
              <span class={css({ display: 'inline-flex', _dark: { display: 'none' } })}>
                <LuMoon />
              </span>
              <span class={css({ display: 'none', _dark: { display: 'inline-flex' } })}>
                <LuSun />
              </span>
            </button>

            <button
              type="button"
              aria-label={isMenuOpen.value ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen.value}
              aria-controls="sp-navigation-modal"
              onClick$={toggleMenu$}
              class={css({
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                w: '10',
                h: '10',
                borderRadius: 'lg',
                color: 'fg',
                bg: 'bg.surface',
                border: '1px solid',
                borderColor: 'border',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease, border-color 0.15s ease',
                _hover: { bg: 'bg.surfaceSubtle' },
              })}
            >
              <span
                class={css({
                  display: 'block',
                  position: 'relative',
                  w: '4.5',
                  h: '3.5',
                })}
              >
                {/* 上のバー */}
                <span
                  class={css({
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    w: 'full',
                    h: '2px',
                    bg: 'currentColor',
                    borderRadius: 'full',
                    transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    transformOrigin: 'center',
                  })}
                  style={{
                    transform: isMenuOpen.value ? 'translateY(6px) rotate(45deg)' : 'none',
                  }}
                />
                {/* 中央のバー */}
                <span
                  class={css({
                    position: 'absolute',
                    left: 0,
                    top: '6px',
                    w: 'full',
                    h: '2px',
                    bg: 'currentColor',
                    borderRadius: 'full',
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                  })}
                  style={{
                    opacity: isMenuOpen.value ? 0 : 1,
                    transform: isMenuOpen.value ? 'scaleX(0)' : 'scaleX(1)',
                  }}
                />
                {/* 下のバー */}
                <span
                  class={css({
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    w: 'full',
                    h: '2px',
                    bg: 'currentColor',
                    borderRadius: 'full',
                    transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    transformOrigin: 'center',
                  })}
                  style={{
                    transform: isMenuOpen.value ? 'translateY(-6px) rotate(-45deg)' : 'none',
                  }}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* SP: モーダルメニュー（Header直下に隙間なく展開） */}
      <div
        id="sp-navigation-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        class={css({
          display: { base: 'flex', md: 'none' },
          flexDirection: 'column',
          position: 'fixed',
          top: '4rem',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 45,
          bg: 'bg.surface',
          p: '5',
          overflowY: 'auto',
          transition: 'opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease',
        })}
        style={{
          opacity: isMenuOpen.value ? 1 : 0,
          transform: isMenuOpen.value ? 'translateY(0)' : 'translateY(-8px)',
          pointerEvents: isMenuOpen.value ? 'auto' : 'none',
          visibility: isMenuOpen.value ? 'visible' : 'hidden',
        }}
      >
        {/* 1. 検索窓 */}
        <div
          class={css({
            display: 'flex',
            alignItems: 'center',
            gap: '2.5',
            bg: 'bg.surfaceSubtle',
            px: '3.5',
            py: '2.5',
            borderRadius: 'xl',
            border: '1px solid',
            borderColor: 'border',
            mb: '2',
            _focusWithin: {
              borderColor: 'qwik.blue',
              bg: 'bg.surface',
              boxShadow: '0 0 0 2px var(--colors-qwik-light-blue)',
            },
          })}
        >
          <LuSearch class={css({ color: 'fg.subtle', flexShrink: 0, fontSize: 'base' })} />
          <input
            type="search"
            placeholder="Search documentation..."
            aria-label="Search documentation"
            class={searchInputStyles}
          />
          <kbd class={searchKbdStyles}>⌘K</kbd>
        </div>

        {/* 2. 縦積み: Home / Docs / Components */}
        <nav class={css({ display: 'flex', flexDirection: 'column', gap: '1.5' })}>
          <a href="/" onClick$={closeModal$} class={spNavLinkStyles}>
            Home
          </a>
          <a href="#overview" onClick$={closeModal$} class={spNavLinkStyles}>
            Docs
          </a>
          <a href="#components" onClick$={closeModal$} class={spNavLinkStyles}>
            Components
          </a>
        </nav>

        {/* 3. Separator */}
        <Separator.Root class={css({ height: '1px', bg: 'border', my: '3' })} />

        {/* 4. 横並びで Github アイコン */}
        <div
          class={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: '2',
            pt: '1',
          })}
        >
          <span class={css({ fontSize: 'sm', fontWeight: 'medium', color: 'fg.muted' })}>
            Open source repository
          </span>
          <a
            href="https://github.com/leve-ui/leve-ui"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            class={css({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2',
              px: '3.5',
              py: '2',
              borderRadius: 'lg',
              bg: 'bg.surfaceSubtle',
              color: 'fg',
              textDecoration: 'none',
              fontSize: 'sm',
              fontWeight: 'semibold',
              transition: 'background-color 0.15s ease, color 0.15s ease',
              _hover: {
                bg: 'qwik.lightBlue',
                color: 'qwik.darkBlue',
              },
            })}
          >
            <LuGithub class={css({ fontSize: 'lg' })} />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </>
  );
});
