# 0026. Participate in native forms through a HiddenInput part

- Status: Accepted
- Date: 2026-11-11
- Related: [0009](0009-headless-parts-and-data-attributes.md), [0024](0024-wire-field-ids-and-descriptions-from-the-field-root.md)

## Context

Several controls cannot be built from a single native form element because consumers need to style inner parts: Switch (`<button role="switch">` with a Thumb), and later Checkbox, Radio Group, Slider and Select. A `<button>` or `role`-based element does not take part in `<form>` submission, `FormData`, constraint validation (`required`) or the `form` attribute.

Two constraints shape the solution:

- A `<button>` must not contain interactive content, so an `<input>` cannot be placed inside the control.
- Parts share state through a context provided by the Root (see [0009](0009-headless-parts-and-data-attributes.md)), so anything outside the Root cannot read the state.

## Considered Options

1. **Root wrapper + HiddenInput part** — The Root is a non-interactive wrapper (`<div>`) that owns the state. The interactive element is a separate `Control` part, and a `HiddenInput` part renders a native `<input>` next to it. One DOM element per part; consumers pass `name` / `value` / `form` directly to the input they can see in their markup.
2. **Root is the control and renders a hidden input implicitly** — The Root renders `<button>` and a sibling `<input>` as a fragment when `name` is given (Radix's approach). Fewer parts, but the input is not a part, its props must be tunnelled through the Root, and the Root's props mix button and input attributes (`name` and `value` exist on both).
3. **Use the native input itself as the control** — e.g. `<input type="checkbox" role="switch">`. Form participation is free, but a void element cannot contain a Thumb part, so styling requires `appearance: none` and pseudo-elements, which defeats the part-based styling model.

## Decision

We will make controls that are not native form elements participate in forms through a `HiddenInput` part:

- The Root is a non-interactive wrapper that owns the state and provides the context. The interactive element is a separate `Control` part.
- `HiddenInput` renders a native `<input>` (e.g. `type="checkbox"`) inside the Root and outside the Control. Consumers pass `name`, `value` and `form` to it; the library writes the state (`checked`, `required`, `disabled`) after `{...props}`.
- `HiddenInput` is hidden from assistive technology and the tab order (`aria-hidden="true"`, `tabIndex={-1}`). It is hidden visually with a minimal inline style (`position: absolute; opacity: 0; pointer-events: none; margin: 0`) instead of the `hidden` attribute, so that native constraint validation of `required` still works. This is an allowed functional inline style.
- `HiddenInput` is optional. Without it the control works the same, but does not submit a value.

## Rationale

Option 1 keeps "one DOM element = one part", lets consumers see and control the form attributes in their own markup, and gives every future form control (Checkbox, Radio Group, Slider, Select) the same shape. Option 2 hides an element and overloads the Root's props. Option 3 removes the Thumb part and the styling hooks consumers rely on.

## Consequences

- Controls of this kind have an extra wrapper element (the Root) compared with a button-only Root.
- The Control part, not the Root, uses `useFieldControl` ([0024](0024-wire-field-ids-and-descriptions-from-the-field-root.md)), so `Field.Label` points at the interactive element.
- Native `required` validation messages are anchored to the hidden input, whose position follows the Root.
- Resetting the control on a form `reset` event is not covered by this decision and must be added separately.

## Revisit When

- Form-associated custom elements (`ElementInternals`) become usable from Qwik components, allowing the Control itself to join forms.
