# 0023. Skip publishing until all packages are bootstrapped

- Status: Accepted
- Date: 2026-11-10
- Related: [0019](0019-release-with-changesets-and-npm-trusted-publishing.md), [0020](0020-bootstrap-new-packages-and-keep-individual-packages.md)

## Context

The Release workflow runs on every push to `main`. When there are no pending changesets, `changesets/action` runs the publish script, which tries to publish every package version that is not on npm yet. Until a package is bootstrapped ([0020](0020-bootstrap-new-packages-and-keep-individual-packages.md)), trusted publishing cannot authenticate, so the workflow fails with `ENEEDAUTH`.

The maintainers plan to bootstrap all initial packages at once, after enough components exist. Until then, every merge into `main` would mark the Release workflow as failed, which hides real failures.

## Considered Options

1. **Accept the failures** — No changes, but red runs on every merge train people to ignore them.
2. **Disable the Release workflow until bootstrapping** — Quiet, but easy to forget to re-enable, and release PRs would not be created in the meantime.
3. **Skip publishing while any public package is missing on npm** — The workflow succeeds, keeps creating release PRs, and reports why nothing was published.

## Decision

The Release workflow's publish script is `.github/scripts/release.mjs`. It checks whether every public package exists on npm:

- If any package is missing, it skips publishing, exits successfully, and reports the missing packages as a workflow warning and in the job summary.
- Otherwise, it runs `pnpm release` (build + `changeset publish`).

The "Publish readiness" check on the release PR stays in place, so a release PR still cannot be merged while packages are missing.

## Rationale

- The Release workflow only fails for real problems.
- Release PRs keep being created and updated, so changesets accumulate as usual until the first release.

## Consequences

- If a package is missing, nothing is published at all, including versions of packages that do exist. This cannot happen for a merged release PR, because "Publish readiness" requires every package to exist.
- After the initial bootstrap, the guard only matters when a new component has been merged but not yet bootstrapped.
