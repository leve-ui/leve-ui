import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';
import { createHighlighter, type Highlighter } from 'shiki';
import type { Plugin } from 'vite';
import { SHIKI_THEMES } from './shiki-themes';

export { SHIKI_THEMES };

const QUERY = '?highlight';
// Same HTML in the browser too. Only imported lazily, for pages rendered on the
// client after an SPA navigation (src/components/demo/demo-highlighted.ts).
const CLIENT_QUERY = '?highlight-client';
const PREFIX = '\0highlight:';
const CLIENT_PREFIX = '\0highlight-client:';
// Keeps the virtual module from being matched as CSS or TSX by other plugins
const SUFFIX = '.highlight.js';

const LANGS: Record<string, string> = {
  '.tsx': 'tsx',
  '.ts': 'ts',
  '.css': 'css',
  '.js': 'js',
  '.json': 'json',
};

let highlighter: Promise<Highlighter> | undefined;

function getHighlighter() {
  highlighter ??= createHighlighter({
    themes: Object.values(SHIKI_THEMES),
    langs: [...new Set(Object.values(LANGS))],
  });
  return highlighter;
}

/**
 * Resolves `import html from './file.tsx?highlight'` to the file's source
 * highlighted by shiki (light and dark themes as CSS variables), so that demo
 * sources are highlighted at build time instead of in the browser.
 */
export function highlightPlugin(): Plugin {
  return {
    name: 'leve-docs:highlight',
    enforce: 'pre',
    async resolveId(source, importer) {
      const query = [CLIENT_QUERY, QUERY].find((q) => source.endsWith(q));
      if (!query) return null;
      const resolved = await this.resolve(source.slice(0, -query.length), importer, {
        skipSelf: true,
      });
      if (!resolved) return null;
      return (query === CLIENT_QUERY ? CLIENT_PREFIX : PREFIX) + resolved.id + SUFFIX;
    },
    async load(id, options) {
      const prefix = [CLIENT_PREFIX, PREFIX].find((p) => id.startsWith(p));
      if (!prefix) return null;
      const file = id.slice(prefix.length, -SUFFIX.length);
      this.addWatchFile(file);
      // `?highlight` is eager: render it on the server only, so the client bundle
      // does not contain the sources of every demo.
      if (prefix === PREFIX && !options?.ssr) return 'export default "";';
      const code = (await readFile(file, 'utf8')).trimEnd();
      const lang = LANGS[extname(file)] ?? 'text';
      const html = (await getHighlighter()).codeToHtml(code, {
        lang,
        themes: SHIKI_THEMES,
        defaultColor: false,
      });
      return `export default ${JSON.stringify(html)};`;
    },
  };
}
