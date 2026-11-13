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
import { propDescriptions, textSegment, uiStrings } from './ui.ts';

export type MemoryEntry = { source: string; translation: string };
export type Memory = Record<string, MemoryEntry>;

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const SRC_DIR = join(docsRoot, 'src');
export const ROUTES_DIR = join(SRC_DIR, 'routes');
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

/** A text to translate, with what its placeholders stand for. */
export type SourceText = { text: string; placeholders: Record<string, string> };

/**
 * Every segment of the English pages, UI strings and props descriptions,
 * without duplicates, in that order. Run scripts/generate-props.ts first.
 */
export function sourceTexts(): SourceText[] {
  const texts = new Map<string, SourceText>();
  const add = ({ text, placeholders }: SourceText) => {
    if (!texts.has(text)) texts.set(text, { text, placeholders });
  };
  for (const file of walkFiles(SOURCE_DIR)) {
    if (file.endsWith('.mdx')) extractSegments(readFileSync(file, 'utf8')).forEach(add);
  }
  for (const text of [...uiStrings(SRC_DIR), ...propDescriptions(SRC_DIR)]) add(textSegment(text));
  return [...texts.values()];
}
