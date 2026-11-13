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
