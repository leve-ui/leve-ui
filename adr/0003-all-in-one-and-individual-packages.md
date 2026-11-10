# 0003. Ship an all-in-one package and individual packages

- Status: Accepted
- Date: 2026-11-10
- Related: [0002](0002-monorepo-structure.md)

## Context

Some consumers want to install everything at once; others want only the components they use.

## Considered Options

1. **A single package only** — Easy to maintain. Consumers cannot install components selectively (though tree-shaking helps).
2. **Individual packages only** — Selective installs, but consumers who use everything end up with many dependencies.
3. **Both, with the all-in-one package re-exporting the individual packages** — Satisfies both needs.

## Decision

- Implementations live only in `@levis-ui/<name>` (`packages/components/<name>`).
- `levis-ui` (`packages/levis-ui`) only re-exports them via `export * from '@levis-ui/<name>'`.
- Logic shared between components lives in `@levis-ui/utils`. Component packages must not depend on each other directly.

## Rationale

- Each implementation exists in exactly one place, so there is no duplication.
- Centralizing shared logic in utils prevents circular dependencies between components.

## Consequences

- Every new component requires updating `levis-ui`'s `dependencies` and `src/index.ts`.
- Versions of `levis-ui` and each `@levis-ui/*` package are managed with Changesets.
