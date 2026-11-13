# 0034. Deploy the docs site to Cloudflare Pages as a static site

- Status: Accepted
- Date: 2026-11-14
- Related: [0027](0027-deploy-storybook-previews-to-cloudflare-pages.md), [0032](0032-author-docs-in-mdx-and-generate-api-reference-from-prop-types.md)

## Context

The docs site (`apps/docs`, Qwik City) has all overview and component pages (#101, #102) and must be published (#100). Its content only changes when the repository changes: there are no user accounts, forms or data that need a server at request time. Storybook is already deployed to Cloudflare Pages with per-PR previews ([0027](0027-deploy-storybook-previews-to-cloudflare-pages.md)), with the secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in the repository. The maintainer created the Cloudflare Pages project `leve-ui-docs`.

## Considered Options

1. **Static site generation + Cloudflare Pages direct upload** — Qwik City's static adapter renders every route to HTML at build time; `wrangler pages deploy` uploads `dist/`. No server to run, same workflow shape and secrets as Storybook, per-PR previews for free. Pages that need a server cannot be added without changing the adapter.
2. **SSR on Cloudflare Pages Functions** — Qwik City's Cloudflare Pages adapter. Allows request-time logic later, but every page view runs a function (cost, cold starts) for content that never changes per request.
3. **Another host (Vercel, Netlify, GitHub Pages)** — Would add a second provider and secrets, or lose per-PR previews (GitHub Pages).

## Decision

- We will build the docs site as a static site with Qwik City's static adapter (`apps/docs/adapters/static/vite.config.ts`, run by `qwik build` as `build.server`). The origin defaults to `https://leve-ui-docs.pages.dev` and can be overridden with `DOCS_ORIGIN`.
- We will deploy `apps/docs/dist` to the Cloudflare Pages project `leve-ui-docs` with `.github/workflows/docs-deploy.yml`, which mirrors `storybook-preview.yml`: production on `push` to `main`, a preview and a PR comment for same-repository pull requests, and deletion of the branch's previews when the pull request is closed. It reuses `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`, skips forks and never uses `pull_request_target`.
- The workflow runs when `apps/docs/**`, the Storybook demos (rendered by the docs, [0031](0031-share-storybook-demos-with-the-docs-site-and-keep-demo-styles-in-css-files.md)), `packages/**` or shared tooling change. It is not a required check.
- Content-hashed build output (`/build/*`, `/assets/*`) is served with immutable cache headers via `apps/docs/public/_headers`.

## Rationale

- The content is fully known at build time, so static files are the cheapest and fastest option and need no runtime.
- Reusing the Storybook setup keeps one provider, one set of secrets and one workflow pattern to maintain.

## Consequences

- Features that need a server (request-time redirects by `Accept-Language`, server-side search) are not available; they must work at build time or in the browser. The i18n routing (#99) has to generate every locale at build time.
- `routeLoader$` / `server$` can only be used in ways that work during static generation.
- Attaching a custom domain later only needs Cloudflare settings and `DOCS_ORIGIN`.

## Revisit When

- The docs need request-time behavior (for example server-side search or locale detection).
