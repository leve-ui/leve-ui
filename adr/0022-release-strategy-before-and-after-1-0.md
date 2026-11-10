# 0022. Release strategy before and after 1.0

- Status: Accepted
- Date: 2026-11-10
- Related: [0019](0019-release-with-changesets-and-npm-trusted-publishing.md), [0020](0020-bootstrap-new-packages-and-keep-individual-packages.md)

## Context

With the Release workflow ([0019](0019-release-with-changesets-and-npm-trusted-publishing.md)), merging a feature PR does not publish anything. Changesets accumulate in the "chore(release): version packages" PR, and packages are published only when that PR is merged. We wanted to decide whether batching releases requires long-lived branches (e.g. `v1`, `beta`), and how versions should be bumped while the library is below 1.0.

All packages start at `0.0.0`. In Changesets, a `major` changeset on a `0.x` package bumps it straight to `1.0.0`. Contributors and AI agents following the usual semver habit ("breaking change = major") could therefore release 1.0 by accident.

## Considered Options

For batching releases:

1. **Release branches now (`beta`, `v1`)** — Explicit channels, but doubles the branches to target, protect, and release from, before there is any need.
2. **`main` only, release timing decided by merging the release PR** — Batching is already built in; no extra branches.

For versioning below 1.0:

1. **Standard semver bump types** — Familiar, but `major` on `0.x` releases 1.0 unintentionally.
2. **0.x convention: breaking changes as `minor`, everything else as `patch`** — Common for pre-1.0 libraries; 1.0 happens only by explicit decision.

## Decision

- We develop on `main` only. Releases are batched by the release PR, and a maintainer decides when to release by merging it.
- Until 1.0, `major` changesets are not used:
  - breaking changes: `minor` (e.g. `0.1.0` → `0.2.0`)
  - new features: `minor` or `patch`
  - bug fixes: `patch`
- Releasing 1.0 is an explicit maintainer decision. Before it, we use Changesets prerelease mode (`changeset pre enter beta`) to publish `1.0.0-beta.x` versions under the `beta` dist-tag, then exit prerelease mode (`changeset pre exit`) to release `1.0.0`.
- After 1.0, standard semver applies (`major` for breaking changes).
- A maintenance branch (e.g. `v1`) is created only when development of the next major version (2.0) starts, so that 1.x can still receive fixes.

## Rationale

- The release PR already provides batching and an explicit release decision, so branches would only add overhead now.
- Avoiding `major` before 1.0 keeps the 1.0 release deliberate, and the `0.x` minor bump still signals breaking changes to consumers (`^0.1.0` does not accept `0.2.0`).

## Consequences

- All accumulated changesets are released together; a subset cannot be released on its own.
- Contributors, reviewers, and AI agents must check that no `major` changeset is added before 1.0. This is documented in `CONTRIBUTING.md`, `.changeset/README.md`, and `.agents/rules/git-commit.md`.
- When 1.0 is planned, prerelease mode and its effect on the Release workflow (publishing under the `beta` tag) should be tried on `main` first; if a separate `next` branch turns out to be necessary, record it in a new ADR.

## Revisit When

- We decide to release 1.0 (switch to standard semver).
- Development of 2.0 starts (create the maintenance branch).
