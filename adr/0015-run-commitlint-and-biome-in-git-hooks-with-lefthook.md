# 0015. Run commitlint and Biome in git hooks with lefthook

- Status: Accepted
- Date: 2026-11-10
- Related: [0006](0006-biome-for-lint-and-format.md), [0012](0012-conventional-commits-with-commitlint.md)

## Context

[0012](0012-conventional-commits-with-commitlint.md) introduced commitlint but left automatic validation on commit for later, because the repository was not yet under git. [0006](0006-biome-for-lint-and-format.md) introduced Biome, but nothing enforced it before code was committed. Both humans and AI agents commit, so checks should not depend on anyone remembering to run them.

## Considered Options

1. **husky + lint-staged** — Widely used, but requires two tools, and husky hooks are shell scripts.
2. **lefthook** — A single binary configured with one YAML file. It passes only staged files to commands and re-stages files fixed by them (`stage_fixed`).
3. **CI only** — No local setup, but problems are found only after pushing.

## Decision

We will use lefthook, configured in `lefthook.yml`:

- `pre-commit`: run `biome check --write` on staged files and re-stage the fixed files.
- `commit-msg`: run `commitlint --edit`.

Hooks are installed by the root `prepare` script (`lefthook install`), which runs on `pnpm install`. lefthook's own postinstall script is listed in `ignoredBuiltDependencies`, because `prepare` already installs the hooks.

## Rationale

- One tool and one config file cover both checks.
- Only staged files are checked, so hooks stay fast as the repository grows.
- Formatting issues are fixed automatically, so commits are blocked only by problems that need a human (or agent) decision.

## Consequences

- Commits that fail commitlint or contain Biome errors that cannot be fixed automatically are rejected.
- Bypassing hooks with `git commit --no-verify` is prohibited, including for AI agents.
- Type checks and tests are not run in hooks to keep commits fast; they remain required before reporting work as done (see `AGENTS.md`) and should be enforced in CI later.
