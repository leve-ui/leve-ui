# 0028. Make Drawer a separate package and a non-modal dialog by default

- Status: Accepted
- Date: 2026-11-12
- Related: [0009](0009-headless-parts-and-data-attributes.md)

## Context

leve-ui will ship both a Dialog (#34) and a Drawer (#35). Many UI libraries treat a drawer
(or "sheet") as a Dialog with a different position: it is modal, traps focus, blocks the page
behind an overlay, and closes on outside click.

Our main use case for a drawer is different: a **detail panel**, for example in a dashboard,
that opens next to a list or table while the rest of the page stays usable. The user may click
another row, scroll the table, or use the page's toolbar while the panel is open. Making that
panel modal would block exactly the interactions it exists to support.

The WAI-ARIA APG only defines a pattern for modal dialogs
([Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)). A non-modal dialog
is still a `role="dialog"` without `aria-modal`, where focus can move freely between the dialog
and the page.

We also need to distinguish a drawer from a panel that is always visible. A sidebar that is
part of the layout and never "opens" is not a dialog at all.

## Considered Options

1. **Drawer is a variant of Dialog** (e.g. `Dialog` with a `side` prop) — One package and one
   API. But Dialog is modal by definition, so the non-modal behavior would be an exception
   inside Dialog, and every Dialog option (overlay, focus trap, scroll lock) would need a
   "drawer" interpretation.
2. **Drawer is a separate package, modal by default** — Matches most libraries, but the main
   use case (detail panels) would always have to opt out of modality.
3. **Drawer is a separate package, non-modal by default, with a `modal` opt-in** — Matches the
   main use case, keeps Dialog strictly modal, and still supports a modal drawer (for example
   full-screen navigation on mobile).

## Decision

We will ship Drawer as its own package (`@leve-ui/drawer`), separate from `@leve-ui/dialog`.

We will make Drawer a **non-modal dialog by default**:

- `Content` renders `role="dialog"` **without** `aria-modal`, labelled by `Title` and described
  by `Description`.
- There is no focus trap and no scroll lock. The page stays interactive.
- Focus moves into the drawer when it opens and returns to the trigger when it closes.
- Escape closes the drawer. Interacting outside the drawer does **not** close it by default,
  because the page is meant to stay usable while it is open.
- The `Overlay` part renders nothing in non-modal mode.

We will add a `modal` prop to Drawer. With `modal`, Drawer follows the APG Dialog (Modal)
pattern like Dialog does: `aria-modal="true"`, focus trap, scroll lock, `Overlay`, and closing
on outside interaction.

We will not use Drawer (or Dialog) for panels that are always visible. Those should use a
plain `<aside>` (or another landmark) in the consumer's layout.

## Rationale

- The primary use case is a detail panel next to content that remains interactive. A
  non-modal default serves it without extra props.
- Keeping Dialog strictly modal keeps its API and behavior simple and close to the APG.
- A separate package lets Drawer have drawer-specific props (`side` → `data-side`) without
  adding them to Dialog.
- Closing on outside interaction would fight the non-modal use case (clicking another row
  would close the panel), so it is only enabled in `modal` mode.

## Consequences

- Dialog and Drawer will share overlay logic through `@leve-ui/utils` (dismissable layer,
  focus trap and restoration, scroll lock), not through a dependency between the two
  component packages.
- The docs must explain when to use Dialog, Drawer, and a plain `<aside>`.
- A non-modal drawer has no APG pattern of its own; its JSDoc must state the behavior chosen
  here.
- How the drawer reaches the top layer (native `<dialog>`, Popover API, or a portal) is decided
  separately in the overlay strategy ADR (#12).

## Revisit When

- The APG publishes a pattern for non-modal dialogs or drawers.
- Users commonly need a non-modal drawer that closes on outside interaction; then consider a
  prop to opt into it.
