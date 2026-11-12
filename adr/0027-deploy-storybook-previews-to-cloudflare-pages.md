# 0027. Deploy Storybook previews to Cloudflare Pages

- Status: Proposed
- Date: 2026-11-12
- Related: [0018](0018-run-ci-on-pull-requests-and-protect-main-with-rulesets.md), [0019](0019-release-with-changesets-and-npm-trusted-publishing.md)

## Context

Reviewers want to try a pull request's components in a browser without checking out the branch. Storybook already documents every component ([storybook rules](../.agents/rules/storybook.md)), so a hosted build of Storybook per pull request is the simplest review surface.

Constraints:

- The repository is public. Workflows triggered by `pull_request` from forks do not receive repository secrets, and `pull_request_target` must not be used to build untrusted code with secrets.
- A custom domain will be attached later. Until then, the URL issued by the hosting provider is enough.
- No new long-lived infrastructure should be required beyond one hosting project and one API token.

## Considered Options

1. **Cloudflare Pages via `wrangler pages deploy`** — Direct upload from GitHub Actions. Each deployment gets a unique URL and each branch gets a stable alias (`<branch>.<project>.pages.dev`). Free, supports custom domains later. Needs an API token secret.
2. **Cloudflare Workers static assets with preview URLs** — Cloudflare's newer recommended path, but preview aliases and branch handling require more configuration (a `wrangler` config file in the repo) for a purely static site.
3. **Cloudflare Pages Git integration** — No workflow needed, but builds run on Cloudflare with its own build image (pnpm / Node version drift from `.node-version`) and would build fork PRs outside our CI.
4. **GitHub Pages** — No extra account, but only one deployment per repository; no per-PR previews.

## Decision

- We will add `.github/workflows/storybook-preview.yml`, which builds Storybook with the shared setup action and deploys `apps/storybook/storybook-static` to the Cloudflare Pages project `leve-ui-storybook` with `cloudflare/wrangler-action`.
  - On `pull_request`: deploy as a preview for the PR branch and create or update a single comment on the PR with the deployment URL and the branch alias URL.
  - On `push` to `main`: deploy as the production deployment (`main` is the production branch of the Pages project).
- The workflow uses the repository secrets `CLOUDFLARE_API_TOKEN` (scope: Account → Cloudflare Pages → Edit) and `CLOUDFLARE_ACCOUNT_ID`.
- We will skip the deployment for pull requests from forks and will not use `pull_request_target`.
- The preview workflow is not a required check; a failed preview must not block merging.

## Rationale

- Option 1 needs no config file in the repository, reuses the CI setup (same Node.js / pnpm), and gives per-branch URLs out of the box.
- Option 2 adds configuration with no benefit for a static Storybook. Option 3 builds outside our CI environment. Option 4 cannot host per-PR previews.

## Consequences

- Maintainers must create the Pages project once and register the two secrets. AI agents must not create tokens or change Cloudflare settings.
- Fork PRs get no preview; maintainers can push the branch to the repository if a preview is needed.
- Preview deployments accumulate in the Pages project. Cloudflare keeps them; clean up manually if needed.
- Attaching a custom domain later only requires Cloudflare settings, not workflow changes.

## Revisit When

- Cloudflare deprecates Pages direct upload, or Workers preview URLs become simpler to use for static sites.
- Fork contributions become common enough that previews for forks are needed.
