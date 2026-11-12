# 0030. Position floating content with Floating UI

- Status: Accepted
- Date: 2026-11-12
- Related: [0009](0009-headless-parts-and-data-attributes.md), [0029](0029-render-overlays-in-place-in-the-top-layer-with-native-dialog-and-popover.md)

## Context

Popover, Tooltip, Hover Card, Menu, Select, Combobox, Date Picker and Tour show content next to
a trigger. The content must be placed on a side of the trigger, flip or shift when there is no
room, and follow the trigger when the page scrolls or resizes. Most headless libraries (Radix UI,
Base UI, Ark UI, React Aria) also offer an **Arrow** part that points at the trigger, and we want
one too.

Following [0029](0029-render-overlays-in-place-in-the-top-layer-with-native-dialog-and-popover.md),
this content is rendered in place and shown in the top layer (`popover="manual"`). It is never
open in the SSR HTML: it opens on the client. Our component rules allow minimal inline styles
for positioning.

Two approaches exist (checked 2026-11-12):

- **Floating UI** (`@floating-ui/dom`): computes the position in JavaScript, writes `top` /
  `left`, and re-computes on scroll and resize (`autoUpdate`). Middleware handles offset, flip,
  shift, size and the arrow, and it reports the **final placement** after a flip.
- **CSS anchor positioning** (`anchor-name`, `position-anchor`, `position-area`,
  `position-try-fallbacks`): the browser places and flips the content. The core became Baseline
  (newly available) on 2026-01-13. But CSS does not tell JavaScript, or the content's own
  descendants in a Baseline way, which fallback was applied, so an arrow cannot follow a flip.

## Considered Options

1. **CSS anchor positioning only** — No dependency and no layout JavaScript. No Arrow part, and
   `data-side` can only show the requested side.
2. **Floating UI** — A small runtime dependency and a client task while the overlay is open.
   Supports an Arrow part, reports the final side, and supports virtual anchors (for example
   the pointer position in Context Menu).
3. **CSS anchor positioning with Floating UI for the arrow** — Two positioning systems that can
   disagree about the final side; more to build and test than either alone.

## Decision

We will position floating content with **Floating UI** (`@floating-ui/dom`), wrapped once in
`@leve-ui/utils` so that components do not call it directly.

- Positioning runs only while the floating part is open, from a client task started on open and
  cleaned up on close (`autoUpdate`). Nothing runs before the user opens an overlay.
- Floating parts accept `side` (`top | right | bottom | left`), `align` (`start | center | end`),
  `sideOffset`, `alignOffset`, `avoidCollisions` (flip and shift, default `true`) and
  `collisionPadding`.
- The floating part gets inline `position` / `top` / `left` and `data-side` / `data-align` with
  the **final** placement after collisions.
- We will provide an **Arrow** part per floating component (`Popover.Arrow`, `Tooltip.Arrow`,
  …). It is an element the consumer styles (for example an SVG or a rotated square). The library
  sets only its inline offset along the edge and `data-side`.
- The floating part exposes the trigger and available sizes as CSS variables
  (`--leve-<name>-anchor-width`, `--leve-<name>-available-height`, …) so that menus can match the
  trigger width in consumer CSS.
- Inline positioning styles are merged after the consumer's `style`, and each component comments
  why they are inline.
- `@floating-ui/dom` is a `dependency` of `@leve-ui/utils` only. The positioning logic (props to
  middleware, `autoUpdate` while open, final `data-side` / `data-align`, arrow offset, CSS
  variables) is shared by every floating component, so it belongs in `@leve-ui/utils` like other
  shared logic. We will not create a separate positioning package.

## Rationale

- An Arrow part and the final `data-side` are expected from a headless overlay library, and
  only option 2 provides them today with one code path.
- Overlays open on the client only (0029), so CSS anchor positioning's main advantage —
  correct position without JavaScript at first paint — does not apply to us. The JavaScript
  runs only while an overlay is open, which still fits Qwik's resumability.
- Floating UI is the de facto standard (used by Radix UI, Base UI, Ark UI and Qwik UI), small,
  framework-agnostic and well-tested.
- Option 3 would let the arrow and the content disagree after a flip.

## Consequences

- `@leve-ui/utils` gains a runtime dependency on `@floating-ui/dom` (with `@floating-ui/core` and
  `@floating-ui/utils`, about 460 KB unpacked, no other dependencies). Every component package
  depends on `@leve-ui/utils`, so it is **installed** for all consumers, including those who only
  use components without floating content.
- It must not reach their **bundles**: `@leve-ui/utils` keeps its per-module build and
  `"sideEffects": false`, and the positioning code lives in its own module that only floating
  components import.
- Each floating component needs a client task (`useVisibleTask$` or a task guarded by
  `isServer`) while open; it must be commented.
- The position may lag one frame behind fast scrolling, as with any JavaScript positioning.
- E2E must cover flipping near the viewport edge and the arrow position.

## Revisit When

- CSS exposes the applied position fallback to descendants (for example anchored container
  queries) and it becomes Baseline, so the Arrow and `data-side` can follow flips without
  JavaScript.
- Floating UI stops being maintained.
