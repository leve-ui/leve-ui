import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractHeadingIds } from '../scripts/slug';
import { localeRouteDir, SOURCE_LOCALE } from '../src/i18n/locales';

const SOURCE_ROUTE_DIR = localeRouteDir(SOURCE_LOCALE);

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const ROUTES_DIR = normalize(join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'routes'));

function visitHeadings(node: HastNode, visitor: (el: HastNode) => void) {
  if (node.type === 'element' && node.tagName && HEADING_TAGS.has(node.tagName)) {
    visitor(node);
  }
  if (node.children) {
    for (const child of node.children) visitHeadings(child, visitor);
  }
}

/**
 * Replaces translated heading IDs with the English source heading IDs so that
 * hash links, language switching, and SPA search navigation work consistently
 * across all locales without non-ASCII URL fragments.
 *
 * Must run after Qwik City's `rehypeSlug` and before `rehypePage` (which exports
 * `headings` for TableOfContents).
 */
export function rehypeEnglishHeadingIds() {
  return (tree: HastNode, vfile: { path?: string }) => {
    if (!vfile.path) return;
    const filePath = normalize(vfile.path);
    if (!filePath.startsWith(ROUTES_DIR)) return;

    const rel = filePath.slice(ROUTES_DIR.length).replaceAll('\\', '/');
    const match = rel.match(/^\/([^/]+)(\/.*)$/);
    if (!match || match[1] === SOURCE_ROUTE_DIR) return;

    const englishPath = join(ROUTES_DIR, SOURCE_ROUTE_DIR, match[2]);
    if (!existsSync(englishPath)) return;

    const englishIds = extractHeadingIds(readFileSync(englishPath, 'utf8'));
    let index = 0;

    visitHeadings(tree, (el) => {
      const id = englishIds[index++];
      if (id && el.properties) {
        el.properties.id = id;
      }
    });
  };
}
