# 0021. Write contributor-facing documents in English

- Status: Accepted
- Date: 2026-11-10
- Related: [0013](0013-agents-md-as-source-of-ai-rules.md), [0017](0017-write-commit-messages-in-english.md)

## Context

The repository is public. ADRs, commit messages, changesets, and package metadata are already in English, but the README was in Japanese and there was no contributor guide, pull request template, or issue template. AI agent instructions (`AGENTS.md`, `.agents/`) are in Japanese, which works for the current maintainers and for AI agents.

## Considered Options

1. **Keep human-facing documents in Japanese** — Easy for current maintainers, but excludes most potential users and contributors.
2. **English for everything, including AI instructions** — Consistent, but rewriting the AI rules adds cost without benefit, since agents read Japanese fine.
3. **English for documents read by users and contributors; Japanese allowed for AI instructions** — Removes the barrier where it matters.

## Decision

- Written in English: `README.md` (for library users), `CONTRIBUTING.md` (for contributors), `.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/*`, ADRs, commit messages, PR titles, and changesets.
- Development instructions move from the README to `CONTRIBUTING.md`, which summarizes the same conventions as `AGENTS.md` and links to ADRs instead of duplicating them.
- `AGENTS.md`, `.agents/rules/`, and `.agents/skills/` may remain in Japanese. PR descriptions and review comments may be in either language.
- `.github/CODEOWNERS` requests reviews from the maintainers automatically.

## Rationale

English documents let anyone use and contribute to the library, while keeping AI instructions in Japanese avoids churn.

## Consequences

- Conventions are described in two places (`CONTRIBUTING.md` in English and `.agents/rules/` in Japanese). When a convention changes, update both.
- New components must add a row to the README's package table (the scaffold adds a placeholder).
