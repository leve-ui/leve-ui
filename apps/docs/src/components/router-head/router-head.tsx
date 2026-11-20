import { component$ } from '@builder.io/qwik';
import { useDocumentHead, useLocation } from '@builder.io/qwik-city';
import { normalizePath } from '../../docs-nav';
import { LOCALES, localizeHref, SOURCE_LOCALE } from '../../i18n/locales';

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();
  // The same page in every locale (adr/0033)
  const path = normalizePath(loc.url.pathname);
  const alternates = LOCALES.map((locale) => ({
    locale,
    href: new URL(localizeHref(path, locale), loc.url.origin).href,
  }));
  const title = head.title || 'leve-ui — Headless UI for Qwik';
  const description =
    head.meta.find((m) => m.name === 'description')?.content ??
    'Accessible, unstyled UI components for Qwik that follow the WAI-ARIA Authoring Practices. Bring your own styles.';
  const ogImage = new URL('/og-image.png', loc.url.origin).href;

  return (
    <>
      <title>{head.title}</title>

      <link rel="canonical" href={loc.url.href} />
      {alternates.map(({ locale, href }) => (
        <link key={locale} rel="alternate" hreflang={locale} href={href} />
      ))}
      <link
        rel="alternate"
        hreflang="x-default"
        href={alternates.find((a) => a.locale === SOURCE_LOCALE)?.href}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="leve-ui" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={loc.url.href} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@leve_ui" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

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
