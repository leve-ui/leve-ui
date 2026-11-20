import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { css } from 'styled-system/css';
import { docsNav } from '../../docs-nav';
import { localizeHref } from '../../i18n/locales';
import { t } from '../../i18n/translate';
import { useLocale } from '../../i18n/use-locale';
import { demoComponents } from '../demo/demo-sources';
import { LuArrowUpRight } from '../icons';

const DEMO_OVERRIDES: Record<string, string> = {
  'context-menu': 'menu/context',
};

const galleryItems = (
  docsNav
    .find((section) => section.items.some((i) => i.href === '/components/accordion/'))
    ?.items.filter((item) => item.href !== '/components/') ?? []
).map((item) => {
  const slug = item.href.replace(/^\/components\/|\/$/g, '');
  const demoId = DEMO_OVERRIDES[slug] ?? `${slug}/default`;
  return { ...item, slug, demoId };
});

/**
 * Interactive gallery of every component's default demo with links to each
 * component page.
 */
export const DemoGallery = component$(() => {
  const locale = useLocale();

  return (
    <div
      class={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' },
        gap: '6',
        my: '6',
      })}
    >
      {galleryItems.map((item) => {
        const DemoComponent = demoComponents[`${item.demoId}.tsx`];
        if (!DemoComponent) return null;

        return (
          <section
            key={item.href}
            aria-label={t(locale, item.title)}
            class={css({
              bg: 'bg-canvas',
              border: '1px solid {colors.border-default}',
              borderRadius: 'xl',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            })}
          >
            <Link
              href={localizeHref(item.href, locale)}
              class={css({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '2',
                px: '4',
                py: '3',
                borderBottom: '1px solid {colors.border-default}',
                textDecoration: 'none',
                color: 'fg-default',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'background-color 0.15s ease, color 0.15s ease',
                _hover: { bg: 'bg-subtle', color: 'accent-text' },
                _focusVisible: {
                  outline: '2px solid',
                  outlineColor: 'accent-default',
                  outlineOffset: '-2px',
                },
                '& svg': { w: '4', h: '4', color: 'fg-subtle', flexShrink: 0 },
              })}
            >
              <span>{t(locale, item.title)}</span>
              <LuArrowUpRight aria-hidden="true" />
            </Link>

            <div
              class={css({
                flex: 1,
                minH: '230px',
                p: '6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflowX: 'auto',
              })}
            >
              <DemoComponent />
            </div>
          </section>
        );
      })}
    </div>
  );
});
