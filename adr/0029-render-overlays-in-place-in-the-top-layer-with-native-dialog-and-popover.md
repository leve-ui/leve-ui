# 0029. Render overlays in place in the top layer with native dialog and popover

- Status: Accepted
- Date: 2026-11-12
- Related: [0010](0010-no-child-state-on-parent-attributes.md), [0028](0028-make-drawer-a-separate-package-and-a-non-modal-dialog-by-default.md)

## Context

Dialog, Drawer, Popover, Tooltip, Hover Card, Menu, Select, Combobox, Toast, Date Picker and
Tour all show content above the rest of the page. That content must escape `overflow: hidden`
and stacking contexts of its ancestors.

Most UI libraries solve this with a **portal**: the content is moved to the end of
`document.body`. Qwik 1 has no portal primitive. A hand-made portal moves DOM nodes on the
client, so the server output and the client DOM differ, which conflicts with SSR and
resumability, and it breaks the Context and event flow that Qwik expects from the component
tree.

The platform now offers a **top layer** without moving nodes:

- `<dialog>` with `showModal()`: top layer, `::backdrop`, the rest of the page becomes inert,
  Escape fires `cancel`. Widely available since 2024-09.
- The Popover API (`popover="auto" | "manual"`, `showPopover()`, `toggle` events): top layer,
  always non-modal. Baseline newly available since 2025-01.

What the platform does **not** do (checked 2026-11-12):

- `showModal()` does not trap focus: it only makes the outside inert, so Tab can leave to the
  browser UI. Our accessibility rules require a focus trap for modals.
- `showModal()` does not stop the page behind from scrolling. The CSS-only fix
  (`overscroll-behavior: contain` on the dialog and backdrop) works fully only in Chromium 144+
  and cannot be feature-detected.
- Returning focus to the opener on close is unreliable in WebKit (bug 236322).
- `popover="hint"` and `dialog[closedby]` are not Baseline yet.

There is no ADR yet on which browsers leve-ui supports.

## Considered Options

1. **Custom portal** — Move content to `document.body` on the client. Works everywhere, but the
   SSR output differs from the client DOM, nodes move after resume, and we would own stacking
   (`z-index`), inert-ing the outside and outside-click detection ourselves.
2. **Native top layer, light dismiss by the browser** — `<dialog>` for modals and
   `popover="auto"` for the rest, letting the browser close popovers on Escape and outside
   clicks. Least code, but the consumer cannot veto a dismissal, the browser closes unrelated
   `auto` popovers, and we must mirror browser-initiated closes back into `bind:open`.
3. **Native top layer, dismissal by leve-ui** — Render content in place. Use `<dialog>` +
   `showModal()` for modals and `popover="manual"` for non-modal overlays, and handle Escape and
   outside interaction with our own dismissable layer (`createDismissableLayer`, #7).

## Decision

We will not use portals. Overlay content is rendered **in place** in the component tree, and
reaches the top layer through native APIs:

| Overlay | Element / API |
| --- | --- |
| Dialog, Drawer with `modal` | `<dialog>` + `showModal()` / `close()` |
| Drawer (non-modal), Popover, Hover Card, Menu, Select, Combobox listbox, Date Picker, Tour, Tooltip | `popover="manual"` + `showPopover()` / `hidePopover()` |
| Toast viewport | `popover="manual"` |

- We will use `popover="manual"`, not `"auto"` or `"hint"`. Escape and outside interaction are
  handled by `createDismissableLayer` from `@leve-ui/utils`, so the consumer can prevent a
  dismissal and nested overlays close one at a time. For `<dialog>`, we will prevent the native
  `cancel` default and route Escape through the same layer. Browsers may ignore that
  `preventDefault()` (close watcher rules), so we also listen to the dialog's `close` event and
  sync the state back.
- The open state lives in leve-ui state (`useControllableState`). The DOM methods
  (`showModal()`, `showPopover()`, …) are called from a client task when the state changes. A
  `defaultOpen` overlay is therefore hidden in the SSR HTML until the client resumes.
- We will still provide, in `@leve-ui/utils`:
  - a **focus trap with initial focus and focus restoration** (#8), because `showModal()` does
    not trap focus and focus return is unreliable in WebKit;
  - a **reference-counted scroll lock** (#9), because `showModal()` does not stop page scroll.
- We will not ship a popover polyfill. leve-ui supports browsers in which these features are
  **Baseline (newly available)**; `<dialog>` and the Popover API both are.

## Rationale

- Rendering in place keeps the SSR output equal to the client DOM and keeps Context, events and
  Qwik's resumability working without workarounds. The top layer removes the main reason for
  portals (clipping and `z-index`).
- `manual` popovers plus our dismissable layer give one behavior for every overlay: the same
  Escape / outside-click rules, consumer veto, and nested stacking, already unit-tested in #7.
  Browser light dismiss (option 2) cannot be vetoed and closes unrelated `auto` popovers.
- A focus trap and scroll lock are still needed, but they are small and only used by modals.

## Consequences

- Overlay components need a client task to sync state to the DOM methods; this is a valid use
  of `useVisibleTask$` (or a task guarded by `isServer`) and must be commented.
- Consumers style the backdrop with `::backdrop` for `<dialog>`. Non-modal overlays have no
  backdrop.
- Entry/exit animations use `@starting-style` and `transition-behavior: allow-discrete`
  (Baseline since 2024-08). leve-ui does not provide a presence/animation helper for now.
- E2E must cover focus return in WebKit.
- How floating content is positioned next to its trigger is decided separately (#13).

## Revisit When

- `dialog[closedby]` and `popover="hint"` become Baseline (Tooltip may switch to `hint`).
- Native modals trap focus or lock scroll in all engines.
- Qwik ships a portal primitive.
