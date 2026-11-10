# Contributing to levis-ui

Thank you for your interest in contributing! This guide explains how to set up the project and get your changes merged.

## Prerequisites

- Node.js — the version in [`.node-version`](./.node-version)
- pnpm — the version in `packageManager` in [`package.json`](./package.json) (`corepack enable` installs it for you)

## Setup

```sh
git clone https://github.com/<your-username>/levis-ui.git
cd levis-ui
pnpm install                                          # also installs git hooks (lefthook)
pnpm --filter @levis-ui/e2e exec playwright install chromium   # for E2E tests
```

## Project Structure

| Path | Package | Published | Description |
| --- | --- | --- | --- |
| `packages/levis-ui` | `levis-ui` | Yes | All-in-one package; only re-exports `@levis-ui/*` |
| `packages/components/*` | `@levis-ui/<name>` | Yes | One package per component |
| `packages/utils` | `@levis-ui/utils` | Yes | Internal utilities shared by components |
| `apps/docs` | `@levis-ui/docs` | No | Documentation site (Qwik City) |
| `apps/storybook` | `@levis-ui/storybook` | No | Storybook |
| `apps/e2e` | `@levis-ui/e2e` | No | Playwright tests, run against Storybook |
| `tooling/*` | `@levis-ui/tsconfig`, `@levis-ui/vite-config` | No | Shared configuration |

During development, the docs site and Storybook import library source files directly through the `@levis-ui/source` export condition, so you don't need to rebuild packages to see changes ([ADR 0005](./adr/0005-source-condition-for-development.md)).

## Commands

```sh
pnpm storybook      # Storybook at http://localhost:6006
pnpm docs           # documentation site
pnpm build          # build all packages
pnpm test           # unit tests (Vitest)
pnpm typecheck      # type checks
pnpm e2e            # E2E tests (Playwright; starts Storybook on port 6106)
pnpm check:fix      # lint, format, and sort imports (Biome)
pnpm changeset      # describe your change for the changelog
pnpm component:new <name> <part,...>   # scaffold a new component package
```

## Workflow

1. **Open an issue first** for new components or larger changes, so we can agree on the design before you start.
2. **Fork** the repository and create a branch named `<type>/<short-description>` (e.g. `feat/dialog`, `fix/avatar-ssr-state`).
3. **Make your change** following the guidelines below.
4. **Add a changeset** if you changed a published package (`packages/**`): run `pnpm changeset`, choose the packages and bump types, and write the summary in English. It goes into the changelog.
5. **Commit** with an English [Conventional Commits](https://www.conventionalcommits.org/) message (see below).
6. **Open a pull request** against `main`. Fill in the template.

CI runs on every pull request: commit messages and PR title, lint, type checks, unit tests, build, and E2E. For first-time contributors, a maintainer has to approve the workflow run first. Pull requests are merged with **squash merge** once CI passes and a maintainer has reviewed them.

### Commit Messages

Commit messages and pull request titles must be in English and follow Conventional Commits. They are checked on commit (lefthook) and in CI (commitlint).

```
<type>(<scope>): <subject>
```

- **type**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- **scope** (optional): a directory name such as `avatar`, `utils`, `levis-ui`, `docs`, `storybook`, `e2e`, or `repo` (see [`commitlint.config.ts`](./commitlint.config.ts))
- **subject**: imperative mood, starts with a lowercase letter, no trailing period

```
feat(avatar): add delayMs to Fallback
fix(utils): treat 0 as falsy in dataAttr
```

Because pull requests are squash-merged, **the PR title becomes the commit message on `main`**, so it must follow the same format.

Please don't bypass the git hooks with `--no-verify`.

## Component Guidelines

### Accessibility

- Follow the matching [WAI-ARIA APG pattern](https://www.w3.org/WAI/ARIA/apg/patterns/): roles, `aria-*` attributes, keyboard interaction, and focus management.
- Prefer native elements (`<button>`, `<a>`) over adding roles to `<div>`.
- Required `role` and `aria-*` attributes are set by the library, after `{...props}`, so they can't be overridden by accident.
- Link parts with IDs from `useId()`.

### Headless Parts

- One part component per DOM element, exported as a namespace: `Avatar.Root`, `Avatar.Image`, ...
- Never output styles or class names. Every part renders `data-levis-<name>-<part>` (the root renders `data-levis-<name>`) and state attributes such as `data-state`.
- Pass all received props through to the element, and merge event handlers instead of overriding them: `onClick$={[internal$, props.onClick$]}`.
- See [ADR 0009](./adr/0009-headless-parts-and-data-attributes.md) and [ADR 0010](./adr/0010-no-child-state-on-parent-attributes.md).

### Tests

Every component needs all three:

| Type | Location | What to cover |
| --- | --- | --- |
| Unit | `packages/components/<name>/src/<name>.test.tsx` | Rendering, ARIA attributes, data attributes, props, states |
| Story | `apps/storybook/stories/<name>.stories.tsx` | One story per notable state |
| E2E | `apps/e2e/tests/<name>.spec.ts` | Keyboard interaction and focus management |

### Adding a Component

```sh
pnpm component:new dialog trigger,overlay,content,title,description,close
pnpm install
```

The scaffold creates the package, a story, an E2E test, and registers the package in `levis-ui` and Storybook. Then implement it following the guidelines above and fill in its row in the README's package table.

You don't need to publish anything. After your pull request is merged, a maintainer publishes the new package to npm (see [For Maintainers](#for-maintainers)).

## Design Decisions

Library-wide decisions are recorded as Architecture Decision Records in [`adr/`](./adr/README.md). Please read the related ADRs before proposing changes to existing conventions. If your change reverses or adds a library-wide decision, add a new ADR (in English) with `pnpm adr:new "<title>"`.

## AI Coding Agents

Instructions for AI coding agents live in [`AGENTS.md`](./AGENTS.md), with detailed rules in `.agents/rules/` and step-by-step skills in `.agents/skills/` (written in Japanese). They describe the same conventions as this guide.

## For Maintainers

### Releasing

1. Merging a pull request with changesets into `main` makes the Release workflow open or update the "chore(release): version packages" pull request.
2. Merging that pull request publishes the packages to npm with trusted publishing (with provenance) and creates GitHub releases.

Never publish from a local machine, except for bootstrapping a new package.

### Bootstrapping a New Package

npm trusted publishing can only be configured for packages that already exist on npm. After a pull request that adds a new package is merged, and **before merging the release pull request**, run:

```sh
git switch main && git pull
npm login
pnpm package:bootstrap @levis-ui/<name>    # add --dry-run to preview
```

This publishes `0.0.0` as a placeholder, registers `release.yml` as the package's trusted publisher, and requires 2FA for publishing. The "Publish readiness" check on the release pull request fails until every public package exists on npm. See [ADR 0020](./adr/0020-bootstrap-new-packages-and-keep-individual-packages.md).

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
