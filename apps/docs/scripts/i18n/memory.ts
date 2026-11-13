/**
 * The translation memory: apps/docs/i18n/<locale>.json (adr/0033).
 *
 * `{ "<hash of the English text>": { "source": "...", "translation": "..." } }`
 * The source is stored so that reviewers see both texts in pull requests. When
 * the English text changes, its hash changes, so a stale translation is never used.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SOURCE_LOCALE } from '../../src/i18n/locales.ts';
import { extractSegments, segmentHash } from './segments.ts';

export type MemoryEntry = { source: string; translation: string };
export type Memory = Record<string, MemoryEntry>;

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const ROUTES_DIR = join(docsRoot, 'src/routes');
export const SOURCE_DIR = join(ROUTES_DIR, SOURCE_LOCALE);
const MEMORY_DIR = join(docsRoot, 'i18n');

export function memoryPath(locale: string) {
  return join(MEMORY_DIR, `${locale}.json`);
}

export function readMemory(locale: string): Memory {
  const path = memoryPath(locale);
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {};
}

/** Writes the memory sorted by key, so that diffs stay small. */
export function writeMemory(locale: string, memory: Memory) {
  const sorted = Object.fromEntries(Object.entries(memory).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(memoryPath(locale), `${JSON.stringify(sorted, null, 2)}\n`);
}

/** Looks up the translation of a segment text. */
export function lookup(memory: Memory) {
  return (text: string) => memory[segmentHash(text)]?.translation;
}

export function* walkFiles(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkFiles(path);
    else yield path;
  }
}

/** Every segment text of the English pages, without duplicates, in page order. */
export function sourceTexts(): string[] {
  const texts = new Set<string>();
  for (const file of walkFiles(SOURCE_DIR)) {
    if (!file.endsWith('.mdx')) continue;
    for (const segment of extractSegments(readFileSync(file, 'utf8'))) texts.add(segment.text);
  }
  return [...texts];
}
