import { byKey } from './demo-sources';

// Highlighted at build time (vite/highlight.ts). Only the server reads these:
// the HTML is rendered statically and never sent as component state.
const highlighted = import.meta.glob<string>(['~demos/**/*.tsx', '~demos/**/*.css'], {
  query: '?highlight',
  import: 'default',
  eager: true,
});

export const demoSources = byKey(highlighted);
