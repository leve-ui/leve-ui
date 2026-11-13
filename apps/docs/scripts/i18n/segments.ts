/**
 * Splits English MDX into translatable segments and writes translations back
 * into it (adr/0033).
 *
 * - Segments are headings, paragraphs (including those in lists and quotes),
 *   table cells, and the `title` / `description` of the frontmatter.
 * - Code blocks, imports / exports, expressions and JSX blocks are skipped.
 * - Inside a segment, inline code, inline JSX and images become `<xN/>`, and
 *   links become `<xN>text</xN>` so that their text is translated but not their
 *   URL. Everything else (emphasis, strong) stays as Markdown.
 *
 * A translation is written into the original source by position, so the rest
 * of the file is kept byte for byte.
 */
import { createHash } from 'node:crypto';
import type { Nodes, Root, RootContent } from 'mdast';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

export type Segment = {
  /** The English text with placeholders, sent to the translator */
  text: string;
  /** Source offsets of the text that the translation replaces */
  start: number;
  end: number;
  /** What each placeholder stands for (`x0` → `` `data-state` ``), as context for the translator */
  placeholders: Record<string, string>;
  /** Turns a translation of `text` back into MDX */
  restore: (translation: string) => string;
};

/** The memory key of a segment text. */
export function segmentHash(text: string): string {
  return createHash('sha256').update(text).digest('hex').slice(0, 16);
}

const parser = unified().use(remarkParse).use(remarkMdx).use(remarkGfm);

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;
const FRONTMATTER_KEYS = ['title', 'description'];

/** Block nodes whose inline content is one segment. */
const SEGMENT_TYPES = new Set(['heading', 'paragraph', 'tableCell']);
/** Nodes that are never translated, including their children. */
const SKIP_TYPES = new Set(['code', 'mdxjsEsm', 'mdxFlowExpression', 'mdxJsxFlowElement', 'html']);
/** Inline nodes kept as they are, behind a `<xN/>` placeholder. */
const ATOM_TYPES = new Set([
  'inlineCode',
  'mdxJsxTextElement',
  'mdxTextExpression',
  'image',
  'imageReference',
  'html',
  'break',
]);
/** Inline nodes whose children are translated, behind `<xN>...</xN>`. */
const WRAP_TYPES = new Set(['link', 'linkReference']);

const PLACEHOLDER = /<x(\d+)\/>|<x(\d+)>|<\/x(\d+)>/g;

/** Text worth translating: has letters outside the placeholders. */
function hasWords(text: string) {
  return /\p{L}/u.test(text.replace(PLACEHOLDER, ''));
}

type Parts = { atoms: Map<number, string>; open: Map<number, string>; close: Map<number, string> };

function offsets(node: Nodes) {
  const start = node.position?.start.offset;
  const end = node.position?.end.offset;
  if (start === undefined || end === undefined) throw new Error(`No position for ${node.type}`);
  return { start, end };
}

/** Builds the segment text of inline nodes between `start` and `end` of `source`. */
function inlineText(
  nodes: RootContent[],
  source: string,
  start: number,
  end: number,
  parts: Parts,
): string {
  let text = '';
  let cursor = start;
  for (const node of nodes) {
    const range = offsets(node);
    text += source.slice(cursor, range.start);
    cursor = range.end;
    if (ATOM_TYPES.has(node.type)) {
      const id = parts.atoms.size + parts.open.size;
      parts.atoms.set(id, source.slice(range.start, range.end));
      text += `<x${id}/>`;
    } else if ('children' in node && node.children.length > 0) {
      const first = offsets(node.children[0]).start;
      const last = offsets(node.children[node.children.length - 1]).end;
      const inner = inlineText(node.children, source, first, last, parts);
      if (WRAP_TYPES.has(node.type)) {
        const id = parts.atoms.size + parts.open.size;
        parts.open.set(id, source.slice(range.start, first));
        parts.close.set(id, source.slice(last, range.end));
        text += `<x${id}>${inner}</x${id}>`;
      } else {
        // Emphasis, strong, delete: keep their Markdown around the content
        text += source.slice(range.start, first) + inner + source.slice(last, range.end);
      }
    } else if (WRAP_TYPES.has(node.type)) {
      const id = parts.atoms.size + parts.open.size;
      parts.atoms.set(id, source.slice(range.start, range.end));
      text += `<x${id}/>`;
    } else {
      text += source.slice(range.start, range.end);
    }
  }
  return text + source.slice(cursor, end);
}

/**
 * Checks that a translation has exactly the placeholders of its source, each
 * once, with every `<xN>` closed after it is opened. Returns the problem, or
 * undefined when it matches.
 */
