import { $, component$, useComputed$, useOnDocument, useSignal } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { Dialog } from '@leve-ui/core';
import { css } from 'styled-system/css';
import { docsNav } from '../../docs-nav';
import { localizeHref } from '../../i18n/locales';
import { t } from '../../i18n/translate';
import { useLocale } from '../../i18n/use-locale';
import { LuArrowRight, LuSearch, LuX } from '../icons';

type SearchSection = {
  id: string;
  title: string;
  text: string;
};

type SearchPage = {
  href: string;
  title: string;
  section: string;
  description: string;
  text: string;
  sections: SearchSection[];
};

type SearchHit = {
  href: string;
  title: string;
  breadcrumb: string;
  snippet: string;
  score: number;
};

const defaultEntries: SearchHit[] = docsNav.flatMap((section) =>
  section.items
    .filter((item) => item.href !== '/components/')
    .slice(0, 6)
    .map((item) => ({
      href: item.href,
      title: item.title,
      breadcrumb: section.title,
      snippet: '',
      score: 0,
    })),
);

function buildSnippet(text: string, query: string): string {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(query);
  if (idx === -1) return text.slice(0, 100);
  const start = Math.max(0, idx - 36);
  const end = Math.min(text.length, idx + query.length + 64);
  return `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`;
}

