# 0040. Serve default locale at root without URL prefix

- Status: Accepted
- Date: 2026-11-26
- Related: [0033](0033-translate-docs-through-a-segment-level-translation-memory-with-gemini.md), [0034](0034-deploy-the-docs-site-to-cloudflare-pages-as-a-static-site.md)

## Context

Previously ([ADR 0033](0033-translate-docs-through-a-segment-level-translation-memory-with-gemini.md)), every locale on the docs site used a URL prefix (`/en/...`, `/ja/...`), and the root path `/` rendered a client-side language-detection redirect page (`src/routes/index.tsx`).

Because the site is deployed as static files ([ADR 0034](0034-deploy-the-docs-site-to-cloudflare-pages-as-a-static-site.md)) and external links (README, npm packages, social profiles) point to `https://leve-ui.dev/`, serving a thin JS-redirect page at `/` hurt search indexing and diluted authority between `/` and `/en/`. Additionally, automatic browser-language redirects conflict with search engine crawling (Googlebot crawls without Japanese `Accept-Language` and prefers stable per-locale URLs wired with `hreflang`) (#243).

## Considered Options

1. **Serve the default locale (`en`) at `/` without a prefix, and keep `/<locale>/` for other locales** — Move the English source routes into a Qwik City route group `src/routes/(en)/` so they render directly at `/`, `/components/dialog/`, etc., while generated locales remain under `src/routes/<locale>/` (`/ja/...`). Legacy `/en/*` URLs redirect 301 to `/*` via Cloudflare Pages `_redirects`.
2. **Keep `/en/` and `/ja/`, and replace `/` with a 301 redirect to `/en/`** — Minimal change, preserves directory symmetry, but keeps `/en/` in every English URL and still requires a hop from `/` to `/en/`.
3. **Keep the JS redirect at `/` and point its canonical tag to `/en/`** — Preserves automatic browser language switching, but leaves a thin JS-redirect page at the root domain.

## Decision

We will serve the default locale (`en`) at the root without a URL prefix, while keeping `/<locale>/` prefixes for all other locales (`ja`, etc.).

- English source pages live in `apps/docs/src/routes/(en)/` (a Qwik City route group that does not add `(en)` to the URL).
- Generated locales continue to be written into `apps/docs/src/routes/<locale>/`.
- `localizeHref(href, locale)` returns `href` without a prefix when `locale === SOURCE_LOCALE`, and `/${locale}${href}` otherwise.
- `apps/docs/public/_redirects` redirects `/en` and `/en/*` to `/` and `/:splat` with HTTP 301.
- Language switching relies on the header language switcher and `hreflang` alternates rather than automatic client-side redirects at `/`.

## Rationale

- Serving English at `/` eliminates the thin root redirect page and consolidates all root backlinks directly onto the canonical landing page without a redirect hop, matching standard practice for documentation sites (Qwik, React, VitePress, Docusaurus).
- Using a Qwik City route group `(en)` isolates the hand-written English source from generated locale directories without polluting URLs.
- Option 2 leaves unnecessary `/en/` prefixes and a redirect hop on the primary entry URL; Option 3 still relies on client-side redirection at `/`.

## Consequences

- English URLs become shorter and cleaner (`https://leve-ui.dev/`, `https://leve-ui.dev/components/dialog/`).
- Visitors whose browser language is non-English land on the English root page when visiting `https://leve-ui.dev/` directly and use the language switcher (or arrive directly at `/ja/` from localized search results via `hreflang`).
- Tooling that maps locales to filesystem paths (`memory.ts`, `generate-search.ts`, `english-heading-ids.ts`) must resolve the default locale through `localeRouteDir()`.

## Revisit When

- The docs site needs a non-locale-specific landing page or server-side `Accept-Language` negotiation via an edge runtime.
