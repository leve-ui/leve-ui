/**
 * Generates per-locale search index JSON files from the docs MDX pages.
 *
 * Output: public/search-index-<locale>.json (git-ignored)
 * Run: node scripts/generate-search.ts
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCALES } from '../src/i18n/locales.ts';

export type SearchSection = {
  id: string;
  title: string;
  text: string;
};

export type SearchPage = {
  href: string;
  title: string;
  section: string;
  description: string;
  text: string;
  sections: SearchSection[];
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = resolve(__dirname, '..');
const ROUTES_DIR = join(DOCS_ROOT, 'src', 'routes');
const PUBLIC_DIR = join(DOCS_ROOT, 'public');

function walkMdx(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMdx(full));
    } else if (entry.isFile() && entry.name === 'index.mdx') {
      results.push(full);
    }
  }
  return results;
}

function parseFrontmatter(raw: string): { title: string; description: string; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { title: '', description: '', body: raw };
  const [, fm, body] = match;
  let title = '';
  let description = '';
  for (const line of fm.split(/\r?\n/)) {
    const t = line.match(/^title:\s*(.+)$/);
    if (t) title = t[1].trim().replace(/^['"]|['"]$/g, '');
    const d = line.match(/^description:\s*(.+)$/);
    if (d) description = d[1].trim().replace(/^['"]|['"]$/g, '');
  }
  return { title, description, body };
}

function slugify(text: string, counts: Map<string, number>): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[`*_~()[\]{}.,:;!?'"/\\<>@#$%^&+=|]/g, '')
    .replace(/\s+/g, '-');
  const count = counts.get(base) ?? 0;
  counts.set(base, count + 1);
  return count === 0 ? base : `${base}-${count}`;
}

function stripMarkdown(line: string): string {
  return line
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractSections(body: string): { intro: string; sections: SearchSection[] } {
  const lines = body.split(/\r?\n/);
  const slugCounts = new Map<string, number>();
  const introLines: string[] = [];
  const sections: SearchSection[] = [];
  let current: { id: string; title: string; lines: string[] } | null = null;
  let inFence = false;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (trimmed.startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (/^(import|export)\s/.test(trimmed)) continue;

    const heading = trimmed.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      if (current) {
        sections.push({
          id: current.id,
          title: current.title,
          text: current.lines.join(' ').replace(/\s+/g, ' ').trim(),
        });
      }
      const title = stripMarkdown(heading[2]);
      current = {
        id: slugify(title, slugCounts),
        title,
        lines: [],
      };
      continue;
    }

    // Skip top-level h1 and markdown table separator rows
    if (/^#\s+/.test(trimmed)) continue;
    if (/^[-:| ]+$/.test(trimmed)) continue;

    const clean = stripMarkdown(trimmed);
    if (!clean) continue;

    if (current) {
      current.lines.push(clean);
    } else {
      introLines.push(clean);
    }
  }

  if (current) {
    sections.push({
      id: current.id,
      title: current.title,
      text: current.lines.join(' ').replace(/\s+/g, ' ').trim(),
    });
  }

  return {
    intro: introLines.join(' ').replace(/\s+/g, ' ').trim(),
    sections,
  };
}

function buildIndexForLocale(locale: string): SearchPage[] {
  const docsDir = join(ROUTES_DIR, locale, '(docs)');
  const files = walkMdx(docsDir).sort();
  const pages: SearchPage[] = [];

  for (const file of files) {
    const rel = relative(docsDir, dirname(file)).replace(/\\/g, '/');
    const href = rel ? `/${rel}/` : '/';
    if (href === '/components/') continue;

    const section = rel.startsWith('components') ? 'Components' : 'Overview';
    const raw = readFileSync(file, 'utf8');
    const { title, description, body } = parseFrontmatter(raw);
    const { intro, sections } = extractSections(body);

    pages.push({
      href,
      title: title || rel.split('/').pop() || 'Docs',
      section,
      description,
      text: intro,
      sections,
    });
  }

  return pages;
}

mkdirSync(PUBLIC_DIR, { recursive: true });
for (const locale of LOCALES) {
  const pages = buildIndexForLocale(locale);
  const outPath = join(PUBLIC_DIR, `search-index-${locale}.json`);
  writeFileSync(outPath, JSON.stringify(pages));
  console.log(`search: wrote ${pages.length} pages to ${relative(DOCS_ROOT, outPath)}`);
}
