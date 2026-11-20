# @leve-ui/utils

## 0.2.0

### Minor Changes

- [#165](https://github.com/leve-ui/leve-ui/pull/165) [`5a6fb91`](https://github.com/leve-ui/leve-ui/commit/5a6fb91a80ad868a052e3081317cd23317d8a931) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Combobox, a text input with a listbox of suggestions (APG Combobox with list autocomplete). Focus stays in the input and the highlighted option is set with `aria-activedescendant`; you filter the items with `bind:inputValue`. `@leve-ui/utils` adds collection helpers (`getCollectionItems`, `getAdjacentItem`, `isItemDisabled`, `getItemTextValue`) and `itemId`.

- [#150](https://github.com/leve-ui/leve-ui/pull/150) [`ce76481`](https://github.com/leve-ui/leve-ui/commit/ce76481181ce8e4e2fe636a9c4ae82fe19187ce0) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Drawer, a non-modal dialog by default with a `modal` option. `@leve-ui/utils` adds `openDialogElement`, shared by Dialog and Drawer.

- [#143](https://github.com/leve-ui/leve-ui/pull/143) [`9bfd4ba`](https://github.com/leve-ui/leve-ui/commit/9bfd4ba224da9f270de85fca848859e316f8eb35) Thanks [@itkyk0926](https://github.com/itkyk0926)! - A disabled `Fieldset.Root` now disables the leve-ui form controls inside it (Checkbox, Switch, Radio Group, Toggle, Toggle Group and Field), like a native `<fieldset disabled>`, including nested fieldsets and the Legend exception.

- [#159](https://github.com/leve-ui/leve-ui/pull/159) [`e1e28cf`](https://github.com/leve-ui/leve-ui/commit/e1e28cfcd73185fed95e9eaa48f137294028892c) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add submenus (`Menu.Sub`, `Menu.SubTrigger`, `Menu.SubContent`). Tab now closes the whole menu. `openPopoverElement` accepts `initialFocus: false` and an `onOutsidePointerDown` callback.

- [#157](https://github.com/leve-ui/leve-ui/pull/157) [`de0c5ec`](https://github.com/leve-ui/leve-ui/commit/de0c5ecd8b448f61bc06cbe8d132a2b9c0063eb5) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Menu (items, groups, separators). `@leve-ui/utils` adds menu helpers (`getMenuItems`, `moveMenuFocus`, `getEdgeMenuItem`) and an `initialFocus` option for `openPopoverElement`.

- [#152](https://github.com/leve-ui/leve-ui/pull/152) [`b856cce`](https://github.com/leve-ui/leve-ui/commit/b856cce6e21a5362965885b4a2844f775c5c61f1) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Popover, a non-modal dialog attached to a button and positioned with Floating UI. `@leve-ui/utils` adds `openPopoverElement`, and floating elements now get `right: auto; bottom: auto; margin: 0` so that the browser styles of `[popover]` do not center them.

- [#190](https://github.com/leve-ui/leve-ui/pull/190) [`59c54a5`](https://github.com/leve-ui/leve-ui/commit/59c54a5ad994891ad0b697dd9be8ba9f565fca8d) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add the `as` prop to `Toolbar.Button` and `Toolbar.Link` to render another element or component (such as Qwik City's `<Link>`), and make `ref` optional in `useToolbarItem`.

- [#149](https://github.com/leve-ui/leve-ui/pull/149) [`2236905`](https://github.com/leve-ui/leve-ui/commit/22369057d7f8b67952fecfa8edef0d820762dd54) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Toolbar. Toggle and Toggle Group items inside a Toolbar join its roving tabindex automatically.

### Patch Changes

- [#171](https://github.com/leve-ui/leve-ui/pull/171) [`5bf8520`](https://github.com/leve-ui/leve-ui/commit/5bf852092038a5918039fc6b3b29ba918a4941d4) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Trap Option+Tab in modal dialogs and drawers too: it is how Safari users with the default macOS settings move through every item of a page. Ctrl+Tab and Cmd+Tab are still left to the browser and the OS.

- [#163](https://github.com/leve-ui/leve-ui/pull/163) [`21fb936`](https://github.com/leve-ui/leve-ui/commit/21fb936b3d407862659a41b783c535c84a2549fe) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add `Menu.ContextTrigger` for context menus: right click, Shift+F10, the ContextMenu key or a long press opens the menu at the pointer. `@leve-ui/utils` accepts a virtual anchor in `openPopoverElement`.

- [#169](https://github.com/leve-ui/leve-ui/pull/169) [`c5a6f68`](https://github.com/leve-ui/leve-ui/commit/c5a6f687097eafb90b39f259a2c83c556d30feb0) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Find the trigger and the other parts within the same Qwik container, so popups open next to the right trigger on pages with several containers, where Qwik's `useId()` repeats ids. `@leve-ui/utils` adds `getElementByIdInContainer`, also used by the Dialog and the Drawer.

## 0.1.0

### Minor Changes

- [#79](https://github.com/leve-ui/leve-ui/pull/79) [`12a7cf3`](https://github.com/leve-ui/leve-ui/commit/12a7cf304227d64f1aff0d8f03180a228476f859) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add live region announcer helpers (`announce`, `clearAnnouncer`, `destroyAnnouncer`) for accessible screen reader announcements.

- [#61](https://github.com/leve-ui/leve-ui/pull/61) [`1054c9f`](https://github.com/leve-ui/leve-ui/commit/1054c9faaa5ae1e23d79b56903e6589ea57a79de) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add `useControllableState` for components that support both `bind:<state>` and `default<State>`.

- [#80](https://github.com/leve-ui/leve-ui/pull/80) [`58ce06b`](https://github.com/leve-ui/leve-ui/commit/58ce06be270aa65bd5981f7586100774f184e753) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add `createDismissableLayer` helper and stack management for closing overlays on Escape, pointer down outside, or focus outside.

- [#63](https://github.com/leve-ui/leve-ui/pull/63) [`8e98698`](https://github.com/leve-ui/leve-ui/commit/8e98698a77b91c1e0cc9e41ac5660cc8af558b6b) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add `useFieldProvider`, `useFieldControl` and `useFieldContext` to wire a field's label, description and error message to its control (`id`, `aria-describedby`, `aria-invalid`, `disabled`, `required`).

- [#89](https://github.com/leve-ui/leve-ui/pull/89) [`fc1d77a`](https://github.com/leve-ui/leve-ui/commit/fc1d77aa17b4a4d5bae3c9f2e4fc928c0f518aff) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add `startFloating`, `computeFloating`, and `applyFloating` utilities wrapping `@floating-ui/dom` for floating element positioning.

- [#87](https://github.com/leve-ui/leve-ui/pull/87) [`7da83fb`](https://github.com/leve-ui/leve-ui/commit/7da83fb7768f80d378811d458809ea06c36cfe75) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add `createFocusScope` and `getTabbableElements` helpers for focus trapping and focus restoration.

- [#59](https://github.com/leve-ui/leve-ui/pull/59) [`c6f1710`](https://github.com/leve-ui/leve-ui/commit/c6f1710cd187cfdfe5947e821da7d138a84775ce) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add `clamp`, `valueToPercent` and `withCssVars` helpers.

- [#62](https://github.com/leve-ui/leve-ui/pull/62) [`1447654`](https://github.com/leve-ui/leve-ui/commit/1447654550ad381184afdb622918e70fa8462f0a) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add `moveRovingFocus` and `getRovingIndex` for roving `tabIndex` and arrow-key navigation (orientation, RTL, looping, Home / End, skipping disabled items).

- [#86](https://github.com/leve-ui/leve-ui/pull/86) [`cd1326c`](https://github.com/leve-ui/leve-ui/commit/cd1326c5ae38d66523fdb36c16ca457703e5ce21) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add reference-counted `lockScroll` and `getScrollLockCount` utilities with layout shift compensation for modal overlays.

- [#78](https://github.com/leve-ui/leve-ui/pull/78) [`6aba37a`](https://github.com/leve-ui/leve-ui/commit/6aba37a8d40eab866a333b97ed2c5a7e9ce38b81) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add typeahead navigation utilities (`getTypeaheadIndex`, `isTypeaheadKey`, `moveTypeaheadFocus`, and `resetTypeahead`) for moving focus to items by typing.
