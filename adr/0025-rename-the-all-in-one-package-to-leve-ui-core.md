# 0025. Rename the all-in-one package to @leve-ui/core

- Status: Accepted
- Date: 2026-11-11
- Related: [0003](0003-all-in-one-and-individual-packages.md) (supersedes)

## Context

[0003](0003-all-in-one-and-individual-packages.md) decided to ship an all-in-one package named `leve-ui` (`packages/leve-ui`) that only re-exports the individual `@leve-ui/<name>` packages.

When we tried to publish `leve-ui` for the first time, npm rejected it with `403 Forbidden` because the name is too similar to the existing `levelup` package (npm's typosquatting protection). `leve-ui` has never been published (`npm view leve-ui` returns 404), so renaming it affects no existing consumers.

The individual packages already live under the `@leve-ui` npm organization, so a scoped name is not subject to the similarity check and keeps every package under one owner.

The library targets only Qwik until v2 (Qwik v2 support). Support for other frameworks may come in v3 or later, but is not planned yet.

## Considered Options

1. **Keep `leve-ui` and ask npm support for an exception** — Keeps the shortest install name. Approval is not guaranteed, the timing is out of our control, and it blocks the first release.
2. **`@leve-ui/qwik`** — Names the framework explicitly. While the library supports only Qwik, the suffix is redundant, and it would collide with the name we want to reserve for a future multi-framework split (see Revisit When).
3. **`@leve-ui/kit`** — Neutral, but "kit" is ambiguous (UI kit with styles? starter kit?) and uncommon for headless libraries.
4. **`@leve-ui/all`** — Describes the content literally, but reads awkwardly in imports (`from '@leve-ui/all'`) and is rarely used by other libraries.
5. **`@leve-ui/core`** — The same shape as single-framework libraries such as Mantine (`@mantine/core`) and Kobalte (`@kobalte/core`). Familiar to consumers.

## Decision

- We will keep the structure decided in 0003: implementations live only in `@leve-ui/<name>`, and the all-in-one package only re-exports them.
- We will name the all-in-one package `@leve-ui/core` and place it in `packages/core`, following the rule that a package is named `@leve-ui/<directory name>`.
- We will not publish an unscoped `leve-ui` package.
- The project name `leve-ui` stays as it is where it does not refer to the npm package: Context IDs (`'leve-ui.<name>'`), the repository URL, `LICENSE`, the docs manifest, and `keywords`.

## Rationale

- A scoped name under our own organization avoids the npm similarity check without depending on npm support.
- `@leve-ui/core` matches a convention consumers already know from other single-framework UI libraries.
- Option 1 blocks the release on an external decision. Options 2–4 are either redundant now, reserved for the future, or unfamiliar.

## Consequences

- Consumers install the all-in-one package with `pnpm add @leve-ui/core`.
- Every new component requires updating `@leve-ui/core`'s `dependencies` and `src/index.ts` (unchanged from 0003, only the name differs).
- The commitlint scope for the all-in-one package is `core`.
- Unreleased changesets must bump `@leve-ui/core` instead of `leve-ui`.
- The new package must be bootstrapped on npm (`pnpm package:bootstrap @leve-ui/core`) before the release PR is merged ([0020](0020-npm-trusted-publishing.md)).

## Revisit When

- When we support frameworks other than Qwik (v3 or later): split the all-in-one package into `@leve-ui/qwik` and `@leve-ui/<framework>`, and split each individual package by subpath exports such as `@leve-ui/avatar/qwik`. `@leve-ui/core` would then be deprecated or repurposed for framework-agnostic logic, which needs a new ADR.
