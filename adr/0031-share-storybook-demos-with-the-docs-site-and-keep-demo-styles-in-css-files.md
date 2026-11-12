# 0031. Share Storybook demos with the docs site and keep demo styles in CSS files

- Status: Accepted
- Date: 2026-11-13
- Related: [0007](0007-storybook-csr-mode.md), [0009](0009-headless-parts-and-data-attributes.md), [0027](0027-deploy-storybook-previews-to-cloudflare-pages.md)

## Context

The docs site (`apps/docs`, #83) needs a live preview and the source code for every example on each component page. Storybook already has one demo file per story (`apps/storybook/stories/demos/<name>/<story>.tsx`), written so that the code shown in "Show code" can be copied as is ([storybook rules](../.agents/rules/storybook.md)).

Constraints and problems:

- The shown code must be the code that actually runs (#83 acceptance criteria). Keeping a second copy of every demo for the docs site would drift.
- Demo styles are written inline in the demo file and applied with `useStyles$`, which is global. When several demos of the same component are on one page (the Storybook Docs page today, and the docs component pages), demos that define the same class name differently break each other. This already happens in Storybook.
- The docs site wants to show the component code and its CSS in separate tabs.
- leve-ui is headless. Examples must not require a specific styling tool from users.

## Considered Options

1. **Import the Storybook demos from the docs site** — The docs site renders the same demo components with its own Qwik City SSR and reads their sources with `?raw`. One source for both. Needs a path alias from `apps/docs` to `apps/storybook/stories/demos`.
2. **Embed Storybook in an iframe** — No duplication, but heavy to load, rendered in CSR mode ([0007](0007-storybook-csr-mode.md)) with a flash, hard to match the docs theme, and depends on the Storybook deployment.
3. **Embed an online sandbox (CodeSandbox / StackBlitz)** — Editable, but slow to boot a Qwik project, depends on an external service, and still needs the demo sources somewhere.
4. **Scope demo styles with `useStylesScoped$`** — Qwik scoped styles only apply to elements in the component's own template. Library parts render their elements inside child components, so every selector would need `:global(...)`, which removes the benefit.
5. **Write demo styles with Panda CSS (as the docs site does)** — Copied examples would require Panda in the user's project, which contradicts being headless and tool-agnostic.

## Decision

- We will render the Storybook demo components directly on the docs site (option 1) through a Vite alias, and show their sources with `?raw`. We will not embed Storybook or online sandboxes.
- We will move each demo's styles out of the TSX file into a sibling CSS file with the same name, and keep applying them with `useStyles$`:

  ```
  apps/storybook/stories/demos/<name>/
  ├── <story>.tsx   # import styles from './<story>.css?inline'; useStyles$(styles);
  └── <story>.css
  ```

  - Demos without styles may omit the CSS file.
  - The docs site shows `<story>.tsx?raw` and `<story>.css?raw` in separate tabs.
  - Storybook's "Show code" receives the TSX source followed by the CSS source in one block, because it accepts a single code string.
- Class names in demo CSS start with the component name and the demo name (for example `.avatar-fallback-root`), so that demos on the same page never collide. Classes are not shared between demos; duplicated CSS between demos is still allowed.
- Demo CSS is plain CSS. It must not depend on Panda CSS or any other tool used by the docs site.

## Rationale

- Option 1 is the only option where the shown code and the running code cannot drift, and it renders with SSR in the same theme as the docs site.
- Options 2 and 3 add load time and external dependencies. Options 4 and 5 do not work for headless parts or tie examples to a tool.
- Separate CSS files keep the TSX tab focused on how to use the parts, while `?inline` + `useStyles$` keeps each demo self-contained and copyable.
- Prefixing class names with the demo name is the smallest change that fixes the existing collisions without scoping.

## Consequences

- All existing demos are migrated to the TSX + CSS layout, and colliding class names are renamed.
- The docs site depends on files under `apps/storybook`. Moving or renaming demos affects both apps; the docs build fails loudly if an import breaks.
- The docs site's Panda CSS reset is emitted in a cascade layer, so unlayered demo CSS wins over it. Docs styles must not target demo class names.
- `.agents/rules/storybook.md`, `CONTRIBUTING.md` and the `create-component` scaffold are updated to the new layout.

## Revisit When

- Demos need to be used by more apps than Storybook and the docs site (then move them into a shared workspace package).
- Qwik scoped styles start applying to child component elements.
