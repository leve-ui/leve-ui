/**
 * Shared heading slug utilities for the docs search index and MDX compilation.
 */

export function slugify(text: string, counts: Map<string, number>): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[`*_~()[\]{}.,:;!?'"/\\<>@#$%^&+=|]/g, '')
    .replace(/\s+/g, '-');
  const count = counts.get(base) ?? 0;
  counts.set(base, count + 1);
  return count === 0 ? base : `${base}-${count}`;
}

export function stripMarkdown(line: string): string {
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

/**
 * Extracts GitHub-style heading IDs (h1–h6) in document order from an MDX source string.
 */
export function extractHeadingIds(mdxSource: string): string[] {
  const body = mdxSource.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  const counts = new Map<string, number>();
  const ids: string[] = [];
  let inFence = false;

  for (const rawLine of body.split(/\r?\n/)) {
    const trimmed = rawLine.trim();
    if (trimmed.startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = trimmed.match(/^#{1,6}\s+(.+)$/);
    if (!match) continue;
    ids.push(slugify(stripMarkdown(match[1]), counts));
  }

  return ids;
}
