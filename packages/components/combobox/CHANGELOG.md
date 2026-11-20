# @leve-ui/combobox

## 0.1.0

### Minor Changes

- [#168](https://github.com/leve-ui/leve-ui/pull/168) [`58bbd91`](https://github.com/leve-ui/leve-ui/commit/58bbd914cbb0b13093f63c60fa9a52af6c3deff3) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add `Combobox.ClearTrigger`, the `openOnClick` prop, and a `reason` (`'input'`, `'select'`, `'clear'` or `'blur'`) passed to `onInputValueChange$`, so you can filter only while the user types and show all items when the listbox opens again after a selection.

- [#165](https://github.com/leve-ui/leve-ui/pull/165) [`5a6fb91`](https://github.com/leve-ui/leve-ui/commit/5a6fb91a80ad868a052e3081317cd23317d8a931) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Combobox, a text input with a listbox of suggestions (APG Combobox with list autocomplete). Focus stays in the input and the highlighted option is set with `aria-activedescendant`; you filter the items with `bind:inputValue`. `@leve-ui/utils` adds collection helpers (`getCollectionItems`, `getAdjacentItem`, `isItemDisabled`, `getItemTextValue`) and `itemId`.

### Patch Changes

- [#169](https://github.com/leve-ui/leve-ui/pull/169) [`c5a6f68`](https://github.com/leve-ui/leve-ui/commit/c5a6f687097eafb90b39f259a2c83c556d30feb0) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Find the trigger and the other parts within the same Qwik container, so popups open next to the right trigger on pages with several containers, where Qwik's `useId()` repeats ids. `@leve-ui/utils` adds `getElementByIdInContainer`, also used by the Dialog and the Drawer.
- Updated dependencies [[`5a6fb91`](https://github.com/leve-ui/leve-ui/commit/5a6fb91a80ad868a052e3081317cd23317d8a931), [`ce76481`](https://github.com/leve-ui/leve-ui/commit/ce76481181ce8e4e2fe636a9c4ae82fe19187ce0), [`9bfd4ba`](https://github.com/leve-ui/leve-ui/commit/9bfd4ba224da9f270de85fca848859e316f8eb35), [`5bf8520`](https://github.com/leve-ui/leve-ui/commit/5bf852092038a5918039fc6b3b29ba918a4941d4), [`21fb936`](https://github.com/leve-ui/leve-ui/commit/21fb936b3d407862659a41b783c535c84a2549fe), [`e1e28cf`](https://github.com/leve-ui/leve-ui/commit/e1e28cfcd73185fed95e9eaa48f137294028892c), [`de0c5ec`](https://github.com/leve-ui/leve-ui/commit/de0c5ecd8b448f61bc06cbe8d132a2b9c0063eb5), [`c5a6f68`](https://github.com/leve-ui/leve-ui/commit/c5a6f687097eafb90b39f259a2c83c556d30feb0), [`b856cce`](https://github.com/leve-ui/leve-ui/commit/b856cce6e21a5362965885b4a2844f775c5c61f1), [`59c54a5`](https://github.com/leve-ui/leve-ui/commit/59c54a5ad994891ad0b697dd9be8ba9f565fca8d), [`2236905`](https://github.com/leve-ui/leve-ui/commit/22369057d7f8b67952fecfa8edef0d820762dd54)]:
  - @leve-ui/utils@0.2.0
