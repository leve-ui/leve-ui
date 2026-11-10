# Changesets

When you change a published package (`packages/**`), run `pnpm changeset` and commit the generated file with your change.

- Write the summary in English. It is copied into the package's CHANGELOG.
- Use `patch` for fixes, `minor` for new features, and `major` for breaking changes.

After the pull request is merged into `main`, the Release workflow opens (or updates) a
"chore(release): version packages" pull request. Merging that pull request publishes the
packages to npm. See `adr/0019` for details.
