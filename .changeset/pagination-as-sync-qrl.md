---
'@leve-ui/pagination': patch
---

Avoid passing `sync$` click handlers as component props when `as` is a Qwik component, fixing SSR errors with router links such as Qwik City's `<Link>`.
