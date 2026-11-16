# 0035. Read item collections from the DOM and pick the focus model per pattern

- Status: Accepted
- Date: 2026-11-16
- Related: [0010](0010-no-child-state-on-parent-attributes.md), [0029](0029-render-overlays-in-place-in-the-top-layer-with-native-dialog-and-popover.md)

## Context

Menu, Context Menu, Listbox, Select, Combobox and Tree View are made of a root and many item
parts. They need to know, for keyboard interaction:

- the **order** of the items (arrow keys, Home / End),
- which items are **disabled** (they are skipped),
- the **text** of each item (typeahead, and the label shown by a Select),
- the items that exist **now** (items are added and removed while the popup is open, e.g.
  filtered Combobox options).

They also need a **focus model**. The APG uses two:

- **Roving focus**: DOM focus moves to the item (Menu, Menubar, Radio Group, Tabs).
- **`aria-activedescendant`**: DOM focus stays on one element (the Combobox input, the
  Select trigger, or the listbox), and that element points to the highlighted item by id.

Qwik makes some common solutions expensive:

- Parent attributes are rendered before their children in SSR, so a root cannot render state
  that depends on its items (adr/0010).
- A registration store (each item pushes itself into a root context store on render) works,
  but the order of registration is not the DOM order after items are added, removed or
  reordered, so it has to be sorted against the DOM anyway. Radio Group and Tabs do this
  today, and Radio Group had a bug because its sort looked at the whole document (#118).
- Data-driven collections (`items={[...]}` plus a render function) do not fit Qwik well:
  render functions passed to `component$` cannot cross serialization boundaries, and the
  consumer would lose the part-per-element markup that the rest of leve-ui uses (adr/0009).

`@leve-ui/utils` already has DOM-based helpers: `moveRovingFocus(event, items)` and
`moveTypeaheadFocus(event, items)` take the item elements at event time.

## Considered Options

1. **Registration store as the source of truth** — Items register `{ value, disabled, text }`
   in a root store, sorted by DOM position. Works during SSR for some state, but needs
   cleanup on unmount, sorting on every change, and duplicates what the DOM already knows.
2. **DOM as the source of truth** — At interaction time, query the item elements inside the
   root (excluding nested collections) and read order, `data-disabled` and the text value
   from them. No registration. State that the SSR needs is designed so that it does not
   depend on the other items.
3. **Data-driven collection** — Items are passed as data with a render function. Easy to
   virtualize and to know everything up front, but does not fit Qwik's serialization and
   breaks the one-part-per-element API.

For the focus model:

- **A. Roving focus everywhere** — One model, but a Combobox must keep focus in its input,
  so it cannot use it.
- **B. `aria-activedescendant` everywhere** — One model, but menus are expected to move DOM
  focus to items, and screen reader support for `aria-activedescendant` is weaker outside
  combobox / listbox.
- **C. Follow the APG pattern of each component** — Roving focus where the APG pattern moves
  focus, `aria-activedescendant` where focus must stay on one element.

## Decision

We will use **the DOM as the source of truth for item collections** (option 2):

- Every item part renders `data-leve-<name>-item` (or its own part attribute) and a required
  string `value`. The collection is read at interaction time with a shared helper in
  `@leve-ui/utils` that returns the item elements of a root **in DOM order, excluding items of
  nested collections of the same kind** (the scoping fixed in #118).
- **Disabled** items render `data-disabled` and are skipped by navigation and typeahead.
- The **text value** of an item is its `textValue` prop when given (rendered as
  `data-text-value`), otherwise its trimmed text content. It is used by typeahead and by a
  Select to show the selected label.
- Items do **not** register in a root store. Components may keep a small store only for
  state that must be known before interaction and cannot be derived from the item's own
  props; such a store must be scoped to its root and sorted by DOM position.
- Item element ids that the root needs (for `aria-activedescendant` or `aria-controls`) are
  derived from the root id and the item value with an **injective** encoding, so that two
  different values never produce the same id (`safeId` in Tabs maps `"a b"` and `"a-b"` to the
  same id; it will move to the shared helper).

We will choose the **focus model per APG pattern** (option C):

| Component | Focus model |
| --- | --- |
| Menu, Context Menu, Menubar | Roving focus (`moveRovingFocus`, `moveTypeaheadFocus`) |
| Tree View | Roving focus |
| Listbox (standalone) | `aria-activedescendant` on the listbox, as in the APG example |
| Select (select-only combobox), Combobox | `aria-activedescendant` on the trigger / input |

- With `aria-activedescendant`, the root keeps the **highlighted value** in a signal; items
  render `data-highlighted` from it and the trigger / input points to the derived item id.
  The highlighted item is scrolled into view on change.
- Items in a roving-focus popup (Menu) render `tabIndex={-1}`; focus is moved into the popup
  when it opens, so no item needs to know whether it is the first one during SSR.

We will not support virtualized collections for now.

## Rationale

- The DOM already has the order, the disabled state and the text, and it is always current,
  including after items are added, removed or reordered. Reading it at event time removes the
  registration, cleanup and sorting code, and the class of bugs it caused.
- The helpers we already ship (`moveRovingFocus`, `moveTypeaheadFocus`) are DOM-based, so the
  collection helper fits them.
- Designing SSR state that does not depend on sibling items follows adr/0010 and keeps the
  resumed DOM equal to the SSR output.
- The APG uses different focus models for menus and for comboboxes on purpose; following it
  gives the behavior screen reader users expect. Listbox shares the `aria-activedescendant`
  model with Select and Combobox, so the option logic is written once.
- A data-driven API is rejected because it does not fit Qwik's serialization and would make
  item-based components look different from every other leve-ui component.

## Consequences

- `@leve-ui/utils` gets a collection helper (items of a root in DOM order, disabled state,
  text value) and an injective id helper. Radio Group, Tabs and Toggle Group can move to them
  later; Tabs' `safeId` is replaced.
- Item parts take a required `value: string` and an optional `textValue`.
- Navigation code must not cache the item list across events.
- Components with `aria-activedescendant` must keep the highlighted item visible
  (`scrollIntoView({ block: 'nearest' })`) and clear the highlight when its item disappears.
- Very large lists may be slow, since there is no virtualization.

## Revisit When

- A component needs virtualization (e.g. a Combobox with thousands of options).
- Qwik offers a way to render collections from data that keeps parts as components.
- Screen reader support for `aria-activedescendant` changes the trade-off for Listbox.
