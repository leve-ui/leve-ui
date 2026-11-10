# 0010. Do not expose child-determined state on parent attributes

- Status: Accepted
- Date: 2026-11-10
- Related: [0009](0009-headless-parts-and-data-attributes.md)

## Context

Initially, Avatar's Root exposed the image loading state as `data-state`. However, that state is determined by the child Image, and in Qwik SSR a parent's attributes are emitted before its children render. The Root was therefore emitted with the initial value `idle` and never updated. Even after resuming, the signal value and the DOM stayed out of sync.

## Considered Options

1. **Compute the child's information in the Root first** — The Root would need to know the child's props, which defeats the purpose of splitting parts.
2. **Re-render on the client** — Adds `useVisibleTask$` calls and undermines Qwik's resumability.
3. **Expose child-determined state only on the child itself (or on siblings rendered after it)** — Consistent with SSR output order.

## Decision

We will not expose state determined by a child part on a parent part's attributes. A state's `data-state` goes only on the part that determines it, or on parts rendered after it.

## Rationale

It keeps SSR output and client state consistent at all times.

## Consequences

- Avatar's Root has no `data-state`. The state is available via `data-state` on `Avatar.Image` and `Avatar.Fallback`.
- Consumers who want to style based on the parent's state can use selectors such as `:has([data-state="loaded"])`.
- Components whose Root owns the state (e.g. Dialog's `open`) are not affected by this constraint.
