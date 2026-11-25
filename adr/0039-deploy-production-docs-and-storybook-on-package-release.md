# 0039. Deploy production docs and Storybook on package release

- Status: Proposed
- Date: 2026-11-25
- Related: [0019](0019-release-with-changesets-and-npm-trusted-publishing.md), [0027](0027-deploy-storybook-previews-to-cloudflare-pages.md), [0034](0034-deploy-the-docs-site-to-cloudflare-pages-as-a-static-site.md)

## Context

Previously, `.github/workflows/docs-deploy.yml` ([0034](0034-deploy-the-docs-site-to-cloudflare-pages-as-a-static-site.md)) and `.github/workflows/storybook-preview.yml` ([0027](0027-deploy-storybook-previews-to-cloudflare-pages.md)) ran on both `pull_request` and `push` to `main`. Because releases are batched via a Changesets release pull request ([0019](0019-release-with-changesets-and-npm-trusted-publishing.md)), merging component pull requests into `main` updated the production docs site and Storybook immediately — before the corresponding packages or APIs were actually published to npm.

Users visiting production docs or Storybook could therefore see unreleased packages, components, or props in installation snippets and examples. At the same time, contributors and maintainers still want per-PR Cloudflare Pages previews for every pull request before merge, plus a way to deploy docs-only or translation updates manually if needed between package releases.

## Considered Options

1. **Call `docs-deploy.yml` and `storybook-preview.yml` from `release.yml` via `workflow_call` when `published == 'true'`, plus `workflow_dispatch`** — Remove the `push: branches: [main]` trigger from both deploy workflows, keep `pull_request` previews, and add `workflow_call` and `workflow_dispatch`. Downstream jobs in `release.yml` depend on `release` with `if: needs.release.outputs.published == 'true'`.
2. **Dispatch workflows with `gh workflow run --ref main` from `release.yml`** — Keep deploy workflows loosely coupled via CLI dispatch. However, dispatching against the `main` ref can race if another PR merges immediately after the release commit, deploying a newer commit instead of the released commit SHA.
3. **Trigger deploy workflows on GitHub `release: [published]`** — React directly to GitHub Release events. Because `.github/workflows/release.yml` creates GitHub releases using `GITHUB_TOKEN`, GitHub Actions suppresses downstream `release` workflow triggers unless a custom PAT or GitHub App token is added.

## Decision

- We will remove `push` triggers on `main` from `.github/workflows/docs-deploy.yml` and `.github/workflows/storybook-preview.yml` so merging feature PRs into `main` does not update the production Cloudflare Pages deployments.
- We will keep `pull_request` preview deployments (for same-repository pull requests) unchanged in both workflows.
- We will add `workflow_call` and `workflow_dispatch` triggers to `.github/workflows/docs-deploy.yml` and `.github/workflows/storybook-preview.yml`, moving `concurrency` to the `deploy` job level so reusable workflow calls do not collide with caller concurrency groups, and setting `cancel-in-progress` only for `pull_request` previews.
- We will expose `published` (`${{ steps.changesets.outputs.published }}`) from the `release` job in `.github/workflows/release.yml` and add `deploy-docs` and `deploy-storybook` jobs (`needs: release`, `if: needs.release.outputs.published == 'true'`, `secrets: inherit`) that invoke the two deploy workflows via `workflow_call`.

## Rationale

- Invoking `docs-deploy.yml` and `storybook-preview.yml` with `workflow_call` deploys the exact commit SHA processed by `changesets/action` on `main` without ref race conditions and without extra tokens or GitHub App secrets.
- Gating on `needs.release.outputs.published == 'true'` ensures production deployments do not run on intermediate `main` pushes that only open/update the release PR, nor when `.github/scripts/release.mjs` skips publishing because a public package still needs bootstrapping ([0023](0023-skip-publishing-until-all-packages-are-bootstrapped.md)).
- Adding `workflow_dispatch` allows maintainers to deploy docs-only or translation updates on demand without waiting for a package release.

## Consequences

- Production Docs (`leve-ui-docs`) and Storybook (`leve-ui-storybook`) always reflect the latest released npm packages once the `chore(release): version packages` PR is merged and published.
- Changes to `apps/docs/**`, `apps/storybook/**`, or translations merged to `main` outside a package release are queued until the next release (or can be published manually via `workflow_dispatch` on `main`).
- Pull request previews remain available on every same-repository PR as before.

## Revisit When

- The docs site needs independent continuous deployment on `main` decoupled from npm package versions (for example, via versioned docs snapshots per release).
