# 0016. License under MIT

- Status: Accepted
- Date: 2026-11-10

## Context

levis-ui will be published to npm, which requires a license. As a UI library, it is embedded in consumers' applications, including commercial ones, so the license should not create friction for adoption.

## Considered Options

1. **MIT** — Short and permissive. The de facto standard for UI libraries (Radix UI, Headless UI, Qwik).
2. **Apache-2.0** — Permissive with an explicit patent grant, but longer and less common among frontend UI libraries.
3. **Copyleft (e.g. MPL-2.0)** — Requires sharing modifications, which can deter adoption in commercial products.

## Decision

We will license all published packages under the MIT License, with the copyright holder "levis-ui contributors".

- The root `LICENSE` is the source of truth.
- Every published package sets `"license": "MIT"` in `package.json` and contains a copy of `LICENSE` in its own directory.
- The component scaffold (`create-component` skill) applies both automatically.

## Rationale

- MIT matches the ecosystem consumers already use, so legal review is rarely needed.
- npm includes only the `LICENSE` file in the package's own directory, so a root-only `LICENSE` would not ship with individual packages.

## Consequences

- When the root `LICENSE` changes, every package copy must be updated to match.
- Contributions are accepted under the same license.
