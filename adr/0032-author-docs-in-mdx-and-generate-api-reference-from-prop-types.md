# 0032. Author docs in MDX and generate API reference from prop types

- Status: Accepted
- Date: 2026-11-13
- Related: [0009](0009-headless-parts-and-data-attributes.md), [0011](0011-controlled-uncontrolled-props-naming.md), [0021](0021-write-contributor-facing-documents-in-english.md), [0031](0031-share-storybook-demos-with-the-docs-site-and-keep-demo-styles-in-css-files.md)

## Context

The docs site (`apps/docs`, Qwik City) has only a landing page. #83 adds guides and one page per component. Two things need to be decided before writing them:

- **Authoring format.** Pages are mostly prose with tables, code and live demos. Many pages share the same structure.
- **API reference.** Every part of every component needs a table of its props (defaults, types, `bind:*`, events), its data attributes and its CSS variables. There are 17 components with several parts each, and the tables must stay in sync with the code.

### Site structure

```
overview/     introduction, getting-started, styling, forms,
              controlled-uncontrolled, accessibility, roadmap, faq
components/   index, <name> (one page per component)
```

There is no utilities section: `@leve-ui/utils` is internal and is not documented as a public API. There is no changelog page; release notes stay on GitHub Releases.

### Component page template

1. Title, one-line description and a link to the APG pattern
2. Live demo (code and CSS tabs, [0031](0031-share-storybook-demos-with-the-docs-site-and-keep-demo-styles-in-css-files.md))
3. Installation: both `@leve-ui/core` and `@leve-ui/<name>`
4. Anatomy (code first; diagrams later)
5. Examples: one per demo
6. API reference per part: rendered element, props (including `bind:*` and `on*Change$`), data attributes, CSS variables
7. Accessibility: APG compliance and the keyboard interactions table

## Considered Options

1. **MDX routes in Qwik City + generated props tables** — Qwik City supports `.mdx` routes natively. Prose is plain Markdown, and Qwik components (demos, tables) can be used inline. Props tables are generated from the `<Name><Part>Props` types and their JSDoc.
2. **TSX pages** — Full control, but prose in JSX is hard to write and review, and translating it ([0033](0033-translate-docs-through-a-segment-level-translation-memory-with-gemini.md)) would need a separate extraction mechanism.
3. **Hand-written props tables** — Simple, but 17 components × several parts will drift from the types.

## Decision

- We will write docs pages as MDX routes in `apps/docs`, in English as the source language.
- We will generate props tables at build time from the exported `<Name><Part>Props` types with the TypeScript compiler API (ts-morph or equivalent):
  - Only the props declared by leve-ui are listed. Props inherited from `PropsOf<'element'>` are summarized as "All `<element>` attributes" instead of being listed.
  - Descriptions come from the JSDoc of each prop, and defaults from the `@default` tag.
  - The output is a JSON file per component that an MDX component (`<PropsTable part="Root" />`) renders.
- Data attributes, CSS variables and keyboard interactions are not expressed in types. We will write them by hand in each component's MDX page.
- We will build the docs site's own UI (tabs, sidebar, theme toggle, notices, ...) with leve-ui components through their public packages whenever one fits, so that the docs site is the first real user of the library. Missing components and API problems found this way are reported as issues instead of being worked around silently ([docs site rules](../.agents/rules/docs-site.md)).
- Every new component added with the `create-component` skill includes an MDX page. The skill and its scaffold are updated accordingly.

## Rationale

- MDX keeps prose readable in reviews and lets pages embed the shared demos directly.
- Generating from types makes the props tables follow the code automatically; writing JSDoc on props also improves editor hints for users.
- Data attributes and keyboard interactions are behavior, not types, so they cannot be generated reliably.

## Consequences

- Public props must have JSDoc descriptions and `@default` tags where there is a default. Missing JSDoc shows as an empty description and should be treated as a docs bug.
- The docs build runs the generator before Vite. Type errors in a component break the docs build.
- MDX pages must not hard-code what the generator produces.

## Revisit When

- Qwik City's MDX support changes in a way that breaks Qwik components in MDX (for example in the Qwik v2 migration).
