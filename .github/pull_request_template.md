<!--
The PR title becomes the commit message on main (squash merge).
Use English Conventional Commits, e.g. "feat(avatar): add delayMs to Fallback".
-->

## Summary

<!-- What does this PR change, and why? Link related issues (e.g. "Closes #123"). -->

## Checklist

- [ ] I added a changeset (`pnpm changeset`) with an English summary, or this PR doesn't change a published package
- [ ] `pnpm check:fix`, `pnpm typecheck`, and `pnpm test` pass locally

### For component changes

- [ ] Follows the WAI-ARIA APG pattern: <!-- link, e.g. https://www.w3.org/WAI/ARIA/apg/patterns/dialog/ -->
- [ ] Keyboard interaction and focus management are implemented
- [ ] Each DOM element is a separate part with `data-leve-*` attributes, and no styles are output
- [ ] Unit tests, stories, and E2E tests are added or updated
