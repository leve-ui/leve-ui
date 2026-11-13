import { component$, Slot } from '@builder.io/qwik';
import { Link, useContent, useDocumentHead, useLocation } from '@builder.io/qwik-city';
import { Breadcrumb } from '@leve-ui/breadcrumb';
import { css, cx } from 'styled-system/css';
import { PROSE_CLASS } from '../../../theme/prose';
import { MobileNav, Sidebar } from '../../components/docs/sidebar';
import { TableOfContents } from '../../components/docs/table-of-contents';
import { LuChevronLeft, LuChevronRight } from '../../components/icons';
import { findNavItem, getPrevNext } from '../../docs-nav';

const breadcrumbStyles = css({
  mb: '6',
  '& ol': {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '1.5',
    listStyle: 'none',
    p: 0,
    m: 0,
    fontSize: 'sm',
  },
  '& a': {
    color: 'fg.subtle',
    textDecoration: 'none',
    _hover: { color: 'fg.default' },
    _focusVisible: { outline: '2px solid', outlineColor: 'accent.default', outlineOffset: '2px' },
  },
  '& a[data-current]': { color: 'fg.default', fontWeight: '500' },
  '& [data-leve-breadcrumb-separator]': {
    display: 'inline-flex',
    color: 'fg.subtle',
    '& svg': { w: '3.5', h: '3.5' },
  },
});

const pagerLinkStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1',
  flex: '1',
  maxW: '50%',
  p: '4',
  border: '1px solid',
  borderColor: 'border.default',
  borderRadius: 'xl',
  textDecoration: 'none',
  transition: 'border-color 0.15s ease',
  _hover: { borderColor: 'accent.default' },
  _focusVisible: { outline: '2px solid', outlineColor: 'accent.default', outlineOffset: '2px' },
  '& span:first-child': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '1',
    fontSize: 'xs',
    color: 'fg.subtle',
  },
  '& span:last-child': { fontWeight: '600', color: 'fg.default' },
  '& svg': { w: '3.5', h: '3.5' },
});

export default component$(() => {
  const loc = useLocation();
  const head = useDocumentHead();
  const { headings } = useContent();
  const current = findNavItem(loc.url.pathname);
  const { prev, next } = getPrevNext(loc.url.pathname);
  const title = current?.item.title ?? head.title;

  return (
    <div
      class={css({
        maxW: '1400px',
        mx: 'auto',
        px: { base: '4', sm: '6', lg: '8' },
        display: 'flex',
        alignItems: 'flex-start',
        gap: { base: '0', lg: '10' },
      })}
    >
      <Sidebar />

      <div class={css({ flex: '1', minW: 0, py: { base: '6', lg: '10' } })}>
        <MobileNav />

        <article class={css({ maxW: '768px', mx: 'auto' })}>
          <Breadcrumb.Root aria-label="Breadcrumb" class={breadcrumbStyles}>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/overview/introduction/">Docs</Breadcrumb.Link>
              </Breadcrumb.Item>
              {current && (
                <>
                  <Breadcrumb.Separator>
                    <LuChevronRight aria-hidden="true" />
                  </Breadcrumb.Separator>
                  <Breadcrumb.Item>
                    <Breadcrumb.Link href={current.section.items[0].href}>
                      {current.section.title}
                    </Breadcrumb.Link>
                  </Breadcrumb.Item>
                </>
              )}
              <Breadcrumb.Separator>
                <LuChevronRight aria-hidden="true" />
              </Breadcrumb.Separator>
              <Breadcrumb.Item>
                <Breadcrumb.Link href={loc.url.pathname} current>
                  {title}
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>

          <div class={PROSE_CLASS}>
            <Slot />
          </div>

          {(prev || next) && (
            <nav
              aria-label="Previous and next pages"
              class={css({
                display: 'flex',
                justifyContent: 'space-between',
                gap: '4',
                mt: '16',
                pt: '8',
                borderTop: '1px solid {colors.border.default}',
              })}
            >
              {prev ? (
                <Link href={prev.href} class={pagerLinkStyles}>
                  <span>
                    <LuChevronLeft aria-hidden="true" />
                    Previous
                  </span>
                  <span>{prev.title}</span>
                </Link>
              ) : null}
              {next && (
                <Link
                  href={next.href}
                  class={cx(pagerLinkStyles, css({ ml: 'auto', textAlign: 'right' }))}
                >
                  <span class={css({ justifyContent: 'flex-end' })}>
                    Next
                    <LuChevronRight aria-hidden="true" />
                  </span>
                  <span>{next.title}</span>
                </Link>
              )}
            </nav>
          )}
        </article>
      </div>

      <TableOfContents headings={headings ?? []} />
    </div>
  );
});
