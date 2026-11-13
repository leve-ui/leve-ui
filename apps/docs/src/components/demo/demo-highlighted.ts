import { byKey } from './demo-sources';

// Highlighted at build time (vite/highlight.ts). On the server these are rendered
// statically and never sent as component state; in the browser they are empty.
const highlighted = import.meta.glob<string>(['~demos/**/*.tsx', '~demos/**/*.css'], {
  query: '?highlight',
  import: 'default',
  eager: true,
});

export const demoSources = byKey(highlighted);

// After an SPA navigation the page is rendered in the browser, where the eager
// sources above are empty. Each source is then loaded on demand as its own chunk.
const lazyHighlighted = byKey(
  import.meta.glob<string>(['~demos/**/*.tsx', '~demos/**/*.css'], {
    query: '?highlight-client',
    import: 'default',
  }),
);

/** Loads the highlighted HTML of `avatar/default.tsx` etc. in the browser. */
export async function loadDemoSource(key: string): Promise<string> {
  return (await lazyHighlighted[key]?.()) ?? '';
}
