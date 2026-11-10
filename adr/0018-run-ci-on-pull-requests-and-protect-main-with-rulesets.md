# 0018. Run CI on pull requests and protect main with rulesets

- Status: Accepted
- Date: 2026-11-10
- Related: [0015](0015-run-commitlint-and-biome-in-git-hooks-with-lefthook.md), [0017](0017-write-commit-messages-in-english.md)

## Context

[0015](0015-run-commitlint-and-biome-in-git-hooks-with-lefthook.md) runs commitlint and Biome locally but deliberately leaves type checks and tests to CI. Local hooks can also be skipped or missing (e.g. when dependencies are not installed). The repository is public on GitHub under the free organization plan, where rulesets are available for public repositories.

## Considered Options

1. **CI without branch protection** — Failures are visible but do not block merging.
2. **Classic branch protection rules** — Works, but GitHub recommends rulesets, which are easier to manage as JSON and can target the default branch by alias.
3. **CI + a ruleset on the default branch** — Changes reach `main` only through pull requests that pass CI.

## Decision

- A GitHub Actions workflow (`.github/workflows/ci.yml`) runs on pull requests and on pushes to `main`, with these jobs: Commit messages (PR commits and PR title), Lint (`biome ci`), Typecheck, Unit test, Build, and E2E. Shared setup lives in `.github/actions/setup`, and the Node.js version comes from `.node-version`.
- A ruleset named "Protect main" on the default branch:
  - requires a pull request (0 approvals, so a single maintainer can merge; review threads must be resolved),
  - requires all CI jobs above to pass on a branch that is up to date with `main`,
  - allows only squash merges and requires linear history,
  - blocks force pushes and branch deletion,
  - has no bypass actors.
- Because only squash merges are allowed, the PR title becomes the commit message on `main`, so CI validates the PR title with commitlint.

## Rationale

- Every change on `main` has passed the full test suite, including E2E.
- Squash merges keep `main` linear and make each commit correspond to one reviewed change.

## Consequences

- Nobody, including admins and AI agents, can push directly to `main`; all work goes through branches and pull requests.
- Renaming a CI job requires updating the required status checks in the ruleset.
- The approval count can be raised once there are multiple maintainers.