export function checkPlaceholders(source: string, translation: string): string | undefined {
  const list = (text: string) => [...text.matchAll(PLACEHOLDER)].map((m) => m[0]);
  const expected = list(source).sort();
  const actual = list(translation);
  if (expected.join() !== [...actual].sort().join()) {
    return `placeholders differ: expected ${expected.join(' ') || 'none'}, got ${actual.join(' ') || 'none'}`;
  }
  for (const tag of actual) {
    if (tag.startsWith('</')) {
      const open = tag.replace('</', '<');
      if (actual.indexOf(open) > actual.indexOf(tag)) return `${tag} comes before ${open}`;
    }
  }
  return undefined;
}

/** Escapes characters that MDX would read as JSX or expressions. */
function escapeMdx(text: string) {
  return text.replace(/(?<!\\)([{}<])/g, '\\$1');
}

function restorer(source: string, parts: Parts) {
  return (translation: string) => {
    const problem = checkPlaceholders(source, translation);
    if (problem) throw new Error(`${problem}\n  source: ${source}\n  translation: ${translation}`);
    let out = '';
    let cursor = 0;
    for (const match of translation.matchAll(PLACEHOLDER)) {
      out += escapeMdx(translation.slice(cursor, match.index));
      cursor = match.index + match[0].length;
      const [, atom, open, close] = match;
      if (atom) out += parts.atoms.get(Number(atom));
      else if (open) out += parts.open.get(Number(open));
      else out += parts.close.get(Number(close));
    }
    return out + escapeMdx(translation.slice(cursor));
  };
}

function frontmatterSegments(source: string): Segment[] {
  const match = FRONTMATTER.exec(source);
  if (!match) return [];
  const segments: Segment[] = [];
  const body = match[1];
  const bodyStart = match[0].indexOf(body);
  for (const line of body.matchAll(/^(\w+):[ \t]*(.+)$/gm)) {
    const [, key, raw] = line;
    if (!FRONTMATTER_KEYS.includes(key)) continue;
    const quoted = /^(["']).*\1$/.test(raw);
    const text = quoted ? raw.slice(1, -1) : raw;
    if (!hasWords(text)) continue;
    const start = bodyStart + line.index + line[0].indexOf(raw, key.length + 1);
    segments.push({
      text,
      start,
      end: start + raw.length,
      // A JSON string is a valid YAML string
      placeholders: {},
      restore: (translation) => JSON.stringify(translation),
    });
  }
  return segments;
}

/** The translatable segments of an MDX file, in source order. */
export function extractSegments(source: string): Segment[] {
  const segments = frontmatterSegments(source);
  const frontmatter = FRONTMATTER.exec(source)?.[0] ?? '';
  // Parse the body only; positions are shifted back to the whole file
  const body = source.slice(frontmatter.length);
  const tree = parser.parse(body) as Root;
  const shift = frontmatter.length;

  const visit = (node: Nodes) => {
    if (SKIP_TYPES.has(node.type)) return;
    if (SEGMENT_TYPES.has(node.type) && 'children' in node) {
      if (node.children.length === 0) return;
      const start = offsets(node.children[0]).start;
      const end = offsets(node.children[node.children.length - 1]).end;
      const parts: Parts = { atoms: new Map(), open: new Map(), close: new Map() };
      const text = inlineText(node.children as RootContent[], body, start, end, parts).trim();
      if (!hasWords(text)) return;
      segments.push({
        text,
        start: start + shift,
        end: end + shift,
        placeholders: Object.fromEntries(
          [
            ...parts.atoms,
            ...[...parts.open].map(([id, open]) => [id, `${open}…${parts.close.get(id)}`] as const),
          ].map(([id, raw]) => [`x${id}`, raw]),
        ),
        restore: restorer(text, parts),
      });
      return;
    }
    if ('children' in node) for (const child of node.children) visit(child);
  };
  visit(tree);
  return segments;
}

/**
 * Replaces every segment that has a translation. Segments without one stay
 * in English.
 */
export function translateMdx(
  source: string,
  translate: (text: string) => string | undefined,
): { mdx: string; translated: number; total: number } {
  const segments = extractSegments(source);
  let mdx = source;
  let translated = 0;
  // From the end, so earlier offsets stay valid
  for (const segment of [...segments].reverse()) {
    const translation = translate(segment.text);
    if (translation === undefined) continue;
    mdx = mdx.slice(0, segment.start) + segment.restore(translation) + mdx.slice(segment.end);
    translated++;
  }
  return { mdx, translated, total: segments.length };
}