export const DocsSearch = component$(() => {
  const locale = useLocale();
  const nav = useNavigate();
  const open = useSignal(false);
  const query = useSignal('');
  const activeIndex = useSignal(0);
  const pages = useSignal<SearchPage[] | null>(null);
  const loadedLocale = useSignal<string | null>(null);

  const loadIndex$ = $(async () => {
    if (pages.value !== null && loadedLocale.value === locale) return;
    try {
      const res = await fetch(`/search-index-${locale}.json`);
      if (res.ok) {
        pages.value = (await res.json()) as SearchPage[];
        loadedLocale.value = locale;
      }
    } catch {
      // Keep fallback nav search if fetch fails
    }
  });

  const openSearch$ = $(() => {
    open.value = true;
    void loadIndex$();
  });

  useOnDocument(
    'keydown',
    $((event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (open.value) {
          open.value = false;
        } else {
          void openSearch$();
        }
      }
    }),
  );

  const results = useComputed$((): SearchHit[] => {
    const q = query.value.trim().toLowerCase();
    if (!q) {
      return defaultEntries.map((item) => ({
        ...item,
        title: t(locale, item.title),
        breadcrumb: t(locale, item.breadcrumb),
      }));
    }

    const source = pages.value;
    if (!source) {
      return docsNav
        .flatMap((section) =>
          section.items
            .filter((item) => item.href !== '/components/')
            .map((item) => ({
              href: item.href,
              title: t(locale, item.title),
              breadcrumb: t(locale, section.title),
              snippet: '',
              score: 1,
            })),
        )
        .filter((item) => item.title.toLowerCase().includes(q))
        .slice(0, 15);
    }

    const hits: SearchHit[] = [];

    for (const page of source) {
      const titleLower = page.title.toLowerCase();
      const descLower = page.description.toLowerCase();
      const introLower = page.text.toLowerCase();
      const sectionLabel = t(locale, page.section);

      if (titleLower.includes(q)) {
        hits.push({
          href: page.href,
          title: page.title,
          breadcrumb: sectionLabel,
          snippet: page.description,
          score: titleLower.startsWith(q) ? 100 : 80,
        });
      } else if (descLower.includes(q) || introLower.includes(q)) {
        hits.push({
          href: page.href,
          title: page.title,
          breadcrumb: sectionLabel,
          snippet: descLower.includes(q)
            ? buildSnippet(page.description, q)
            : buildSnippet(page.text, q),
          score: 40,
        });
      }

      for (const sec of page.sections) {
        const secTitleLower = sec.title.toLowerCase();
        const secTextLower = sec.text.toLowerCase();
        if (secTitleLower.includes(q)) {
          hits.push({
            href: `${page.href}#${sec.id}`,
            title: sec.title,
            breadcrumb: `${sectionLabel} › ${page.title}`,
            snippet: buildSnippet(sec.text, q),
            score: 60,
          });
        } else if (secTextLower.includes(q)) {
          hits.push({
            href: `${page.href}#${sec.id}`,
            title: sec.title,
            breadcrumb: `${sectionLabel} › ${page.title}`,
            snippet: buildSnippet(sec.text, q),
            score: 20,
          });
        }
      }
    }

    return hits.sort((a, b) => b.score - a.score).slice(0, 16);
  });

  const navigateTo$ = $((href: string) => {
    open.value = false;
    query.value = '';
    activeIndex.value = 0;
    nav(localizeHref(href, locale));
  });

  return (
    <Dialog.Root
      bind:open={open}
      onOpenChange$={(isOpen) => {
        if (isOpen) {
          void loadIndex$();
        } else {
          query.value = '';
          activeIndex.value = 0;
        }
      }}
    >
      {/* Desktop trigger (matches design Search bar) */}
      <Dialog.Trigger
        aria-label={t(locale, 'Search docs')}
        class={css({
          display: { base: 'none', lg: 'flex' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2',
          w: '240px',
          h: '9',
          px: '3',
          bg: 'bg-subtle',
          border: '1px solid {colors.border-default}',
          borderRadius: 'lg',
          color: 'fg-subtle',
          fontFamily: 'inherit',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'border-color 0.15s ease',
          _hover: { borderColor: 'accent-default' },
          _focusVisible: {
            outline: '2px solid',
            outlineColor: 'accent-default',
            outlineOffset: '2px',
          },
        })}
      >
        <span class={css({ display: 'inline-flex', alignItems: 'center', gap: '2' })}>
          <LuSearch aria-hidden="true" class={css({ w: '4', h: '4' })} />
          <span>{t(locale, 'Search docs')}</span>
        </span>
        <kbd
          class={css({
            fontFamily: 'mono',
            fontSize: '11px',
            color: 'fg-subtle',
            bg: 'bg-canvas',
            border: '1px solid {colors.border-default}',
            borderRadius: 'sm',
            px: '1.5',
            py: '0.5',
          })}
        >
          ⌘K
        </kbd>
      </Dialog.Trigger>

      {/* Mobile / tablet icon trigger */}
      <Dialog.Trigger
        aria-label={t(locale, 'Search docs')}
        class={css({
          display: { base: 'inline-flex', lg: 'none' },
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
          _focusVisible: {
            outline: '2px solid',
            outlineColor: 'accent-default',
            outlineOffset: '2px',
          },
          '& svg': { w: { base: '5', md: '18px' }, h: { base: '5', md: '18px' } },
        })}
      >
        <LuSearch aria-hidden="true" />
      </Dialog.Trigger>

      <Dialog.Content
        class={css({
          m: '0 auto',
          mt: { base: '12', md: '20' },
          p: 0,
          w: 'calc(100vw - 32px)',
          maxW: '560px',
          bg: 'bg-canvas',
          color: 'fg-default',
          border: '1px solid {colors.border-default}',
          borderRadius: 'xl',
          boxShadow: '0 24px 48px -12px rgb(15 23 42 / 0.25)',
          overflow: 'hidden',
          _backdrop: { bg: 'rgb(15 23 42 / 0.45)', backdropFilter: 'blur(2px)' },
        })}
      >
        <Dialog.Title class={css({ srOnly: true })}>{t(locale, 'Search docs')}</Dialog.Title>

        <div
          class={css({
            display: 'flex',
            alignItems: 'center',
            gap: '3',
            px: '4',
            py: '3',
            borderBottom: '1px solid {colors.border-default}',
          })}
        >
          <LuSearch
            aria-hidden="true"
            class={css({ w: '4', h: '4', color: 'fg-subtle', flexShrink: 0 })}
          />
          <input
            type="search"
            value={query.value}
            placeholder={t(locale, 'Search docs')}
            aria-label={t(locale, 'Search docs')}
            onInput$={(_, el) => {
              query.value = el.value;
              activeIndex.value = 0;
            }}
            onKeyDown$={(event) => {
              const list = results.value;
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                if (list.length > 0) {
                  activeIndex.value = (activeIndex.value + 1) % list.length;
                }
              } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                if (list.length > 0) {
                  activeIndex.value = (activeIndex.value - 1 + list.length) % list.length;
                }
              } else if (event.key === 'Enter') {
                const hit = list[activeIndex.value];
                if (hit) {
                  event.preventDefault();
                  void navigateTo$(hit.href);
                }
              }
            }}
            class={css({
              flex: 1,
              minW: 0,
              bg: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              fontSize: '15px',
              color: 'fg-default',
              _placeholder: { color: 'fg-subtle' },
            })}
          />
          <Dialog.Close
            aria-label={t(locale, 'Close search')}
            class={css({
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              w: '7',
              h: '7',
              borderRadius: 'md',
              bg: 'transparent',
              border: 'none',
              color: 'fg-subtle',
              cursor: 'pointer',
              _hover: { color: 'fg-default', bg: 'bg-muted' },
              _focusVisible: {
                outline: '2px solid',
                outlineColor: 'accent-default',
                outlineOffset: '2px',
              },
              '& svg': { w: '4', h: '4' },
            })}
          >
            <LuX aria-hidden="true" />
          </Dialog.Close>
        </div>

        <div class={css({ maxH: '380px', overflowY: 'auto', p: '2' })}>
          {results.value.length === 0 ? (
            <p
              class={css({
                py: '8',
                textAlign: 'center',
                fontSize: '14px',
                color: 'fg-subtle',
              })}
            >
              {t(locale, 'No results found')}
            </p>
          ) : (
            <div
              role="listbox"
              aria-label={t(locale, 'Search results')}
              class={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '1',
              })}
            >
              {results.value.map((hit, idx) => {
                const isActive = idx === activeIndex.value;
                return (
                  <button
                    key={hit.href}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onMouseEnter$={() => {
                      activeIndex.value = idx;
                    }}
                    onClick$={() => {
                      void navigateTo$(hit.href);
                    }}
                    class={css({
                      w: 'full',
                      textAlign: 'start',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '3',
                      px: '3',
                      py: '2.5',
                      borderRadius: 'lg',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      bg: isActive ? 'accent-subtle' : 'transparent',
                      color: isActive ? 'accent-text' : 'fg-default',
                      transition: 'background-color 0.1s ease',
                      _focusVisible: {
                        outline: '2px solid',
                        outlineColor: 'accent-default',
                        outlineOffset: '-2px',
                      },
                    })}
                  >
                    <div class={css({ minW: 0, flex: 1 })}>
                      <div
                        class={css({
                          fontSize: '12px',
                          color: isActive ? 'accent-text' : 'fg-subtle',
                          mb: '0.5',
                        })}
                      >
                        {hit.breadcrumb}
                      </div>
                      <div class={css({ fontSize: '14px', fontWeight: '600' })}>{hit.title}</div>
                      {hit.snippet && (
                        <div
                          class={css({
                            fontSize: '12px',
                            color: 'fg-muted',
                            mt: '0.5',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          })}
                        >
                          {hit.snippet}
                        </div>
                      )}
                    </div>
                    <LuArrowRight
                      aria-hidden="true"
                      class={css({
                        w: '4',
                        h: '4',
                        flexShrink: 0,
                        opacity: isActive ? 1 : 0.4,
                      })}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
});
