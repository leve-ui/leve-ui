# Architecture Decision Records

This directory records design decisions that affect leve-ui as a whole.

**ADRs must be written in English.**

## When to Write an ADR

- Public API policies (prop naming, export style, etc.)
- Package structure, build setup, and tool choices
- Design principles that span multiple components
- Decisions that intentionally deviate from common practice or the WAI-ARIA APG
- Workarounds

Component-specific specs (which APG pattern a component follows, its parts, and its keyboard interactions) are not ADRs. Write them on the docs site instead.

## How to Write One

1. Copy `template.md` to `NNNN-kebab-case-title.md` (sequential, 4-digit number).
2. Write it with status `Proposed`, and change it to `Accepted` once agreed.
3. Add it to the index below.

## Changing a Decision

- Do not rewrite the body of an Accepted ADR (typo fixes are fine).
- To reverse a decision, write a new ADR and change the old one's status to `Superseded by [NNNN](...)`.
- Mark decisions that no longer apply as `Deprecated`.

## Index

| #                                                       | Title                                                                          | Status   |
| ------------------------------------------------------- | ------------------------------------------------------------------------------ | -------- |
| [0001](0001-record-architecture-decisions.md)           | Record architecture decisions with ADRs                                        | Accepted |
| [0002](0002-monorepo-structure.md)                      | Use a pnpm workspace + Turborepo monorepo                                      | Accepted |
| [0003](0003-all-in-one-and-individual-packages.md)      | Ship an all-in-one package and individual packages                             | Superseded by [0025](0025-rename-the-all-in-one-package-to-leve-ui-core.md) |
| [0004](0004-qwik-v1-and-toolchain-versions.md)          | Adopt Qwik 1.x and pin Vite 7 / TypeScript 5.9                                 | Accepted |
| [0005](0005-source-condition-for-development.md)        | Resolve `src` directly via the `@leve-ui/source` condition during development | Accepted |
| [0006](0006-biome-for-lint-and-format.md)               | Use Biome for linting and formatting                                           | Accepted |
| [0007](0007-storybook-csr-mode.md)                      | Run the Qwik optimizer in CSR mode for Storybook                               | Accepted |
| [0008](0008-e2e-against-storybook.md)                   | Run E2E tests against Storybook                                                | Accepted |
| [0009](0009-headless-parts-and-data-attributes.md)      | Enable styling through part components and data attributes                     | Accepted |
| [0010](0010-no-child-state-on-parent-attributes.md)     | Do not expose child-determined state on parent attributes                      | Accepted |
| [0011](0011-controlled-uncontrolled-props-naming.md)    | Naming convention for controlled/uncontrolled props                            | Proposed |
| [0012](0012-conventional-commits-with-commitlint.md)    | Enforce Conventional Commits with commitlint                                   | Superseded by [0017](0017-write-commit-messages-in-english.md) |
| [0013](0013-agents-md-as-source-of-ai-rules.md)         | Use AGENTS.md and `.agents/rules/` as the source of truth for AI rules         | Accepted |
| [0014](0014-split-ai-guidance-into-rules-and-skills.md) | Split AI guidance into rules and skills                                        | Accepted |
| [0015](0015-run-commitlint-and-biome-in-git-hooks-with-lefthook.md) | Run commitlint and Biome in git hooks with lefthook | Accepted |
| [0016](0016-license-under-mit.md) | License under MIT | Accepted |
| [0017](0017-write-commit-messages-in-english.md) | Write commit messages in English | Accepted |
| [0018](0018-run-ci-on-pull-requests-and-protect-main-with-rulesets.md) | Run CI on pull requests and protect main with rulesets | Accepted |
| [0019](0019-release-with-changesets-and-npm-trusted-publishing.md) | Release with Changesets and npm trusted publishing | Accepted |
| [0020](0020-bootstrap-new-packages-and-keep-individual-packages.md) | Bootstrap new packages and keep individual packages | Accepted |
| [0021](0021-write-contributor-facing-documents-in-english.md) | Write contributor-facing documents in English | Accepted |
| [0022](0022-release-strategy-before-and-after-1-0.md) | Release strategy before and after 1.0 | Accepted |
| [0023](0023-skip-publishing-until-all-packages-are-bootstrapped.md) | Skip publishing until all packages are bootstrapped | Accepted |
| [0024](0024-wire-field-ids-and-descriptions-from-the-field-root.md) | Wire field ids and descriptions from the Field root | Accepted |
| [0025](0025-rename-the-all-in-one-package-to-leve-ui-core.md) | Rename the all-in-one package to @leve-ui/core | Accepted |
| [0026](0026-participate-in-native-forms-through-a-hiddeninput-part.md) | Participate in native forms through a HiddenInput part | Accepted |
| [0027](0027-deploy-storybook-previews-to-cloudflare-pages.md) | Deploy Storybook previews to Cloudflare Pages | Accepted |
| [0028](0028-make-drawer-a-separate-package-and-a-non-modal-dialog-by-default.md) | Make Drawer a separate package and a non-modal dialog by default | Accepted |
| [0029](0029-render-overlays-in-place-in-the-top-layer-with-native-dialog-and-popover.md) | Render overlays in place in the top layer with native dialog and popover | Accepted |
| [0030](0030-position-floating-content-with-floating-ui.md) | Position floating content with Floating UI | Accepted |
| [0031](0031-share-storybook-demos-with-the-docs-site-and-keep-demo-styles-in-css-files.md) | Share Storybook demos with the docs site and keep demo styles in CSS files | Proposed |
| [0032](0032-author-docs-in-mdx-and-generate-api-reference-from-prop-types.md) | Author docs in MDX and generate API reference from prop types | Proposed |
| [0033](0033-translate-docs-through-a-segment-level-translation-memory-with-gemini.md) | Translate docs through a segment-level translation memory with Gemini | Proposed |
