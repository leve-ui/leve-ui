import { staticAdapter } from '@builder.io/qwik-city/adapters/static/vite';
import { extendConfig } from '@builder.io/qwik-city/vite';
import baseConfig from '../../vite.config';

/**
 * Static site generation (SSG) for Cloudflare Pages (#100).
 * Every route is rendered to HTML at build time into `dist/`.
 */
export default extendConfig(baseConfig, () => ({
  build: {
    ssr: true,
    rollupOptions: {
      input: ['@qwik-city-plan'],
    },
  },
  plugins: [
    staticAdapter({
      // Used for canonical URLs and the sitemap. Change it when a custom domain is attached.
      origin: process.env.DOCS_ORIGIN ?? 'https://leve-ui-docs.pages.dev',
    }),
  ],
}));
