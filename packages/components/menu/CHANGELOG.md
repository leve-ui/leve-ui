# @leve-ui/menu

## 0.1.1

### Patch Changes

- [#244](https://github.com/leve-ui/leve-ui/pull/244) [`5968301`](https://github.com/leve-ui/leve-ui/commit/596830120bf561c66273d07567ffbfa3ff087085) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Point package `homepage` to the leve-ui documentation site.
- Updated dependencies [[`6cf65fb`](https://github.com/leve-ui/leve-ui/commit/6cf65fb984cd20265913153b0de385ec33564ada), [`c73ac1c`](https://github.com/leve-ui/leve-ui/commit/c73ac1c163db3448c5ea2e862a640d44a2f5673b), [`5968301`](https://github.com/leve-ui/leve-ui/commit/596830120bf561c66273d07567ffbfa3ff087085)]:
  - @leve-ui/utils@0.3.0

## 0.1.0

### Minor Changes

- [#186](https://github.com/leve-ui/leve-ui/pull/186) [`d76b5cd`](https://github.com/leve-ui/leve-ui/commit/d76b5cdfc61a048ac23f0bcc1248322fe43ff180) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add the `as` prop to `Menu.Item` and `Menu.Trigger` to render another element or component (such as `<a>` or Qwik City's `<Link>`) while keeping the parts' attributes and keyboard interactions.

- [#158](https://github.com/leve-ui/leve-ui/pull/158) [`3b53a7e`](https://github.com/leve-ui/leve-ui/commit/3b53a7edb6942c0ea158ee0f5bd9881893a01ec6) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add `Menu.CheckboxItem`, `Menu.RadioGroup`, `Menu.RadioItem` and `Menu.ItemIndicator`.

- [#163](https://github.com/leve-ui/leve-ui/pull/163) [`21fb936`](https://github.com/leve-ui/leve-ui/commit/21fb936b3d407862659a41b783c535c84a2549fe) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add `Menu.ContextTrigger` for context menus: right click, Shift+F10, the ContextMenu key or a long press opens the menu at the pointer. `@leve-ui/utils` accepts a virtual anchor in `openPopoverElement`.

- [#159](https://github.com/leve-ui/leve-ui/pull/159) [`e1e28cf`](https://github.com/leve-ui/leve-ui/commit/e1e28cfcd73185fed95e9eaa48f137294028892c) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add submenus (`Menu.Sub`, `Menu.SubTrigger`, `Menu.SubContent`). Tab now closes the whole menu. `openPopoverElement` accepts `initialFocus: false` and an `onOutsidePointerDown` callback.

- [#157](https://github.com/leve-ui/leve-ui/pull/157) [`de0c5ec`](https://github.com/leve-ui/leve-ui/commit/de0c5ecd8b448f61bc06cbe8d132a2b9c0063eb5) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Menu (items, groups, separators). `@leve-ui/utils` adds menu helpers (`getMenuItems`, `moveMenuFocus`, `getEdgeMenuItem`) and an `initialFocus` option for `openPopoverElement`.

### Patch Changes

- [#169](https://github.com/leve-ui/leve-ui/pull/169) [`c5a6f68`](https://github.com/leve-ui/leve-ui/commit/c5a6f687097eafb90b39f259a2c83c556d30feb0) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Find the trigger and the other parts within the same Qwik container, so popups open next to the right trigger on pages with several containers, where Qwik's `useId()` repeats ids. `@leve-ui/utils` adds `getElementByIdInContainer`, also used by the Dialog and the Drawer.
- Updated dependencies [[`5a6fb91`](https://github.com/leve-ui/leve-ui/commit/5a6fb91a80ad868a052e3081317cd23317d8a931), [`ce76481`](https://github.com/leve-ui/leve-ui/commit/ce76481181ce8e4e2fe636a9c4ae82fe19187ce0), [`9bfd4ba`](https://github.com/leve-ui/leve-ui/commit/9bfd4ba224da9f270de85fca848859e316f8eb35), [`5bf8520`](https://github.com/leve-ui/leve-ui/commit/5bf852092038a5918039fc6b3b29ba918a4941d4), [`21fb936`](https://github.com/leve-ui/leve-ui/commit/21fb936b3d407862659a41b783c535c84a2549fe), [`e1e28cf`](https://github.com/leve-ui/leve-ui/commit/e1e28cfcd73185fed95e9eaa48f137294028892c), [`de0c5ec`](https://github.com/leve-ui/leve-ui/commit/de0c5ecd8b448f61bc06cbe8d132a2b9c0063eb5), [`c5a6f68`](https://github.com/leve-ui/leve-ui/commit/c5a6f687097eafb90b39f259a2c83c556d30feb0), [`b856cce`](https://github.com/leve-ui/leve-ui/commit/b856cce6e21a5362965885b4a2844f775c5c61f1), [`59c54a5`](https://github.com/leve-ui/leve-ui/commit/59c54a5ad994891ad0b697dd9be8ba9f565fca8d), [`2236905`](https://github.com/leve-ui/leve-ui/commit/22369057d7f8b67952fecfa8edef0d820762dd54)]:
  - @leve-ui/utils@0.2.0
