# 0037. Add toasts through a provider context and render them with consumer markup

- Status: Proposed
- Date: 2026-11-17
- Related: [0009](0009-headless-parts-and-data-attributes.md), [0010](0010-no-child-state-on-parent-attributes.md)

## Context

Toast (#41) is the first leve-ui component whose items are added from code (`add({ title: 'Saved' })`) rather than declared in JSX. Other libraries do this in two ways:

- Ark UI / Zag.js create a toaster at module level (`createToaster()`) and render toasts with a render prop (`<Toaster toaster={toaster}>{(toast) => <Toast.Root />}</Toaster>`). The toaster can be called from anywhere, including code outside components, and the library computes the stacking layout.
- Radix UI declares each toast in JSX (`<Toast.Root bind:open>`); the consumer keeps the queue.

In Qwik 1:

- A `component$` receives children only through `<Slot />`, which cannot pass arguments, so a render prop needs an inline component, which cannot use hooks and is not allowed for public parts.
- Module-level state is shared between all requests on the server and is not serialized, so a toast added on the server would leak to other users and be lost when the page resumes. Qwik 1 has no module-level signals.

## Considered Options

1. **A module-level toaster and a render prop (Ark UI)** — Least code for consumers and callable from anywhere. Shares state between requests on the server, is not resumable, and needs an inline component.
2. **Declarative toasts (Radix UI)** — Small API, but each consumer has to keep a queue to show several toasts.
3. **A provider context and consumer markup** — `Toast.Provider` keeps the toasts in a signal in context; `useToaster()` returns `toasts`, `add$`, `update$` and `dismiss$`; the consumer maps `toasts` to `Toast.Root` inside `Toast.Region` / `Toast.List`.

## Decision

We will use option 3.

- `Toast.Provider` renders no element. It holds the toasts (`ToastData[]`, oldest first) in a signal and the settings (`duration`, `placement`, `swipeDirection`, `swipeThreshold`, `hotkey`). Ids are made in `add$`, at run time only.
- `useToaster<T>()` returns `{ toasts, add$, update$, dismiss$ }`. `data?: T` carries consumer data (it must be serializable).
- The consumer renders the toasts: `toaster.toasts.value.map((toast) => <Toast.Root key={toast.id} toast={toast}>…)`.
- A closed toast stays in the list with `open: false` (`data-state="closed"`) until its CSS animations finish, then it is removed.
- From Ark UI we take the stacking output: each `Toast.Root` outputs `--leve-toast-index` (0 is the newest), `--leve-toast-count`, `--leve-toast-front-offset`, `--leve-toast-height`, `--leve-toast-front-height` and `data-front`; the Region, the List and the toasts output `data-placement` and `data-expanded` (pointer over or focus in the Region). Stacked and expanded layouts are written in CSS.
- Toasts are announced with `announce()` from `@leve-ui/utils`, not by making each toast a live region, since live regions inserted into the page are not reliably announced.

## Rationale

- Context and signals are created per request and serialized, so toasts added on the server resume on the client, and nothing is shared between users.
- The consumer owns the list markup, so different kinds of toasts can have different parts without the library knowing about them.
- The stacking variables give the layout benefits of Ark UI without the library owning the markup or the styles ([0009](0009-headless-parts-and-data-attributes.md)). They are on the toasts, not on the Region, since they come from measured children ([0010](0010-no-child-state-on-parent-attributes.md)).
- Option 1 was rejected for the server-side sharing and the lack of resumability; option 2 for the queue it leaves to every consumer.

## Consequences

- A `Toast.Provider` must wrap both the components that add toasts and the `Toast.Region`, usually at the app root.
- `add$` is a QRL: code outside components can call it only when it is passed in.
- Future components with items added from code (e.g. a global confirm dialog) should follow the same shape: a provider with a signal, a `use*` hook returning QRLs, and consumer markup.

## Revisit When

- Qwik 2 adds module-level signals that are serialized and scoped per request.
