# @leve-ui/core

## 0.2.0

### Minor Changes

- [#165](https://github.com/leve-ui/leve-ui/pull/165) [`5a6fb91`](https://github.com/leve-ui/leve-ui/commit/5a6fb91a80ad868a052e3081317cd23317d8a931) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Combobox, a text input with a listbox of suggestions (APG Combobox with list autocomplete). Focus stays in the input and the highlighted option is set with `aria-activedescendant`; you filter the items with `bind:inputValue`. `@leve-ui/utils` adds collection helpers (`getCollectionItems`, `getAdjacentItem`, `isItemDisabled`, `getItemTextValue`) and `itemId`.

- [#144](https://github.com/leve-ui/leve-ui/pull/144) [`3bed535`](https://github.com/leve-ui/leve-ui/commit/3bed5357ab81df6de1440f2f574bb05a94375c5c) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Dialog, a modal dialog rendered in place with the native `<dialog>` and `showModal()`.

- [#150](https://github.com/leve-ui/leve-ui/pull/150) [`ce76481`](https://github.com/leve-ui/leve-ui/commit/ce76481181ce8e4e2fe636a9c4ae82fe19187ce0) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Drawer, a non-modal dialog by default with a `modal` option. `@leve-ui/utils` adds `openDialogElement`, shared by Dialog and Drawer.

- [#155](https://github.com/leve-ui/leve-ui/pull/155) [`1911bbd`](https://github.com/leve-ui/leve-ui/commit/1911bbdd33d1822b96938f47a86a8a071ddaad7d) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Hover Card, a preview of a link shown on hover and focus, kept open while the pointer is on it.

- [#157](https://github.com/leve-ui/leve-ui/pull/157) [`de0c5ec`](https://github.com/leve-ui/leve-ui/commit/de0c5ecd8b448f61bc06cbe8d132a2b9c0063eb5) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Menu (items, groups, separators). `@leve-ui/utils` adds menu helpers (`getMenuItems`, `moveMenuFocus`, `getEdgeMenuItem`) and an `initialFocus` option for `openPopoverElement`.

- [#152](https://github.com/leve-ui/leve-ui/pull/152) [`b856cce`](https://github.com/leve-ui/leve-ui/commit/b856cce6e21a5362965885b4a2844f775c5c61f1) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Popover, a non-modal dialog attached to a button and positioned with Floating UI. `@leve-ui/utils` adds `openPopoverElement`, and floating elements now get `right: auto; bottom: auto; margin: 0` so that the browser styles of `[popover]` do not center them.

- [#164](https://github.com/leve-ui/leve-ui/pull/164) [`9a498fb`](https://github.com/leve-ui/leve-ui/commit/9a498fb28edeabbcad8a631502d709206ff3594e) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Toast: `Toast.Provider` and `useToaster()` add toasts from code, and you render them with `Toast.Region`, `Toast.List` and `Toast.Root`. Toasts are announced, pause while hovered or focused, close with Escape or a swipe, and output CSS variables to stack them.

- [#149](https://github.com/leve-ui/leve-ui/pull/149) [`2236905`](https://github.com/leve-ui/leve-ui/commit/22369057d7f8b67952fecfa8edef0d820762dd54) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Toolbar. Toggle and Toggle Group items inside a Toolbar join its roving tabindex automatically.

- [#154](https://github.com/leve-ui/leve-ui/pull/154) [`16cec10`](https://github.com/leve-ui/leve-ui/commit/16cec10bda853964d1cc1170852a06351d8c4492) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Tooltip, shown on hover and focus with delays, and kept open while the pointer is on it (WCAG 1.4.13).

### Patch Changes

- Updated dependencies [[`b8b29fd`](https://github.com/leve-ui/leve-ui/commit/b8b29fd5fac9daa75a71273ce83418231565d933), [`38a6c5d`](https://github.com/leve-ui/leve-ui/commit/38a6c5d29b03d1384f49d0c82c7a52def3b521f3), [`4124c5d`](https://github.com/leve-ui/leve-ui/commit/4124c5d3733dcd1b091212c06d3c4a7ec334b9ce), [`257c89d`](https://github.com/leve-ui/leve-ui/commit/257c89da2a77bf9eb9947c2a414e25fc40ad4605), [`58bbd91`](https://github.com/leve-ui/leve-ui/commit/58bbd914cbb0b13093f63c60fa9a52af6c3deff3), [`5a6fb91`](https://github.com/leve-ui/leve-ui/commit/5a6fb91a80ad868a052e3081317cd23317d8a931), [`75e584f`](https://github.com/leve-ui/leve-ui/commit/75e584f8048992600cf9766dcac9bc08c3e2bcc8), [`ce76481`](https://github.com/leve-ui/leve-ui/commit/ce76481181ce8e4e2fe636a9c4ae82fe19187ce0), [`3bed535`](https://github.com/leve-ui/leve-ui/commit/3bed5357ab81df6de1440f2f574bb05a94375c5c), [`3a66949`](https://github.com/leve-ui/leve-ui/commit/3a669493859898ec6943ba7801eef73d4cb398c8), [`f3b3785`](https://github.com/leve-ui/leve-ui/commit/f3b3785b72c1bfa380be0fc0b0a811ee08a93692), [`ce76481`](https://github.com/leve-ui/leve-ui/commit/ce76481181ce8e4e2fe636a9c4ae82fe19187ce0), [`af679ad`](https://github.com/leve-ui/leve-ui/commit/af679ad335486d02f8b843af366e1f459305164d), [`9bfd4ba`](https://github.com/leve-ui/leve-ui/commit/9bfd4ba224da9f270de85fca848859e316f8eb35), [`4e54577`](https://github.com/leve-ui/leve-ui/commit/4e545775444269053e00bfd5634458f80ebe901e), [`1911bbd`](https://github.com/leve-ui/leve-ui/commit/1911bbdd33d1822b96938f47a86a8a071ddaad7d), [`d76b5cd`](https://github.com/leve-ui/leve-ui/commit/d76b5cdfc61a048ac23f0bcc1248322fe43ff180), [`3b53a7e`](https://github.com/leve-ui/leve-ui/commit/3b53a7edb6942c0ea158ee0f5bd9881893a01ec6), [`21fb936`](https://github.com/leve-ui/leve-ui/commit/21fb936b3d407862659a41b783c535c84a2549fe), [`e1e28cf`](https://github.com/leve-ui/leve-ui/commit/e1e28cfcd73185fed95e9eaa48f137294028892c), [`de0c5ec`](https://github.com/leve-ui/leve-ui/commit/de0c5ecd8b448f61bc06cbe8d132a2b9c0063eb5), [`c5a6f68`](https://github.com/leve-ui/leve-ui/commit/c5a6f687097eafb90b39f259a2c83c556d30feb0), [`3ac3aa3`](https://github.com/leve-ui/leve-ui/commit/3ac3aa3386484c7c2a4df66150b776c51ef9d255), [`de0c5ec`](https://github.com/leve-ui/leve-ui/commit/de0c5ecd8b448f61bc06cbe8d132a2b9c0063eb5), [`b856cce`](https://github.com/leve-ui/leve-ui/commit/b856cce6e21a5362965885b4a2844f775c5c61f1), [`58b4ed0`](https://github.com/leve-ui/leve-ui/commit/58b4ed06f32c3b5a2e9251fb79a3eee60d979d57), [`1ca6893`](https://github.com/leve-ui/leve-ui/commit/1ca6893e256d5e66669c0e835a7209d6c9479581), [`ced7a06`](https://github.com/leve-ui/leve-ui/commit/ced7a0611c6bd675b190715061e3fff645887037), [`9a498fb`](https://github.com/leve-ui/leve-ui/commit/9a498fb28edeabbcad8a631502d709206ff3594e), [`59c54a5`](https://github.com/leve-ui/leve-ui/commit/59c54a5ad994891ad0b697dd9be8ba9f565fca8d), [`2236905`](https://github.com/leve-ui/leve-ui/commit/22369057d7f8b67952fecfa8edef0d820762dd54), [`1911bbd`](https://github.com/leve-ui/leve-ui/commit/1911bbdd33d1822b96938f47a86a8a071ddaad7d), [`8239b99`](https://github.com/leve-ui/leve-ui/commit/8239b99240cbd590c5a9164481cdbd71690d41ef), [`16cec10`](https://github.com/leve-ui/leve-ui/commit/16cec10bda853964d1cc1170852a06351d8c4492)]:
  - @leve-ui/accordion@0.1.1
  - @leve-ui/alert@0.2.0
  - @leve-ui/breadcrumb@0.2.0
  - @leve-ui/checkbox@0.2.0
  - @leve-ui/combobox@0.1.0
  - @leve-ui/dialog@0.1.0
  - @leve-ui/avatar@0.1.1
  - @leve-ui/collapsible@0.1.1
  - @leve-ui/field@0.2.0
  - @leve-ui/meter@0.1.1
  - @leve-ui/progress@0.1.1
  - @leve-ui/radio-group@0.2.0
  - @leve-ui/separator@0.1.1
  - @leve-ui/switch@0.2.0
  - @leve-ui/tabs@0.2.0
  - @leve-ui/toggle@0.2.0
  - @leve-ui/toggle-group@0.2.0
  - @leve-ui/drawer@0.1.0
  - @leve-ui/fieldset@0.2.0
  - @leve-ui/hover-card@0.1.0
  - @leve-ui/menu@0.1.0
  - @leve-ui/popover@0.1.0
  - @leve-ui/tooltip@0.1.0
  - @leve-ui/toast@0.1.0
  - @leve-ui/toolbar@0.1.0
  - @leve-ui/label@0.1.1

## 0.1.0

### Minor Changes

- [#81](https://github.com/leve-ui/leve-ui/pull/81) [`fd47e9c`](https://github.com/leve-ui/leve-ui/commit/fd47e9ca5527f5766bece1013df9fe89e08f6ddd) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Accordion component with WAI-ARIA APG compliant single and multiple selection, collapsible mode, and keyboard navigation.

- [#59](https://github.com/leve-ui/leve-ui/pull/59) [`c6f1710`](https://github.com/leve-ui/leve-ui/commit/c6f1710cd187cfdfe5947e821da7d138a84775ce) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add the Alert component.

- [#59](https://github.com/leve-ui/leve-ui/pull/59) [`c6f1710`](https://github.com/leve-ui/leve-ui/commit/c6f1710cd187cfdfe5947e821da7d138a84775ce) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add the Breadcrumb component.

- [#70](https://github.com/leve-ui/leve-ui/pull/70) [`639dfd7`](https://github.com/leve-ui/leve-ui/commit/639dfd7a92b2a8fb5a2e2bb0457a290155221260) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Checkbox component supporting checked, unchecked, and indeterminate states with Control, Indicator, Label, and HiddenInput parts

- [#71](https://github.com/leve-ui/leve-ui/pull/71) [`4397784`](https://github.com/leve-ui/leve-ui/commit/4397784f21d7b4abae4a4c3481a848bbef9740e4) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Collapsible component that can be expanded or collapsed.

- [#66](https://github.com/leve-ui/leve-ui/pull/66) [`811bf82`](https://github.com/leve-ui/leve-ui/commit/811bf82826841fda0ac9cc7ba0c5b1697d94206d) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Field component that wires label, description and error message to form controls

- [#59](https://github.com/leve-ui/leve-ui/pull/59) [`c6f1710`](https://github.com/leve-ui/leve-ui/commit/c6f1710cd187cfdfe5947e821da7d138a84775ce) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add the Fieldset component.

- [#59](https://github.com/leve-ui/leve-ui/pull/59) [`c6f1710`](https://github.com/leve-ui/leve-ui/commit/c6f1710cd187cfdfe5947e821da7d138a84775ce) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add the Label component.

- [#59](https://github.com/leve-ui/leve-ui/pull/59) [`c6f1710`](https://github.com/leve-ui/leve-ui/commit/c6f1710cd187cfdfe5947e821da7d138a84775ce) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add the Meter component.

- [#59](https://github.com/leve-ui/leve-ui/pull/59) [`c6f1710`](https://github.com/leve-ui/leve-ui/commit/c6f1710cd187cfdfe5947e821da7d138a84775ce) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add the Progress component.

- [#72](https://github.com/leve-ui/leve-ui/pull/72) [`4f9409b`](https://github.com/leve-ui/leve-ui/commit/4f9409b3a6cfd2715050309e004e913fba9e2946) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add RadioGroup component for mutually exclusive option selection with roving tabindex support

- [#59](https://github.com/leve-ui/leve-ui/pull/59) [`c6f1710`](https://github.com/leve-ui/leve-ui/commit/c6f1710cd187cfdfe5947e821da7d138a84775ce) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add the Separator component.

- [#69](https://github.com/leve-ui/leve-ui/pull/69) [`1e64e1c`](https://github.com/leve-ui/leve-ui/commit/1e64e1c580ad69d69cf3dba5da1da16e9b0cfe5a) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Switch component that toggles a setting on or off, with a Label part and form submission through a HiddenInput part

- [#73](https://github.com/leve-ui/leve-ui/pull/73) [`11f3e63`](https://github.com/leve-ui/leve-ui/commit/11f3e63ac89557a6a5ed7251f05244ee9889f4cb) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Tabs component with WAI-ARIA APG compliant roving focus, horizontal and vertical orientation, and automatic and manual activation modes

- [#82](https://github.com/leve-ui/leve-ui/pull/82) [`f065491`](https://github.com/leve-ui/leve-ui/commit/f0654914876c6c50a192e3b90000a959b12dbc4f) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add ToggleGroup component for single and multiple selection with roving focus support

- [#64](https://github.com/leve-ui/leve-ui/pull/64) [`3bfa7cf`](https://github.com/leve-ui/leve-ui/commit/3bfa7cfa694cf3651b1af18acc3518a31c9aeeb1) Thanks [@itkyk0926](https://github.com/itkyk0926)! - Add Toggle component.

### Patch Changes

- Updated dependencies [[`fd47e9c`](https://github.com/leve-ui/leve-ui/commit/fd47e9ca5527f5766bece1013df9fe89e08f6ddd), [`c6f1710`](https://github.com/leve-ui/leve-ui/commit/c6f1710cd187cfdfe5947e821da7d138a84775ce), [`c65fd00`](https://github.com/leve-ui/leve-ui/commit/c65fd000848764e543ce457a6e48357cfee377bb), [`c6f1710`](https://github.com/leve-ui/leve-ui/commit/c6f1710cd187cfdfe5947e821da7d138a84775ce), [`639dfd7`](https://github.com/leve-ui/leve-ui/commit/639dfd7a92b2a8fb5a2e2bb0457a290155221260), [`4397784`](https://github.com/leve-ui/leve-ui/commit/4397784f21d7b4abae4a4c3481a848bbef9740e4), [`811bf82`](https://github.com/leve-ui/leve-ui/commit/811bf82826841fda0ac9cc7ba0c5b1697d94206d), [`c6f1710`](https://github.com/leve-ui/leve-ui/commit/c6f1710cd187cfdfe5947e821da7d138a84775ce), [`c6f1710`](https://github.com/leve-ui/leve-ui/commit/c6f1710cd187cfdfe5947e821da7d138a84775ce), [`c6f1710`](https://github.com/leve-ui/leve-ui/commit/c6f1710cd187cfdfe5947e821da7d138a84775ce), [`c6f1710`](https://github.com/leve-ui/leve-ui/commit/c6f1710cd187cfdfe5947e821da7d138a84775ce), [`4f9409b`](https://github.com/leve-ui/leve-ui/commit/4f9409b3a6cfd2715050309e004e913fba9e2946), [`c6f1710`](https://github.com/leve-ui/leve-ui/commit/c6f1710cd187cfdfe5947e821da7d138a84775ce), [`1e64e1c`](https://github.com/leve-ui/leve-ui/commit/1e64e1c580ad69d69cf3dba5da1da16e9b0cfe5a), [`11f3e63`](https://github.com/leve-ui/leve-ui/commit/11f3e63ac89557a6a5ed7251f05244ee9889f4cb), [`f065491`](https://github.com/leve-ui/leve-ui/commit/f0654914876c6c50a192e3b90000a959b12dbc4f), [`3bfa7cf`](https://github.com/leve-ui/leve-ui/commit/3bfa7cfa694cf3651b1af18acc3518a31c9aeeb1)]:
  - @leve-ui/accordion@0.1.0
  - @leve-ui/alert@0.1.0
  - @leve-ui/avatar@0.1.0
  - @leve-ui/breadcrumb@0.1.0
  - @leve-ui/checkbox@0.1.0
  - @leve-ui/collapsible@0.1.0
  - @leve-ui/field@0.1.0
  - @leve-ui/fieldset@0.1.0
  - @leve-ui/label@0.1.0
  - @leve-ui/meter@0.1.0
  - @leve-ui/progress@0.1.0
  - @leve-ui/radio-group@0.1.0
  - @leve-ui/separator@0.1.0
  - @leve-ui/switch@0.1.0
  - @leve-ui/tabs@0.1.0
  - @leve-ui/toggle-group@0.1.0
  - @leve-ui/toggle@0.1.0
