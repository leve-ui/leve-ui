# 0012. Enforce Conventional Commits with commitlint

- Status: Accepted
- Date: 2026-11-10

## Context

Because the monorepo contains multiple packages, the commit history should show which package each change targets and what kind of change it is. Both humans and AI agents make commits.

## Decision

- Commit messages follow Conventional Commits (`@commitlint/config-conventional`).
- Scopes are generated automatically from directory names in `commitlint.config.ts` (`packages/components/*`, `apps/*`, `tooling/*`, plus fixed values).
- Japanese subjects are allowed (`subject-case` is disabled). Headers are limited to 100 characters.

## Rationale

- Scopes are derived from directory names, so the config does not need updating when components are added.
- The format can be validated mechanically, which makes it easy for AI agents to follow.

## Consequences

- Messages can be validated with `echo "<message>" | pnpm exec commitlint`.
- Automatic validation via git hooks (lefthook / husky) is not yet set up; it will be added once the git repository is initialized.
- Details are documented in `.agents/rules/git-commit.md`.
