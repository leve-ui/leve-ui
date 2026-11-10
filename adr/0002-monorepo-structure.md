# 0002. Use a pnpm workspace + Turborepo monorepo

- Status: Accepted
- Date: 2026-11-10

## Context

We want to develop the components (multiple npm packages) together with the docs site, Storybook, and E2E tests in a single repository. The packages have a build order (utils → components → leve-ui).

## Considered Options

1. **pnpm workspace only** — Simple, but we would have to script build ordering and caching ourselves.
2. **pnpm workspace + Turborepo** — Build ordering and caching are handled for us.
3. **Nx** — Feature-rich, but the setup and learning cost is too high for this size.

## Decision

We will build the monorepo on a pnpm workspace and use Turborepo for running tasks. Directories are split as follows:

- `packages/` — Packages published to npm (`leve-ui`, `components/*`, `utils`)
- `apps/` — Unpublished apps (`docs`, `storybook`, `e2e`), all `"private": true`
- `tooling/` — Shared configuration (`tsconfig`, `vite-config`)

## Rationale

- Published and unpublished code are separated by directory, reducing the risk of accidental publishing.
- Turborepo's `dependsOn: ["^build"]` expresses build order declaratively.
- Shared configuration as workspace packages keeps each package's config minimal.

## Consequences

- New top-level directories or workspaces require agreement before being added.
- The detailed layout is documented in `.agents/rules/project-structure.md`.
