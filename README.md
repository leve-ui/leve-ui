<h1 align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./.github/assets/logo-light.svg">
    <source media="(prefers-color-scheme: light)" srcset="./.github/assets/logo-dark.svg">
    <img src="./.github/assets/logo-dark.svg" alt="leve-ui" width="320">
  </picture>
</h1>

<p align="center">Headless, WAI-ARIA compliant UI components for Qwik. Bring your own styles.</p>

<p align="center">
  <a href="https://github.com/leve-ui/leve-ui/actions/workflows/ci.yml"><img src="https://github.com/leve-ui/leve-ui/actions/workflows/ci.yml/badge.svg" alt="CI status"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
</p>

<p align="center">
  <a href="https://leve-ui.dev">Documentation</a> ·
  <a href="https://storybook.leve-ui.dev">Storybook</a> ·
  <a href="https://x.com/leve_ui">X (@leve_ui)</a>
</p>

## Features

- **Accessible** — Every component follows the [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/), including keyboard interaction and focus management, verified by E2E tests.
- **Unstyled** — Components ship no CSS. Each DOM element is a separate part you can style with classes or `data-*` attributes.
- **Install only what you use** — Every component is its own package, so your project only gets the components you install.
- **Built for Qwik & Web Standards** — Resumable, SSR-friendly, written with `component$`, and renders overlays in the browser's native top layer (`<dialog>` and the Popover API).

## Installation

Install individual components:

```sh
pnpm add @leve-ui/avatar
```

Or install everything at once:

```sh
pnpm add @leve-ui/core
```

Both expose the same API. Individual packages keep components you don't use out of your dependencies entirely — handy when you combine leve-ui with another component library.

## Usage

```tsx
import { component$ } from '@builder.io/qwik';
import { Avatar } from '@leve-ui/avatar';

export default component$(() => (
  <Avatar.Root class="avatar">
    <Avatar.Image src="/me.png" alt="Jane Doe" />
    <Avatar.Fallback>JD</Avatar.Fallback>
  </Avatar.Root>
));
```

Style each part however you like, for example with data attributes:

```css
.avatar [data-leve-avatar-fallback] { /* ... */ }
.avatar [data-leve-avatar-image][data-state='loaded'] { /* ... */ }
```

## Packages

| Package | Description |
| --- | --- |
| [`@leve-ui/core`](./packages/core) | All components in one package |
| [`@leve-ui/avatar`](./packages/components/avatar) | An image element with a fallback for representing the user |
| [`@leve-ui/separator`](./packages/components/separator) | Visually or semantically separates content |
| [`@leve-ui/label`](./packages/components/label) | Accessible label for a custom control |
| [`@leve-ui/fieldset`](./packages/components/fieldset) | Groups related form controls under a single legend |
| [`@leve-ui/progress`](./packages/components/progress) | Shows how far a task has progressed, including an indeterminate state |
| [`@leve-ui/meter`](./packages/components/meter) | Shows a scalar value within a known range, such as storage usage |
| [`@leve-ui/alert`](./packages/components/alert) | Displays an important inline message without moving focus |
| [`@leve-ui/breadcrumb`](./packages/components/breadcrumb) | Shows the current page's location within a hierarchy |
| [`@leve-ui/toggle`](./packages/components/toggle) | A two-state button that can be toggled on or off |
| [`@leve-ui/field`](./packages/components/field) | Label, description and error message wiring for form controls |
| [`@leve-ui/switch`](./packages/components/switch) | A control that toggles a setting on or off |
| [`@leve-ui/checkbox`](./packages/components/checkbox) | A control that toggles between checked, unchecked, or indeterminate states |
| [`@leve-ui/collapsible`](./packages/components/collapsible) | An interactive component that can be expanded or collapsed |
| [`@leve-ui/radio-group`](./packages/components/radio-group) | A set of checkable buttons where only one item can be checked at a time |
| [`@leve-ui/tabs`](./packages/components/tabs) | A set of layered sections of content that display one panel at a time |
| [`@leve-ui/accordion`](./packages/components/accordion) | A vertically stacked set of headings that each reveal a section of content |
| [`@leve-ui/toggle-group`](./packages/components/toggle-group) | A set of two-state buttons that can be toggled on or off, with single or multiple selection |
| [`@leve-ui/dialog`](./packages/components/dialog) | A modal window that asks the user for input or a decision |
| [`@leve-ui/toolbar`](./packages/components/toolbar) | A row of controls, such as buttons and toggles, with one tab stop |
| [`@leve-ui/drawer`](./packages/components/drawer) | A panel that slides in from an edge of the screen, such as a detail panel |
| [`@leve-ui/popover`](./packages/components/popover) | A small panel that opens next to a button, such as settings or filters |
| [`@leve-ui/tooltip`](./packages/components/tooltip) | A short description that appears when a button is hovered or focused |
| [`@leve-ui/hover-card`](./packages/components/hover-card) | A preview of a link's content, shown when the link is hovered or focused |
| [`@leve-ui/menu`](./packages/components/menu) | A list of actions that opens from a button, or at the pointer as a context menu |
| [`@leve-ui/toast`](./packages/components/toast) | Short messages added from code, stacked and announced |
| [`@leve-ui/combobox`](./packages/components/combobox) | A text input with a list of suggestions to pick from |
| [`@leve-ui/password-input`](./packages/components/password-input) | Password field with a visibility toggle button. |

## Inspirations

The component API design — composable parts, `data-state` styling hooks, and polymorphic `as` props — is inspired by [Ark UI](https://ark-ui.com/), [Base UI](https://base-ui.com/), and [Radix UI](https://www.radix-ui.com/), built from the ground up for Qwik's resumability and native web platform features.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.

Design decisions are recorded in [`adr/`](./adr/README.md).

## License

[MIT](./LICENSE)
