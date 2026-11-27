# @leve-ui/tags-input

## 0.1.0

### Minor Changes

- [#249](https://github.com/leve-ui/leve-ui/pull/249) [`cb304ac`](https://github.com/leve-ui/leve-ui/commit/cb304ac34e8690db8a80cd219f31665cb925b411) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Run `Combobox.Input`'s internal `keydown` handler before composed `onKeyDown$` handlers and mark handled `Enter`/`Escape` events; support composing `TagsInput.Control` and `TagsInput.Input` with `Combobox` via `as`, add controlled `bind:inputValue` and `allowCustomValue` props, and capture pasted text synchronously on first paste.

- [#239](https://github.com/leve-ui/leve-ui/pull/239) [`cd52a23`](https://github.com/leve-ui/leve-ui/commit/cd52a23b610f9d7b2e3ffee4f916839a606fb333) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add the `TagsInput` component (`@leve-ui/tags-input`) for entering, editing, and managing lists of tags with keyboard navigation, inline editing, paste splitting, and form/field integration.

### Patch Changes

- [#244](https://github.com/leve-ui/leve-ui/pull/244) [`5968301`](https://github.com/leve-ui/leve-ui/commit/596830120bf561c66273d07567ffbfa3ff087085) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Point package `homepage` to the leve-ui documentation site.
- Updated dependencies [[`6cf65fb`](https://github.com/leve-ui/leve-ui/commit/6cf65fb984cd20265913153b0de385ec33564ada), [`c73ac1c`](https://github.com/leve-ui/leve-ui/commit/c73ac1c163db3448c5ea2e862a640d44a2f5673b), [`5968301`](https://github.com/leve-ui/leve-ui/commit/596830120bf561c66273d07567ffbfa3ff087085)]:
  - @leve-ui/utils@0.3.0
