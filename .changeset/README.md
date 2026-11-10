# Changesets

When you change a published package (`packages/**`), run `pnpm changeset` and commit the generated file with your change.

- Write the summary in English. It is copied into the package's CHANGELOG.
- Choose the bump type by the rules below.

## Choosing a Bump Type

**Until 1.0 (current), do not use `major`.** In Changesets, `major` on a `0.x` package jumps straight to `1.0.0`.

| Change | Until 1.0 (`0.x`) | After 1.0 |
| --- | --- | --- |
| Breaking change | `minor` | `major` |
| New feature | `minor` or `patch` | `minor` |
| Bug fix | `patch` | `patch` |

Releasing 1.0 is a maintainer decision. See `adr/0022`.

## Releasing

After the pull request is merged into `main`, the Release workflow opens (or updates) a
"chore(release): version packages" pull request that collects all pending changesets.
Merging that pull request publishes the packages to npm, so maintainers decide when to
release by choosing when to merge it. See `adr/0019` and `adr/0022` for details.
