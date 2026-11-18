# 0038. Render parts as another element or component with an as prop

- Status: Proposed
- Date: 2026-11-18
- Related: [0009](0009-headless-parts-and-data-attributes.md), [0010](0010-no-child-state-on-parent-attributes.md), [0029](0029-render-overlays-in-place-in-the-top-layer-with-native-dialog-and-popover.md)

## Context

Every part renders one fixed element ([0009](0009-headless-parts-and-data-attributes.md)). Consumers sometimes need a part to render their own element or component while keeping the library's attributes (`data-leve-*`, `role`, `aria-*`, ids) and event handlers (#153):

- `Breadcrumb.Link` as Qwik City's `<Link>`, for client-side navigation and prefetching (#110, found on the docs site).
- Triggers (`Tooltip.Trigger`, `Popover.Trigger`, `Dialog.Trigger`, ...) as a link or as the app's own button component.
- Later: `Menu.Item` as a link, `Toolbar.Link` as `<Link>`, `Tabs.Trigger` as a link.

React libraries do this in three ways: `asChild` (Radix: the part clones its single child and merges props into it), an `as` prop (the part renders the given element or component), or a render prop. In Qwik 1:

- A `component$` receives children only through `<Slot />`, which projects them without exposing them, so it cannot clone a child and add props to it. Cloning needs either an inline component (a plain function, which cannot use hooks and is not lazy-loadable) or passing the child JSX as a prop to an inner `component$`, which then has to be serialized with the state.
- A render prop passed to a `component$` cannot cross serialization boundaries ([0035](0035-read-item-collections-from-the-dom-and-pick-the-focus-model-per-pattern.md) rejected data-driven render functions for the same reason).
- A `ref` set on a component is not forwarded to its element: a part that renders a consumer component cannot get the element through `ref`.

We built prototypes of `as` and `asChild` (an inline wrapper that passes the child JSX to an inner `component$`). Both rendered on the server in Qwik City and in the test DOM, put the library's attributes on the `<a>` rendered by Qwik City's `<Link>`, and merged the library's `onClick$` with `<Link>`'s own handlers in order (prefetch, then the library's handler, then client-side navigation). Whether client-side navigation was kept could not be judged reliably in the prototype page and has to be checked by E2E when a part adopts this.

## Considered Options

1. **`asChild`** — Familiar from Radix and shadcn/ui, and the child keeps its own JSX. In Qwik, every part that supports it needs an inline wrapper plus an inner `component$`, public parts stop being plain `component$`, the child JSX is serialized with the part's state, and the part must reject anything but a single child. Types for "the child's props plus ours" are hard to express.
2. **`as` prop** — `<Breadcrumb.Link as={Link} href="/components/">`. The part stays one `component$`: it renders `as` (an element name or a Qwik component) instead of its default element and passes all props to it, as it does today. No JSX cloning and nothing extra to serialize beyond the component reference, which Qwik serializes as a QRL.
3. **Render prop** — `<Breadcrumb.Link render={(props) => <Link {...props} />}>`. Cannot be passed to a `component$` in Qwik 1.
4. **Do nothing** — Consumers keep wrapping or rebuilding parts; Breadcrumb links keep reloading the page.

## Decision

We will let parts render another element or component with an **`as` prop**. We will not implement `asChild` or render props.

- `as` takes an element name (`'a'`, `'span'`, ...) or a Qwik component. Without it, the part renders its default element, so existing code does not change.
- The part passes all its props to what it renders, and still writes its required attributes (`role`, `aria-*`, `data-leve-*`, `data-state`, ids) after `{...props}` and merges event handlers as arrays (`[internal$, props.onClick$]`), as today ([0009](0009-headless-parts-and-data-attributes.md)).
- A component given to `as` must spread the props it receives onto **one** element, including `id`, `aria-*`, `data-*` and the `on*$` handlers (Qwik City's `<Link>` does). The docs of each part say so.
- Parts that support `as` must not depend on `ref` of their element, since a ref is not forwarded through a component. They find their element with its id instead (`getElementByIdInContainer` from `@leve-ui/utils`, #167). Toolbar items and `Popover.Anchor`, which use `ref` today, move to ids when they adopt `as`.
- Parts adopt `as` one by one, starting with `Breadcrumb.Link` (#110). Each part checks, with unit tests and E2E, that its attributes and keyboard behavior survive with a consumer component, and that a Qwik City `<Link>` keeps client-side navigation.
- `as` is typed as `keyof HTMLElementTagNameMap | Component<any>`. The other props stay typed as the default element's props; props that only the given component knows (e.g. `prefetch` of `<Link>`) are allowed through a loose index type on parts that support `as`.

## Rationale

- `as` fits Qwik: the part stays a single `component$`, hooks and context work as before, and nothing but a component reference is added to the serialized state.
- `asChild` would make every supporting part two components (an inline wrapper and an inner `component$`), give up lazy loading for the wrapper, serialize the child JSX with the part's state, and break the rule that public parts are `component$`. The familiarity does not outweigh that in Qwik.
- Render props do not cross serialization boundaries in Qwik 1.
- Adopting it part by part keeps each change small and lets every part prove, with tests, that its accessibility contract still holds.

## Consequences

- Consumers write `<Breadcrumb.Link as={Link} href="...">` instead of nesting their component inside the part. Code moved from Radix-style `asChild` has to be rewritten.
- Type checking of component-specific props given to a part is looser than for the default element.
- Components given to `as` must forward props to one element; a component that drops `id`, `aria-*` or `on*$` breaks the part, and the docs must say so.
- Parts that adopt `as` stop using `ref` on their element.
- Follow-up issues: #110 (`Breadcrumb.Link`), then triggers, `Toolbar.Button` / `Link`, `Tabs.Trigger`, `Menu.Item` as needed.

## Revisit When

- Qwik (e.g. Qwik 2) lets a `component$` read and clone its projected children, or forwards `ref` through components; `asChild` may then be cheap enough to offer.
