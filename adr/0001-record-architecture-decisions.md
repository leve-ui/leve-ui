# 0001. Record architecture decisions with ADRs

- Status: Accepted
- Date: 2026-11-10

## Context

In a UI library, public API and accessibility decisions are hard to change later. Without a record of why a decision was made, newcomers and AI agents may "fix" things in good faith, breaking consumers or reintroducing problems that were deliberately avoided.

## Considered Options

1. **Don't record decisions** — No effort, but the reasoning is lost.
2. **Append to README or AGENTS.md** — Easy, but the history and rejected options get buried.
3. **Write ADRs** — One file per decision, preserving the history and rejected options.

## Decision

We will record decisions that affect the library as a whole as ADRs in `adr/`. The format is a simplified version of Michael Nygard's format (`adr/template.md`). ADRs are written in English.

## Rationale

- Each decision lives in its own file, and its status (Accepted / Superseded, etc.) tracks how it evolves.
- AI agents can be instructed to read ADRs before changing a policy, which prevents unintended changes.
- Writing in English keeps ADRs accessible to any contributor or tool.

## Consequences

- To change a policy, write a new ADR instead of rewriting the existing one.
- The process is described in `adr/README.md`.
