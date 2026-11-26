import { component$ } from '@builder.io/qwik';
import { useDocumentHead, useLocation } from '@builder.io/qwik-city';
import { normalizePath } from '../../docs-nav';
import { getLocale, LOCALES, localizeHref, OG_LOCALES, SOURCE_LOCALE } from '../../i18n/locales';

const DEFAULT_TITLE = 'leve-ui — Headless UI for Qwik';
const DEFAULT_DESCRIPTION =
  'Accessible, unstyled UI components for Qwik that follow the WAI-ARIA Authoring Practices. Bring your own styles.';

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();
  const locale = getLocale(loc.url.pathname);
  // The same page in every locale (adr/0033, adr/0040)
  const path = normalizePath(loc.url.pathname);
  const canonicalHref = new URL(localizeHref(path, locale), loc.url.origin).href;
  const alternates = LOCALES.map((l) => ({
    locale: l,
    href: new URL(localizeHref(path, l), loc.url.origin).href,
  }));
  const title = !head.title
    ? DEFAULT_TITLE
    : head.title.toLowerCase().includes('leve-ui')
      ? head.title
      : `${head.title} — leve-ui`;
  const hasDescriptionMeta = head.meta.some((m) => m.name === 'description');
  const description =
    head.meta.find((m) => m.name === 'description')?.content ?? DEFAULT_DESCRIPTION;
  const ogImage = new URL('/og-image.png', loc.url.origin).href;
  const homeUrl = new URL('/', loc.url.origin).href;

  const jsonLd =
    path === '/'
      ? {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              name: 'leve-ui',
              alternateName: ['Leve UI', 'leve ui'],
              url: homeUrl,
              inLanguage: locale,
              description,
            },
            {
              '@type': 'SoftwareApplication',
              name: 'leve-ui',
              alternateName: ['Leve UI', 'leve ui'],
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Cross-platform',
              url: homeUrl,
              description,
              license: 'https://opensource.org/licenses/MIT',
              isAccessibleForFree: true,
              sameAs: [
                'https://github.com/leve-ui/leve-ui',
                'https://www.npmjs.com/package/@leve-ui/core',
                'https://x.com/leve_ui',
              ],
            },
          ],
        }
      : null;

  return (
    <>
      <title>{title}</title>

      <link rel="canonical" href={canonicalHref} />
      {alternates.map(({ locale: l, href }) => (
        <link key={l} rel="alternate" hreflang={l} href={href} />
      ))}
      <link
        rel="alternate"
        hreflang="x-default"
        href={alternates.find((a) => a.locale === SOURCE_LOCALE)?.href}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

      {!hasDescriptionMeta && <meta name="description" content={description} />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="leve-ui" />
      <meta property="og:locale" content={OG_LOCALES[locale]} />
      {LOCALES.filter((l) => l !== locale).map((l) => (
        <meta key={l} property="og:locale:alternate" content={OG_LOCALES[l]} />
      ))}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalHref} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@leve_ui" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={JSON.stringify(jsonLd)} />
      )}

      {head.meta.map(({ httpEquiv, ...m }) => (
        // DocumentMeta names it httpEquiv, but the attribute is http-equiv
        <meta key={m.key} {...m} http-equiv={httpEquiv} />
      ))}

      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}

      {head.styles.map((s) => (
        <style
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML ? {} : { dangerouslySetInnerHTML: s.style })}
        />
      ))}

      {head.scripts.map((s) => (
        <script
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML ? {} : { dangerouslySetInnerHTML: s.script })}
        />
      ))}
    </>
  );
});
