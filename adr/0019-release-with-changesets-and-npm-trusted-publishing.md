# 0019. Release with Changesets and npm trusted publishing

- Status: Accepted
- Date: 2026-11-10
- Related: [0003](0003-all-in-one-and-individual-packages.md), [0018](0018-run-ci-on-pull-requests-and-protect-main-with-rulesets.md)

## Context

Packages are versioned with Changesets ([0003](0003-all-in-one-and-individual-packages.md)), and `main` is protected by a ruleset that requires pull requests and passing CI ([0018](0018-run-ci-on-pull-requests-and-protect-main-with-rulesets.md)). We want releases to happen only through reviewed pull requests, without long-lived npm tokens.

Two constraints shape the design:

- Pull requests created with `GITHUB_TOKEN` do not trigger other workflows, so the release PR opened by `changesets/action` would never get the required CI checks. `workflow_dispatch` is an exception: it can be triggered with `GITHUB_TOKEN`.
- npm trusted publishing (OIDC) can only be configured for packages that already exist on npm, and requires npm CLI 11.5.1+ and Node.js 22.14+.

## Considered Options

For authentication to npm:

1. **npm access token in a repository secret** — Works from the first publish, but the token must be rotated and can leak.
2. **npm trusted publishing (OIDC)** — No stored secret and automatic provenance, but each new package needs one manual bootstrap publish.

For CI on the release PR:

1. **GitHub App token** — The standard solution, but requires creating and maintaining an app and its secrets.
2. **Personal access token** — Simple, but expires and attributes the release PR to a person.
3. **Dispatch CI from the Release workflow** — No extra secrets; uses only `GITHUB_TOKEN`.

## Decision

- `.github/workflows/release.yml` runs `changesets/action` on every push to `main`:
  - If there are pending changesets, it opens or updates a "chore(release): version packages" PR, then dispatches `ci.yml` on the `changeset-release/main` branch so the required checks run on the PR head.
  - Otherwise (the release PR was just merged), it runs `pnpm release` (build + `changeset publish`), pushes git tags, and creates GitHub releases.
- Packages are published with npm trusted publishing. `pnpm publish` delegates to the npm CLI bundled with Node.js 26 (npm 11.20), which performs the OIDC exchange. Provenance is generated automatically for this public repository.
- Each new package is bootstrapped once by a maintainer: publish a `0.0.0` placeholder from a local machine, then register `levis-ui/levis-ui` + `release.yml` as its trusted publisher on npm and disallow token-based publishing. AI agents must not perform this step.
- Changelogs use `@changesets/changelog-github`. Private packages (`apps/*`, `tooling/*`) are not versioned. Changeset summaries are written in English.

## Rationale

- Releases happen only by merging a PR that passed CI, which fits the branch protection in [0018](0018-run-ci-on-pull-requests-and-protect-main-with-rulesets.md).
- No npm or GitHub secrets need to be created, rotated, or protected.

## Consequences

- The repository setting "Allow GitHub Actions to create and approve pull requests" must be enabled.
- In the dispatched CI run, the "Commit messages" job is skipped (it only runs for `pull_request` events). The release PR's commit message and title are fixed by the workflow and already follow commitlint.
- New trusted publisher configurations on npm default to staged publishing; direct publishing must be allowed explicitly when registering the publisher.
- If the dispatch workaround stops satisfying the required checks, switch to a GitHub App token and record it in a new ADR.

## Revisit When

- npm allows configuring trusted publishers for packages that do not exist yet.
- GitHub allows workflows triggered by `GITHUB_TOKEN`-created pull requests.
