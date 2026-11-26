---
'@leve-ui/combobox': patch
'@leve-ui/tags-input': minor
---

Run `Combobox.Input`'s internal `keydown` handler before composed `onKeyDown$` handlers and mark handled `Enter`/`Escape` events; support composing `TagsInput.Control` and `TagsInput.Input` with `Combobox` via `as`, add controlled `bind:inputValue` and `allowCustomValue` props, and capture pasted text synchronously on first paste.
