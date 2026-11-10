# 0013. Use AGENTS.md and `.agents/rules/` as the source of truth for AI rules

- Status: Accepted
- Date: 2026-11-10

## Context

We provide rules for AI agents. Claude Code reads `CLAUDE.md` and `.claude/rules/`, but other agents may also be used, and many of them read `AGENTS.md`.

## Considered Options

1. **Maintain `CLAUDE.md` and `AGENTS.md` separately** — Their contents drift apart.
2. **Make `AGENTS.md` the source of truth and symlink the Claude files** — A single source of content.

## Decision

- `AGENTS.md` is the source of truth for the entry point; `CLAUDE.md` is a symlink to it.
- Detailed rules live in `.agents/rules/`; `.claude/rules` is a symlink to `.agents/rules` (Claude Code loads it automatically).
- `AGENTS.md` includes a summary of each rule so that agents that don't follow links still get the essentials.

## Rationale

A single source of truth prevents rules from drifting between agents.

## Consequences

- Only `AGENTS.md` and `.agents/rules/` are edited.
- On Windows, git's `core.symlinks` must be enabled; otherwise symlinks become plain text files.
