# 0030. Position floating content with CSS anchor positioning

- Status: Proposed
- Date: 2026-11-12
- Related: [0009](0009-headless-parts-and-data-attributes.md), [0029](0029-render-overlays-in-place-in-the-top-layer-with-native-dialog-and-popover.md)

## Context

Popover, Tooltip, Hover Card, Menu, Select, Combobox, Date Picker and Tour show content next to
a trigger. The content must be placed on a side of the trigger, flip when there is no room, and
follow the trigger when the page scrolls or resizes.

Following [0029](0029-render-overlays-in-place-in-the-top-layer-with-native-dialog-and-popover.md),
this content is rendered in place and shown in the top layer (`popover="manual"`). Our component
rules allow minimal inline styles for positioning.

Two approaches exist (checked 2026-11-12):

- **Floating UI** (`@floating-ui/dom`): measures the trigger and content in JavaScript and writes
  `top` / `left`, re-measuring on scroll and resize. Reports the final placement (after a
  flip), which is needed to point an arrow.
- **CSS anchor positioning** (`anchor-name`, `position-anchor`, `position-area`,
  `position-try-fallbacks`, `anchor()`, `anchor-size()`): the browser places and flips the
  content. The core became **Baseline (newly available) on 2026-01-13** (Chrome 125+,
  Firefox 147, Safari 26). Newer parts such as `position-visibility` are not Baseline yet.
  CSS cannot tell JavaScript which fallback was applied.

## Considered Options

1. **Floating UI** — Works in older browsers and reports the final side. Adds a runtime
   dependency, needs a client task and scroll/resize listeners for every open overlay, and the
   content is unpositioned until JavaScript runs.
2. **CSS anchor positioning** — No dependency and no JavaScript for layout; positions are
   correct from the first paint after the overlay opens, and identical between SSR and client.
   The final side after a flip is unknown to JavaScript, so arrows that follow flips need CSS
   only techniques or are not supported.
3. **CSS anchor positioning with a Floating UI fallback** — Best coverage, but two code paths to
   build and test, and the fallback brings back the dependency.

## Decision

We will position floating content with **CSS anchor positioning only**. We will not depend on
Floating UI.

- The anchor part (usually the Trigger) gets an inline `anchor-name: --leve-<id>` and the
  floating part gets `position-anchor: --leve-<id>`, where `<id>` comes from `useId()` so that SSR
  and client output match.
- The floating part's props `side` (`top | right | bottom | left`) and `align`
  (`start | center | end`) are turned into an inline `position-area`, with
  `position-try-fallbacks: flip-block, flip-inline` by default. The part also gets `data-side` and
  `data-align` with the **requested** values.
- Offsets are left to consumers (`margin` on the floating part works with `position-area`), so
  we do not add `sideOffset` / `alignOffset` props.
- We will not provide an `Arrow` part for now.
- Inline positioning styles are merged after the consumer's `style` (with `withCssVars`-style
  merging), and each component comments why they are inline.

## Rationale

- The core of anchor positioning is Baseline, which matches the support policy in
  [0029](0029-render-overlays-in-place-in-the-top-layer-with-native-dialog-and-popover.md).
- No layout JavaScript means no client task, no listeners and no layout jumps, and fits Qwik's
  resumability: nothing needs to run until the user opens the overlay.
- A fallback (option 3) doubles the work for browsers we do not support.

## Consequences

- `data-side` reflects the requested side, not the flipped one. Styles that depend on the final
  side (arrows, slide-in direction) cannot follow a flip. This is documented on each component.
- Firefox does not animate `anchor()` / `anchor-size()` values.
- Content is not hidden automatically when the anchor scrolls out of view
  (`position-visibility` is not Baseline).
- Menus and listboxes that should match the trigger width can use `anchor-size(width)` in
  consumer CSS; the demos show it.

## Revisit When

- CSS exposes the applied fallback (for example through a pseudo-class or event), so arrows can
  follow flips.
- Users need positions that CSS cannot express (virtual anchors such as a mouse position for
  Context Menu, or collision handling beyond flipping).
