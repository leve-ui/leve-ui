# Contributing to leve-ui

Thank you for your interest in contributing! This guide explains how to set up the project and get your changes merged.

## Prerequisites

- Node.js — the version in [`.node-version`](./.node-version)
- pnpm — the version in `packageManager` in [`package.json`](./package.json) (`corepack enable` installs it for you)

## Setup

```sh
git clone https://github.com/<your-username>/leve-ui.git
cd leve-ui
pnpm install                                          # also installs git hooks (lefthook)
pnpm --filter @leve-ui/e2e exec playwright install chromium   # for E2E tests
```

## Project Structure

| Path | Package | Published | Description |
| --- | --- | --- | --- |
| `packages/core` | `@leve-ui/core` | Yes | All-in-one package; only re-exports `@leve-ui/*` |
| `packages/components/*` | `@leve-ui/<name>` | Yes | One package per component |
| `packages/utils` | `@leve-ui/utils` | Yes | Internal utilities shared by components |
| `apps/docs` | `@leve-ui/docs` | No | Documentation site (Qwik City) |
| `apps/storybook` | `@leve-ui/storybook` | No | Storybook |
| `apps/e2e` | `@leve-ui/e2e` | No | Playwright tests, run against Storybook |
| `tooling/*` | `@leve-ui/tsconfig`, `@leve-ui/vite-config` | No | Shared configuration |

