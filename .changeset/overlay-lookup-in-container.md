---
'@leve-ui/utils': patch
'@leve-ui/menu': patch
'@leve-ui/popover': patch
'@leve-ui/tooltip': patch
'@leve-ui/hover-card': patch
'@leve-ui/combobox': patch
---

Find the trigger and the other parts within the same Qwik container, so popups open next to the right trigger on pages with several containers, where Qwik's `useId()` repeats ids. `@leve-ui/utils` adds `getElementByIdInContainer`, also used by the Dialog and the Drawer.
