# 0020. Bootstrap new packages and keep individual packages

- Status: Accepted
- Date: 2026-11-10
- Related: [0003](0003-all-in-one-and-individual-packages.md), [0019](0019-release-with-changesets-and-npm-trusted-publishing.md)

## Context

With npm trusted publishing ([0019](0019-release-with-changesets-and-npm-trusted-publishing.md)), a trusted publisher can only be configured for a package that already exists on npm (`npm trust` documents this explicitly), and configuring it requires the maintainer's 2FA. Because every component is its own package ([0003](0003-all-in-one-and-individual-packages.md)), every new component needs a manual bootstrap. The first merge of the Release workflow failed for exactly this reason (`ENEEDAUTH`, nothing was published).

This raised the question of whether to merge everything into a single `levis-ui` package with subpath exports (`levis-ui/avatar`), which would need only one bootstrap.

## Considered Options

1. **Single package with subpath exports** — One bootstrap, simpler versioning. But installing it makes every component importable.
2. **Individual packages, bootstrap by hand** — Keeps the install surface minimal, but the manual steps (publish, configure on npmjs.com) are easy to get wrong or forget.
3. **Individual packages, bootstrap with a script and guard the release** — Same install surface, with the manual work reduced to one command and a CI check that prevents a broken release.
4. **Use an npm token for first publishes** — Fully automatic, but reintroduces a long-lived secret, defeating the purpose of trusted publishing.

## Decision

- We keep one package per component. Consumers must be able to install only the components they use, so that a project combining levis-ui with another library (e.g. `@qwik-ui/headless`) does not get duplicate components such as two `Checkbox` implementations available for import.
- `pnpm package:bootstrap [names...]` (`.github/scripts/bootstrap-package.mjs`) bootstraps packages that are missing on npm, in dependency order: build, publish the `0.0.0` placeholder, run `npm trust github ... --file release.yml --allow-publish`, and set `npm access set mfa=publish`. It supports `--dry-run`. Only maintainers run it; AI agents must not.
- A "Publish readiness" CI job runs on the release PR (`changeset-release/main`) and fails if any public package does not exist on npm (`pnpm package:check-npm`). It is a required status check, so the release PR cannot be merged before bootstrapping.

## Rationale

- Restricting what can be imported is a property of what is installed; subpath exports cannot provide it.
- The script makes the unavoidable manual step quick and repeatable, and the CI check turns a forgotten step into a clear, blocking message instead of a failed release.

## Consequences

- Adding a component still requires a maintainer with npm 2FA after the component PR is merged.
- The bootstrap script requires npm 11.15.0 or later for `npm trust`.
- The meaning of `mfa=publish` ("require 2FA and disallow tokens") should be verified on npmjs.com after the first bootstrap.

## Revisit When

- npm supports trusted publishers for packages that do not exist yet, or scope-wide trusted publishers.
