# 0004. Adopt Qwik 1.x and pin Vite 7 / TypeScript 5.9

- Status: Accepted
- Date: 2026-11-10

## Context

As of November 2026, Qwik 1.x (`@builder.io/qwik` 1.20.x) is the stable release and Qwik 2.x (`@qwik.dev/core`) is a release candidate. The latest tooling is Vite 8 and TypeScript 7.

## Considered Options

1. **Qwik 2.x (RC)** — The future mainline, but its API is not final and ecosystem support is incomplete.
2. **Qwik 1.x (stable)** — Proven, with Storybook and Qwik City support in place.

## Decision

- We will use Qwik 1.x (`@builder.io/qwik`, `@builder.io/qwik-city`).
- We will pin Vite to 7.x, because Qwik 1.x declares `vite >=5 <8` as a peer dependency.
- We will pin TypeScript to 5.9.x, because the official Qwik templates use 5.x and tooling compatibility with 7.x (the native implementation) is unverified.

## Rationale

A library is embedded in consumers' projects, so aligning with stable releases takes priority.

## Consequences

- Upgrading to Vite 8 or TypeScript 6/7 requires revisiting this ADR first.
- Migrating to Qwik 2.x changes package names (`@qwik.dev/*`) and some APIs, which is a breaking change.

## Revisit When

- Qwik 2.x reaches a stable release.
- Qwik 1.x adds support for Vite 8.
