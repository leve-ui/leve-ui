# 0014. Split AI guidance into rules and skills

- Status: Accepted
- Date: 2026-11-10
- Related: [0013](0013-agents-md-as-source-of-ai-rules.md)

## Context

All AI guidance lived in `.agents/rules/`, which mixed always-applicable constraints (e.g. WAI-ARIA compliance) with step-by-step procedures (e.g. how to add a component). Two problems surfaced:

- The agents we use are Claude Code and Google Antigravity. Antigravity reads `AGENTS.md`, `.agents/rules/*.md`, and `.agents/skills/<name>/SKILL.md` natively, but it silently discards rule files without YAML frontmatter containing a valid `trigger`. Our rule files had no frontmatter, so Antigravity ignored them.
- Rules are loaded on every turn. Antigravity caps always-on rules at a shared 20,000-token budget, and long procedures in rules dilute the constraints that matter.

## Considered Options

1. **Keep everything in rules** — Simple, but procedures consume context on every turn and push us toward the token budget.
2. **Move everything to skills** — Minimal context usage, but skills are loaded only when the agent decides they are relevant, so constraints would not be guaranteed.
3. **Constraints in rules, procedures in skills** — Constraints are always enforced; procedures load on demand and can bundle scripts.

## Decision

- `.agents/rules/` contains only constraints that must always hold. Each file has frontmatter with `trigger: always_on` and a `description`.
- `.agents/skills/<name>/SKILL.md` contains procedures, with `name` and `description` frontmatter (Agent Skills format). Repetitive steps are automated with scripts in `scripts/`.
- Initial skills: `create-component` (with a scaffold script), `write-tests`, and `write-adr` (with a script that numbers ADRs and updates the index).
- `.claude/skills` is a symlink to `.agents/skills`, in the same way as `.claude/rules` ([0013](0013-agents-md-as-source-of-ai-rules.md)).

## Rationale

- Antigravity reads `.agents/` natively and Claude Code reads it through symlinks, so a single source serves both agents.
- Scaffold scripts make component creation deterministic and avoid copy-and-rename mistakes.

## Consequences

- Rule files without valid frontmatter are silently ignored by Antigravity; every new rule file must include it.
- Antigravity scans only the immediate `.md` children of `.agents/rules/`; do not create subdirectories there.
- Keep always-on rules short. If a rule grows into a procedure, move the procedure to a skill.
- When the scaffold output changes (e.g. package.json fields), update `create-component/scripts/scaffold.mjs` together with ADRs or rules that describe it.

## Revisit When

- Claude Code or Antigravity changes where it loads rules or skills, or how it handles their frontmatter.
