---
'@leve-ui/pin-input': patch
---

Read `clipboardData` synchronously inside `sync$` on paste so the first paste fills slots immediately even before the async paste handler chunk loads
