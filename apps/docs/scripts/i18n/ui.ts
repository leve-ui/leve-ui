/**
 * UI strings and props descriptions, translated with the same memory as the
 * pages (adr/0033).
 *
 * - UI strings: literals in `t(locale, '...')` and `msg('...')` calls in src.
 * - Props descriptions: from src/generated/props (scripts/generate-props.ts).
 *
 * Both are plain text: `` `code` `` and `{name}` become `<xN/>` placeholders.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { LOCALES, SOURCE_LOCALE } from '../../src/i18n/locales.ts';
import type { ComponentDoc } from '../generate-props.ts';
import { checkPlaceholders } from './segments.ts';

export type TextSegment = {
  text: string;
  placeholders: Record<string, string>;
  restore: (translation: string) => string;
};

const PROTECTED = /`[^`]+`|\{\w+\}/g;
const CALL = /\b(?:t\(\s*locale\s*,|msg\()\s*(['"])((?:\\.|(?!\1).)*)\1\s*\)/g;

/** Splits plain text into a segment with placeholders. */
export function textSegment(source: string): TextSegment {
  const raw: string[] = [];
  const text = source.replace(PROTECTED, (match) => `<x${raw.push(match) - 1}/>`);
  return {
    text,
    placeholders: Object.fromEntries(raw.map((value, id) => [`x${id}`, value])),
    restore: (translation) => {
      const problem = checkPlaceholders(text, translation);
      if (problem) throw new Error(`${problem}\n  source: ${text}\n  translation: ${translation}`);
      return translation.replace(/<x(\d+)\/>/g, (_, id) => raw[Number(id)]);
    },
  };
}

function* sourceFiles(dir: string, src: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    const rel = relative(src, path).split(sep);
    // Generated code and the generated locales
    if (rel[0] === 'generated') continue;
    if (rel[0] === 'routes' && LOCALES.some((l) => l !== SOURCE_LOCALE && rel[1] === l)) continue;
    if (entry.isDirectory()) yield* sourceFiles(path, src);
    else if (/\.tsx?$/.test(entry.name)) yield path;
  }
}

/** English UI strings written in `t(locale, '...')` / `msg('...')` calls. */
export function uiStrings(src: string): string[] {
  const strings = new Set<string>();
  for (const file of sourceFiles(src, src)) {
    for (const match of readFileSync(file, 'utf8').matchAll(CALL)) {
      const text = match[2].replace(/\\(.)/g, '$1');
      // Skips examples in comments such as `msg('...')`
      if (/\p{L}/u.test(text)) strings.add(text);
    }
  }
  return [...strings];
}

/** Descriptions of every prop in the generated props tables. */
export function propDescriptions(src: string): string[] {
  const dir = join(src, 'generated/props');
  if (!existsSync(dir)) return [];
  const descriptions = new Set<string>();
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.json')) continue;
    const doc: ComponentDoc = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    for (const part of Object.values(doc.parts)) {
      for (const prop of part.props) if (prop.description) descriptions.add(prop.description);
    }
  }
  return [...descriptions];
}
