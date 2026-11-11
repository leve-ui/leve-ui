# 0003. Ship an all-in-one package and individual packages

- Status: Superseded by [0025](0025-rename-the-all-in-one-package-to-leve-ui-core.md)
- Date: 2026-11-10
- Related: [0002](0002-monorepo-structure.md)

## Context

Some consumers want to install everything at once; others want only the components they use.

## Considered Options

1. **A single package only** — Easy to maintain. Consumers cannot install components selectively (though tree-shaking helps).
2. **Individual packages only** — Selective installs, but consumers who use everything end up with many dependencies.
3. **Both, with the all-in-one package re-exporting the individual packages** — Satisfies both needs.

## Decision

- Implementations live only in `@leve-ui/<name>` (`packages/components/<name>`).
- `leve-ui` (`packages/leve-ui`) only re-exports them via `export * from '@leve-ui/<name>'`.
- Logic shared between components lives in `@leve-ui/utils`. Component packages must not depend on each other directly.

## Rationale

- Each implementation exists in exactly one place, so there is no duplication.
- Centralizing shared logic in utils prevents circular dependencies between components.

## Consequences

- Every new component requires updating `leve-ui`'s `dependencies` and `src/index.ts`.
- Versions of `leve-ui` and each `@leve-ui/*` package are managed with Changesets.
