<h1 align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./.github/assets/logo-light.svg">
    <source media="(prefers-color-scheme: light)" srcset="./.github/assets/logo-dark.svg">
    <img src="./.github/assets/logo-dark.svg" alt="levis-ui" width="320">
  </picture>
</h1>

<p align="center">Headless, WAI-ARIA compliant UI components for Qwik. Bring your own styles.</p>

<p align="center">
  <a href="https://github.com/levis-ui/levis-ui/actions/workflows/ci.yml"><img src="https://github.com/levis-ui/levis-ui/actions/workflows/ci.yml/badge.svg" alt="CI status"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
</p>

## Features

- **Accessible** — Every component follows the [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/), including keyboard interaction and focus management.
- **Unstyled** — Components ship no CSS. Each DOM element is a separate part you can style with classes or `data-*` attributes.
- **Install only what you use** — Every component is its own package, so your project only gets the components you install.
- **Built for Qwik** — Resumable, SSR-friendly, and written with `component$`.

## Installation

Install individual components:

```sh
pnpm add @levis-ui/avatar
```

Or install everything at once:

```sh
pnpm add levis-ui
```

Both expose the same API. Individual packages keep components you don't use out of your dependencies entirely — handy when you combine levis-ui with another component library.

## Usage

```tsx
import { component$ } from '@builder.io/qwik';
import { Avatar } from '@levis-ui/avatar';

export default component$(() => (
  <Avatar.Root class="avatar">
    <Avatar.Image src="/me.png" alt="Jane Doe" />
    <Avatar.Fallback>JD</Avatar.Fallback>
  </Avatar.Root>
));
```

Style each part however you like, for example with data attributes:

```css
.avatar [data-levis-avatar-fallback] { /* ... */ }
.avatar [data-levis-avatar-image][data-state='loaded'] { /* ... */ }
```

## Packages

| Package | Description |
| --- | --- |
| [`levis-ui`](./packages/levis-ui) | All components in one package |
| [`@levis-ui/avatar`](./packages/components/avatar) | An image element with a fallback for representing the user |

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.

Design decisions are recorded in [`adr/`](./adr/README.md).

## License

[MIT](./LICENSE)
