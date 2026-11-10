# 0009. Enable styling through part components and data attributes

- Status: Accepted
- Date: 2026-11-10

## Context

As a headless UI library, we provide only behavior and accessibility, and let consumers decide the visual design freely.

## Considered Options

1. **A single component with props such as `classNames`** — One prop receives classes for each element. The element structure cannot be changed, and props grow large.
2. **Part components (compound components)** — The same approach as Radix UI. Consumers work with each element directly.

## Decision

- One part component per DOM element, exported as a namespace via `export * as Avatar from './avatar'` (`Avatar.Root`, `Avatar.Image`, ...).
- Parts share state through Context.
- The library does not output `class` or `style`.
- As styling hooks, every part outputs `data-leve-<name>-<part>` (the Root uses `data-leve-<name>`), plus `data-state` / `data-disabled` etc. where applicable.
- All received props are passed to the element, and attributes the library requires are written after `{...props}`.

## Rationale

- Consumers can add a `class` to each element or style with attribute selectors such as `[data-state="open"]`.
- It works with any CSS approach, including Tailwind CSS.

## Consequences

- More parts mean more markup for consumers.
- Detailed conventions are documented in `.agents/rules/component-architecture.md`.
