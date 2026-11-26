import { fileURLToPath } from 'node:url';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import { sourceResolveConfig } from '@leve-ui/vite-config';
import { partytownVite } from '@qwik.dev/partytown/utils';
import rehypeShiki from '@shikijs/rehype';
import { defineConfig, mergeConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { rehypeEnglishHeadingIds } from './vite/english-heading-ids';
import { highlightPlugin, SHIKI_THEMES } from './vite/highlight';

const r = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig(() =>
  mergeConfig(sourceResolveConfig(), {
    resolve: {
      alias: {
        // The docs site renders the Storybook demos directly (adr/0031)
        '~demos': r('../storybook/stories/demos'),
      },
    },
    plugins: [
      highlightPlugin(),
      qwikCity({
        mdxPlugins: {
          remarkGfm: true,
          // Code blocks are highlighted with shiki instead of the built-in refractor
          rehypeSyntaxHighlight: false,
          // Headings render their own anchor links (src/components/mdx)
          rehypeAutolinkHeadings: false,
        },
        mdx: {
          providerImportSource: r('./src/components/mdx/provider.ts'),
          rehypePlugins: [
            rehypeEnglishHeadingIds,
            [rehypeShiki, { themes: SHIKI_THEMES, defaultColor: false }],
          ],
        },
      }),
      // @fontsource/noto-sans-jp splits into 100+ unicode-range subsets; Qwik's automatic
      // font preloading injects ~585 <link rel="preload"> tags into every HTML page.
      qwikVite({ disableFontPreload: true }),
      partytownVite({ dest: r('dist/~partytown') }),
      tsconfigPaths({ root: '.' }),
    ],
    optimizeDeps: {
      include: [
        // @leve-ui/utils is read from src (@leve-ui/source), so the dependency scan misses it
        '@leve-ui/accordion > @leve-ui/utils > @floating-ui/dom',
        // Demo icons: a single ~1MB file that is slow to transform on first request
        '@qwikest/icons/lucide',
      ],
    },
    server: {
      headers: { 'Cache-Control': 'public, max-age=0' },
      fs: { allow: [r('../..')] },
    },
    preview: {
      headers: { 'Cache-Control': 'public, max-age=600' },
    },
  }),
);
