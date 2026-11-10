# 0005. Resolve `src` directly via the `@levis-ui/source` condition during development

- Status: Accepted
- Date: 2026-11-10
- Related: [0003](0003-all-in-one-and-individual-packages.md)

## Context

When the docs site or Storybook imports a workspace library, the `lib/` build output from `exports` is normally used. Every library change then requires a rebuild, and HMR does not work.

## Considered Options

1. **Use build output with parallel watch builds** — Standard, but adds processes and slows feedback.
2. **Point each package to `src` with Vite's `resolve.alias`** — Requires a new alias for every new package.
3. **Add a custom condition to `exports` and enable it in the apps** — Configured in one place, and works automatically for new packages.

## Decision

- Each library puts `"@levis-ui/source": "./src/index.ts"` first in its `exports`.
- The docs and Storybook Vite configs enable this condition via `sourceResolveConfig()` from `@levis-ui/vite-config`.
- The app tsconfig (`@levis-ui/tsconfig/app.json`) includes this condition in `customConditions`.
- Library builds (`tsc -p tsconfig.build.json`, `vite build`) do not use this condition.

## Rationale

- Library changes are reflected in the docs site and Storybook immediately, without a build.
- npm consumers never enable this condition, so they get `lib/` as usual.

## Consequences

- Published packages contain a condition pointing to `src/index.ts`, which is not in `files`. It is unused in consumers' environments, so it is harmless.
- The condition must come before `types` in `exports`, because TypeScript uses the first matching condition.
- Every new library package must include this condition.
