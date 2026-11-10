import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import { sourceResolveConfig } from '@levis-ui/vite-config';
import { defineConfig, mergeConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() =>
  mergeConfig(sourceResolveConfig(), {
    plugins: [qwikCity(), qwikVite(), tsconfigPaths({ root: '.' })],
    server: {
      headers: { 'Cache-Control': 'public, max-age=0' },
    },
    preview: {
      headers: { 'Cache-Control': 'public, max-age=600' },
    },
  }),
);
