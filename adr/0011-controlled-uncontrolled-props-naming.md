# 0011. Naming convention for controlled/uncontrolled props

- Status: Proposed
- Date: 2026-11-10
- Related: [0009](0009-headless-parts-and-data-attributes.md)

## Context

Stateful components (e.g. Dialog open state, Tabs selection) should support both "controlled" mode, where the consumer manages the state, and "uncontrolled" mode, where the component does. Prop shapes must be consistent across all components.

## Considered Options

1. **React style: `open` + `onOpenChange$` + `defaultOpen`** — Familiar to users of React libraries. In Qwik, the value and the change handler are passed separately.
2. **Qwik style: `bind:open` (Signal) + `defaultOpen` + `onOpenChange$`** — Fits Qwik's `bind:` syntax; passing a Signal keeps both sides in sync.

## Decision

- Uncontrolled: `default<State>` (e.g. `defaultOpen`)
- Controlled: `bind:<state>` (e.g. `bind:open`, `Signal<boolean>`)
- Change notification: `on<State>Change$` (e.g. `onOpenChange$`)

## Rationale

It uses the `bind:` syntax that feels natural to Qwik users, while still supporting consumers who only want change notifications.

## Consequences

- The controlled/uncontrolled state logic is shared in `@levis-ui/utils`.
- When the first stateful component is implemented, confirm that it can be built with this convention, then mark this ADR as Accepted.
