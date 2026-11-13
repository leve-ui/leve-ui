import type { Component } from '@builder.io/qwik';

// The Storybook demos are rendered directly, and their sources are shown as is (adr/0031)
const components = import.meta.glob<Component>('~demos/**/*.tsx', {
  import: 'default',
  eager: true,
});
/** `~demos/avatar/default.tsx` (or the resolved path) → `avatar/default.tsx` */
export function toKey(path: string) {
  return path.match(/([^/]+\/[^/]+\.(?:tsx|css))$/)?.[1] ?? path;
}

export function byKey<T>(modules: Record<string, T>): Record<string, T> {
  return Object.fromEntries(Object.entries(modules).map(([path, mod]) => [toKey(path), mod]));
}

export const demoComponents = byKey(components);
