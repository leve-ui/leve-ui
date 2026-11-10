# 0008. Run E2E tests against Storybook

- Status: Accepted
- Date: 2026-11-10

## Context

Accessibility-related behavior such as keyboard interaction and focus movement must be verified in a real browser, which requires pages that render the components under test.

## Considered Options

1. **A dedicated test app** — Flexible, but test pages must be written and maintained separately from stories.
2. **Test against the docs site** — Covers SSR, but documentation changes easily break tests.
3. **Test against Storybook** — Stories double as test targets and can be rendered in isolation via `/iframe.html?id=<story-id>`.

## Decision

We will use Playwright to open each Storybook story via `iframe.html`. Storybook is started automatically by Playwright's `webServer`.

## Rationale

Stories and test targets stay in sync, and no separate test pages need to be maintained.

## Consequences

- Storybook for E2E runs on port 6106. The default development port 6006 collided with another project's Storybook, and tests once connected to the wrong server. The port can be changed with `E2E_PORT`.
- Every state to be tested must exist as a story.
- SSR-related behavior cannot be verified by these E2E tests ([0007](0007-storybook-csr-mode.md)).
