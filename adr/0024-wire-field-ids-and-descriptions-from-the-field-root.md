# 0024. Wire field ids and descriptions from the Field root

- Status: Accepted
- Date: 2026-11-11
- Related: [0010](0010-no-child-state-on-parent-attributes.md)

## Context

`Field` wraps a form control with a label, a description and an error message. The control needs `id` (for `<label for>`), `aria-describedby`, `aria-invalid`, `disabled` and `required`. Every form control (Checkbox, Switch, Radio Group, Select, ...) must join a Field the same way, so the wiring lives in `@leve-ui/utils` as a context (component packages must not depend on each other).

In Qwik SSR, parts are emitted in document order. A typical Field renders `Label`, then the control, then `Description` and `ErrorMessage`. This causes two problems, for the same reason as [0010](0010-no-child-state-on-parent-attributes.md):

1. When the control is emitted, it is not yet known whether a `Description` will follow, so it cannot decide whether to reference it in `aria-describedby`.
2. If the consumer passes `id` to the control, `Label` has already been emitted with a different `for`.

## Considered Options

1. **Declare everything on the Root** — `Field.Root` owns the ids (overridable with an `ids` prop), `invalid` / `disabled` / `required`, and whether a description is present (`hasDescription`). The control references the error message only while `invalid` is true.
2. **Always reference the description id** — Simplest API, but a Field without `Description` points `aria-describedby` at an id that does not exist, which accessibility checkers may report.
3. **Register parts on the client** — `Description` registers itself in the context when it renders. Accurate after hydration, but the SSR output lacks `aria-describedby` until JavaScript runs, and it needs client re-rendering.
4. **Let the control's `id` win inside a Field** — `Label` cannot see it during SSR, so the label is not associated until the client re-renders.

## Decision

We will make `Field.Root` the single source of truth for field wiring:

- The Root generates the ids with `useId()` (`control`, `label`, `description`, `errorMessage`). Consumers override them with the Root's `ids` prop, not on individual parts.
- The Root owns `invalid`, `disabled`, `required` and `hasDescription`.
- A control inside a Field uses the Field's control id and references the description id only when `hasDescription` is true, and the error message id only when `invalid` is true. Ids the consumer passes in `aria-describedby` are kept.
- A control outside a Field uses its own `id` prop, or `useId()` when none is given.

`@leve-ui/utils` provides this as `useFieldProvider` (for the Root) and `useFieldControl` (for controls).

## Rationale

All decisions are made on the Root, which is emitted before every part, so SSR output and client state always match and `aria-describedby` never points at a missing element. Option 2 leaves dangling references, option 3 breaks SSR output and resumability, and option 4 breaks the label association during SSR.

## Consequences

- Consumers who use `Field.Description` must also set `hasDescription` on `Field.Root`. The Field docs and stories must show this.
- `Field.ErrorMessage` should render only while the field is invalid, matching the `aria-describedby` reference.
- Every form control must read the field context through `useFieldControl` and must work without an enclosing Field.
- Custom ids inside a Field are set only through the Root's `ids` prop.

## Revisit When

- Qwik supports updating already-emitted SSR attributes (e.g. out-of-order streaming), making client-side registration SSR-safe.