During development, the docs site and Storybook import library source files directly through the `@leve-ui/source` export condition, so you don't need to rebuild packages to see changes ([ADR 0005](./adr/0005-source-condition-for-development.md)).

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
2. **Claim the issue**: When starting work on an issue, add the `status: in progress` label (replacing `status: ready`) to let others know it is actively being worked on and prevent duplicate work.
3. **Fork** the repository and create a branch named `<type>/<short-description>` (e.g. `feat/dialog`, `fix/avatar-ssr-state`).
4. **Make your change** following the guidelines below.
5. **Add a changeset** if you changed a published package (`packages/**`): run `pnpm changeset`, choose the packages and bump types, and write the summary in English. It goes into the changelog. **Until 1.0, never choose `major`** — see [Choosing a Bump Type](#choosing-a-bump-type).
6. **Commit** with an English [Conventional Commits](https://www.conventionalcommits.org/) message (see below).
7. **Open a pull request** against `main`. Fill in the template.

CI runs on every pull request: commit messages and PR title, lint, type checks, unit tests, build, and E2E. For first-time contributors, a maintainer has to approve the workflow run first. Pull requests are merged with **squash merge** once CI passes and a maintainer has reviewed them.

### Choosing a Bump Type

The packages are below 1.0. In Changesets, a `major` bump on a `0.x` package jumps straight to `1.0.0`, so until a maintainer decides to release 1.0:

| Change | Until 1.0 (`0.x`) | After 1.0 |
| --- | --- | --- |
| Breaking change | `minor` | `major` |
| New feature | `minor` or `patch` | `minor` |
| Bug fix | `patch` | `patch` |

### Commit Messages

Commit messages and pull request titles must be in English and follow Conventional Commits. They are checked on commit (lefthook) and in CI (commitlint).

```
<type>(<scope>): <subject>
```

- **type**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- **scope** (optional): a directory name such as `avatar`, `utils`, `core`, `docs`, `storybook`, `e2e`, or `repo` (see [`commitlint.config.ts`](./commitlint.config.ts))
- **subject**: imperative mood, starts with a lowercase letter, no trailing period

```
feat(avatar): add delayMs to Fallback
fix(utils): treat 0 as falsy in dataAttr
```

Because pull requests are squash-merged, **the PR title becomes the commit message on `main`**, so it must follow the same format.

Please don't bypass the git hooks with `--no-verify`.

### Issues and Labels

Please write issues in English. Maintainers triage them with prefixed labels:

- **`type:`** (exactly one): `component`, `feature`, `bug`, `a11y`, `foundation`, `adr`, `docs`, `tooling`
- **`scope:`**: the affected package or app, matching the commit scope (e.g. `scope: dialog`, `scope: utils`)
- **`status:`**: `needs triage`, `needs design`, `needs adr`, `blocked`, `ready`, `in progress`
- **`size:`**: `S`, `M`, `L`
- **`qwik:`** (exactly one): `v1` for Qwik v1 (`@builder.io/qwik`, all current work), `v2` for Qwik v2 (`@qwik.dev/core`) support

New components are grouped into milestones in dependency order, from **M0: Foundation** (shared logic in `@leve-ui/utils` and library-wide ADRs) to **M5: Advanced**. Work on Qwik v2 support is tracked separately in the **Qwik v2** milestone. Issues labeled `status: ready` are good places to start.

When working on an issue, you must add the `status: in progress` label (replacing `status: ready`) to indicate that work is underway and prevent duplicate work.

## Component Guidelines

### Accessibility

- Follow the matching [WAI-ARIA APG pattern](https://www.w3.org/WAI/ARIA/apg/patterns/): roles, `aria-*` attributes, keyboard interaction, and focus management.
- Prefer native elements (`<button>`, `<a>`) over adding roles to `<div>`.
- Required `role` and `aria-*` attributes are set by the library, after `{...props}`, so they can't be overridden by accident.
- Link parts with IDs from `useId()`.
- For roving `tabIndex` (one tabbable item, arrow keys move focus), render `tabIndex={0}` on the active item and `-1` on the rest, and call `moveRovingFocus` from `@leve-ui/utils` on `keydown`.

### Headless Parts

- One part component per DOM element, exported as a namespace: `Avatar.Root`, `Avatar.Image`, ...
- Never output styles or class names. Every part renders `data-leve-<name>-<part>` (the root renders `data-leve-<name>`) and state attributes such as `data-state`.
- Pass all received props through to the element, and merge event handlers instead of overriding them: `onClick$={[internal$, props.onClick$]}`.
- Stateful components support both controlled (`bind:open`) and uncontrolled (`defaultOpen`) usage, plus `onOpenChange$` ([ADR 0011](./adr/0011-controlled-uncontrolled-props-naming.md)). Implement this with `useControllableState` from `@leve-ui/utils`.
- Form controls read the field context with `useFieldControl(props)` from `@leve-ui/utils` and must also work outside a Field. Field ids are overridden only through the Root's `ids` prop, and the Root's `hasDescription` decides whether the description is referenced ([ADR 0024](./adr/0024-wire-field-ids-and-descriptions-from-the-field-root.md)).
- See [ADR 0009](./adr/0009-headless-parts-and-data-attributes.md) and [ADR 0010](./adr/0010-no-child-state-on-parent-attributes.md).

### Tests

Every component needs all three:

| Type | Location | What to cover |
| --- | --- | --- |
| Unit | `packages/components/<name>/src/<name>.test.tsx` | Rendering, ARIA attributes, data attributes, props, states |
| Story | `apps/storybook/stories/<name>.stories.tsx` | One story per notable state |
| E2E | `apps/e2e/tests/<name>.spec.ts` | Keyboard interaction and focus management |

#### Writing stories

Storybook generates a Docs page for every component, and its "Show code" panel should show code that users can copy as is, styles included:

- Write one demo per story at `apps/storybook/stories/demos/<name>/<story>.tsx` (`<story>` is the export name in kebab-case). Export a `component$` as the default export, written the way a user would write it. The docs site renders the same demos ([ADR 0031](./adr/0031-share-storybook-demos-with-the-docs-site-and-keep-demo-styles-in-css-files.md)).
- Put the styles in `<story>.css` next to the demo, import them with `import styles from './<story>.css?inline'`, and call `useStyles$(styles)` inside the component. Style with `class`, and start class names with the component and story name (e.g. `.progress-default-track`), because the CSS applies to the whole page and several demos share a page.
- In the story, render the demo and pass its TSX and CSS, imported with `?raw`, to `parameters.docs.source.code` through `demoSource()` from `stories/source.ts`, so the code shown always matches what runs.
- Write comments in demo files, including CSS comments, in English.
- Give demos the shared look so they fit both docs themes: accent `#009dfd` (hover `#006ce9`), accent text `light-dark(#006ce9, #4cb8ff)`, surfaces `light-dark(#ffffff, #1b2045)`, subtle surfaces `light-dark(#f1f5f9, #ffffff14)`, tracks `light-dark(#e2e8f0, #ffffff1f)`, borders `light-dark(#cbd5e1, #ffffff3d)`, text `light-dark(#0f172a, #ffffff)`, muted text `light-dark(#475569, #c9ddf0)`, errors `light-dark(#dc2626, #f87171)`, success `light-dark(#16a34a, #4ade80)`, radius `6px` (`4px` for small controls, `9999px` for round ones), focus `outline: 2px solid #009dfd; outline-offset: 2px`, disabled `opacity: 0.5`, and `font-family: inherit`. Write the values in each demo instead of sharing variables or files.
- Use icons from `@qwikest/icons/lucide` instead of inline SVG, and mark them `aria-hidden="true"`. It is the only external package demos may import.
- Don't add test-only elements (such as buttons to check Tab order) to demos. E2E tests that need them open the story with `gotoStory(page, id, { focusGuards: true })`, which wraps it in `Before` / `After` buttons.
- Don't write JSX directly in `render`, and don't hide parts, props, or styles behind helper components, shared constants, or stylesheets other than the demo's own `<story>.css`. They wouldn't show up in "Show code".

### Adding a Component

```sh
pnpm component:new dialog trigger,overlay,content,title,description,close
pnpm install
```

The scaffold creates the package, a story, an E2E test, and registers the package in `@leve-ui/core` and Storybook. Then implement it following the guidelines above and fill in its row in the README's package table.

You don't need to publish anything. After your pull request is merged, a maintainer publishes the new package to npm (see [For Maintainers](#for-maintainers)).

## Docs Site

The docs site (`apps/docs`) is the first user of leve-ui ([ADR 0032](./adr/0032-author-docs-in-mdx-and-generate-api-reference-from-prop-types.md)):

- Build its UI with leve-ui components whenever one fits (for example `Tabs` for the Code / CSS tabs, `Collapsible` for the sidebar). Don't reimplement a component the library already provides.
- Import only from the public packages (`@leve-ui/core` or `@leve-ui/<name>`), not from `@leve-ui/utils` or package internals.
- If the site needs a component that doesn't exist yet, or an existing component is missing a feature or is awkward to use, report it in your pull request or open an issue. If you can't wait for it, keep a minimal temporary implementation based on native elements and mark it with `// TODO(leve-ui): replace with <Name> (#<issue>)`.

## Design Decisions

Library-wide decisions are recorded as Architecture Decision Records in [`adr/`](./adr/README.md). Please read the related ADRs before proposing changes to existing conventions. If your change reverses or adds a library-wide decision, add a new ADR (in English) with `pnpm adr:new "<title>"`.

## AI Coding Agents

Instructions for AI coding agents live in [`AGENTS.md`](./AGENTS.md), with detailed rules in `.agents/rules/` and step-by-step skills in `.agents/skills/` (written in Japanese). They describe the same conventions as this guide.

## For Maintainers

### Releasing

1. Merging a pull request with changesets into `main` makes the Release workflow open or update the "chore(release): version packages" pull request. It collects every pending changeset.
2. Merging that pull request publishes the packages to npm with trusted publishing (with provenance) and creates GitHub releases. **Merging it is the decision to release**, so merge it when a batch of changes is ready.

All development happens on `main`; there are no release branches. Before 1.0, `major` changesets are not used. 1.0 is preceded by `1.0.0-beta.x` prereleases with Changesets prerelease mode, and a maintenance branch such as `v1` is created only when 2.0 development starts ([ADR 0022](./adr/0022-release-strategy-before-and-after-1-0.md)).

Never publish from a local machine, except for bootstrapping a new package.

### Bootstrapping a New Package

npm trusted publishing can only be configured for packages that already exist on npm. After a pull request that adds a new package is merged, and **before merging the release pull request**, run:

```sh
git switch main && git pull
npm login
pnpm package:bootstrap @leve-ui/<name>    # add --dry-run to preview
```

This publishes `0.0.0` as a placeholder, registers `release.yml` as the package's trusted publisher, and requires 2FA for publishing. The "Publish readiness" check on the release pull request fails until every public package exists on npm. Until then, the Release workflow skips publishing and shows a warning instead of failing ([ADR 0023](./adr/0023-skip-publishing-until-all-packages-are-bootstrapped.md)). See [ADR 0020](./adr/0020-bootstrap-new-packages-and-keep-individual-packages.md).

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
