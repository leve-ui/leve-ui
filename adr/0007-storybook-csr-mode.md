# 0007. Run the Qwik optimizer in CSR mode for Storybook

- Status: Accepted
- Date: 2026-11-10

## Context

`storybook-framework-qwik` expects `qwikVite()` in the project's Vite config; without it, `$()` is not transformed and stories fail to render. However, the default `qwikVite()` validates that `src/root` exists as the client build input, which makes the Storybook build fail.

## Considered Options

1. **Add a dummy `src/root.tsx` for Storybook** — Adds meaningless files.
2. **Use `qwikVite({ csr: true, srcDir: 'stories' })`** — Skips the input validation. Storybook renders on the client anyway, so behavior is unaffected.

## Decision

We will use `qwikVite({ csr: true, srcDir: 'stories' })` in `apps/storybook/vite.config.ts`.

## Rationale

It avoids dummy files and matches how Storybook renders (client-side).

## Consequences

- The SSR → resume flow cannot be verified in Storybook. Verify SSR-related behavior on the docs site or in unit tests (`createDOM`).
- This is a workaround and may become unnecessary depending on `storybook-framework-qwik`.

## Revisit When

- `storybook-framework-qwik` configures the Qwik optimizer internally.
