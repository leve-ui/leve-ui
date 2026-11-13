import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';
import { createHighlighter, type Highlighter } from 'shiki';
import type { Plugin } from 'vite';

const QUERY = '?highlight';
const PREFIX = '\0highlight:';
// Keeps the virtual module from being matched as CSS or TSX by other plugins
const SUFFIX = '.highlight.js';

export const SHIKI_THEMES = { light: 'github-light', dark: 'github-dark' } as const;

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
      if (!source.endsWith(QUERY)) return null;
      const resolved = await this.resolve(source.slice(0, -QUERY.length), importer, {
        skipSelf: true,
      });
      if (!resolved) return null;
      return PREFIX + resolved.id + SUFFIX;
    },
    async load(id, options) {
      if (!id.startsWith(PREFIX)) return null;
      const file = id.slice(PREFIX.length, -SUFFIX.length);
      this.addWatchFile(file);
      // The highlighted HTML is rendered on the server only (Demo never re-renders
      // in the browser), so the client bundle does not need the sources of every demo.
      if (!options?.ssr) return 'export default "";';
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
