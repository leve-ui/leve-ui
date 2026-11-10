# 0006. Use Biome for linting and formatting

- Status: Accepted
- Date: 2026-11-10

## Context

The official Qwik templates use ESLint + `eslint-plugin-qwik` + Prettier. We want a single, consistent lint and format setup across the monorepo.

## Considered Options

1. **ESLint + Prettier** — Large ecosystem and access to `eslint-plugin-qwik`, but many dependencies and config files.
2. **Biome** — Linting, formatting, and import sorting in one fast tool. Biome 2.x ships Qwik-specific rules (`useQwikValidLexicalScope`, `noQwikUseVisibleTask`, etc.).

## Decision

We will use Biome and will not install ESLint or Prettier. All configuration lives in a single root `biome.json`.

## Rationale

- Fewer dependencies and config files make it easy to keep the monorepo consistent.
- Biome's Qwik rules cover the main checks of `eslint-plugin-qwik`.

## Consequences

- Qwik rules are enabled automatically because of the `@builder.io/qwik` dependency. They produce false positives in non-Qwik code (`tooling/**`, `*.config.ts`, `.storybook/**`, `apps/e2e/**`), so they are disabled there via `overrides`.
- Where consumers supply attributes in a headless component (e.g. `alt` or `width` / `height` on `<img>`), rules are suppressed with `biome-ignore` and a reason.

## Revisit When

- We need an important check that only `eslint-plugin-qwik` provides.
