# Architecture Decision Records

This directory records design decisions that affect levis-ui as a whole.

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
| [0003](0003-all-in-one-and-individual-packages.md)      | Ship an all-in-one package and individual packages                             | Accepted |
| [0004](0004-qwik-v1-and-toolchain-versions.md)          | Adopt Qwik 1.x and pin Vite 7 / TypeScript 5.9                                 | Accepted |
| [0005](0005-source-condition-for-development.md)        | Resolve `src` directly via the `@levis-ui/source` condition during development | Accepted |
| [0006](0006-biome-for-lint-and-format.md)               | Use Biome for linting and formatting                                           | Accepted |
| [0007](0007-storybook-csr-mode.md)                      | Run the Qwik optimizer in CSR mode for Storybook                               | Accepted |
| [0008](0008-e2e-against-storybook.md)                   | Run E2E tests against Storybook                                                | Accepted |
| [0009](0009-headless-parts-and-data-attributes.md)      | Enable styling through part components and data attributes                     | Accepted |
| [0010](0010-no-child-state-on-parent-attributes.md)     | Do not expose child-determined state on parent attributes                      | Accepted |
| [0011](0011-controlled-uncontrolled-props-naming.md)    | Naming convention for controlled/uncontrolled props                            | Proposed |
| [0012](0012-conventional-commits-with-commitlint.md)    | Enforce Conventional Commits with commitlint                                   | Accepted |
| [0013](0013-agents-md-as-source-of-ai-rules.md)         | Use AGENTS.md and `.agents/rules/` as the source of truth for AI rules         | Accepted |
| [0014](0014-split-ai-guidance-into-rules-and-skills.md) | Split AI guidance into rules and skills                                        | Accepted |
| [0015](0015-run-commitlint-and-biome-in-git-hooks-with-lefthook.md) | Run commitlint and Biome in git hooks with lefthook | Accepted |
| [0016](0016-license-under-mit.md) | License under MIT | Accepted |
