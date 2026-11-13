/**
 * Translates the segments that are missing from the translation memory,
 * removes entries whose English text no longer exists, and updates where each
 * text is used (adr/0033).
 *
 * Run: pnpm --filter @leve-ui/docs i18n:translate [--locale ja] [--dry-run] [--keep-stale]
 *
 * Vertex AI is only called when segments are missing; stale entries are removed
 * without it. `--dry-run` only counts, and writes `missing=<count>` to
 * $GITHUB_OUTPUT so that CI can skip authenticating when nothing is missing.
 *
 * Environment:
 * - GCP_PROJECT_ID: Google Cloud project with Vertex AI (required when segments are missing)
 * - GCP_LOCATION: Vertex AI location (default: global)
 * - GEMINI_MODEL: model id (default: see translator.ts)
 *
 * Authenticates with Application Default Credentials (`gcloud auth
 * application-default login` locally, Workload Identity Federation in CI).
 */
import { appendFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { LOCALES, SOURCE_LOCALE } from '../../src/i18n/locales.ts';
import { type Memory, readMemory, type SourceText, sourceTexts, writeMemory } from './memory.ts';
import { checkPlaceholders, segmentHash } from './segments.ts';
import { geminiTranslator, type TranslationRequest, type Translator } from './translator.ts';

const BATCH_SEGMENTS = 40;
const BATCH_CHARS = 8000;

const { values } = parseArgs({
  options: {
    locale: { type: 'string', multiple: true },
    'dry-run': { type: 'boolean', default: false },
    'keep-stale': { type: 'boolean', default: false },
  },
});

function batches(texts: SourceText[]): SourceText[][] {
  const result: SourceText[][] = [];
  let current: SourceText[] = [];
  let chars = 0;
  for (const text of texts) {
    if (
      current.length >= BATCH_SEGMENTS ||
      (current.length > 0 && chars + text.text.length > BATCH_CHARS)
    ) {
      result.push(current);
      current = [];
      chars = 0;
    }
    current.push(text);
    chars += text.text.length;
  }
  if (current.length > 0) result.push(current);
  return result;
}

/** Translates a batch and keeps only translations whose placeholders match. */
async function translateBatch(translator: Translator, texts: SourceText[], locale: string) {
  const requests: TranslationRequest[] = texts.map((t, i) => ({
    id: `s${i}`,
    text: t.text,
    placeholders: t.placeholders,
  }));
  const result = await translator.translate(requests, locale);
  const done = new Map<string, string>();
  const failed: { text: SourceText; problem: string }[] = [];
  for (const request of requests) {
    const translation = result[request.id];
    const problem =
      translation === undefined ? 'no translation' : checkPlaceholders(request.text, translation);
    if (problem || translation === undefined) {
      failed.push({
        text: texts[Number(request.id.slice(1))],
        problem: problem ?? 'no translation',
      });
    } else {
      done.set(request.text, translation);
    }
  }
  return { done, failed };
}

async function translateLocale(locale: string) {
  const memory: Memory = readMemory(locale);
  const texts = sourceTexts();
  const hashes = new Set(texts.map((t) => segmentHash(t.text)));

  const stale = Object.keys(memory).filter((hash) => !hashes.has(hash));
  if (!values['keep-stale']) for (const hash of stale) delete memory[hash];

  const missing = texts.filter((t) => !memory[segmentHash(t.text)]);
  const where = new Map(texts.map((t) => [segmentHash(t.text), t.where]));
  for (const [hash, entry] of Object.entries(memory)) {
    const used = where.get(hash);
    if (used) entry.where = used;
  }
  const chars = missing.reduce((sum, t) => sum + t.text.length, 0);
  console.log(
    `${locale}: ${texts.length} segments, ${missing.length} missing (${chars} chars), ` +
      `${stale.length} stale${values['keep-stale'] ? ' (kept)' : ' (removed)'}`,
  );
  if (values['dry-run']) return { missing: missing.length, errors: 0 };
  if (missing.length === 0) {
    writeMemory(locale, memory);
    return { missing: 0, errors: 0 };
  }
  const translator = getTranslator();

  const save = (text: string, translation: string) => {
    const hash = segmentHash(text);
    memory[hash] = { source: text, translation, where: where.get(hash) };
  };

  let errors = 0;
  const list = batches(missing);
  for (const [index, batch] of list.entries()) {
    const first = await translateBatch(translator, batch, locale);
    for (const [text, translation] of first.done) save(text, translation);
    let failed = first.failed;
    if (failed.length > 0) {
      // Retry once, then give up on the segments that still do not match
      const retry = await translateBatch(
        translator,
        failed.map((f) => f.text),
        locale,
      );
      for (const [text, translation] of retry.done) save(text, translation);
      failed = retry.failed;
    }
    for (const { text, problem } of failed) {
      errors++;
      console.error(`  ✗ ${problem}\n    ${text.text}`);
    }
    // Save after every batch, so a failure later keeps the work done so far
    writeMemory(locale, memory);
    console.log(
      `  batch ${index + 1}/${list.length}: ${batch.length - failed.length}/${batch.length}`,
    );
  }
  writeMemory(locale, memory);
  return { missing: missing.length, errors };
}

const locales = (values.locale ?? LOCALES.filter((l) => l !== SOURCE_LOCALE)) as string[];
let translator: Translator | undefined;
/** Created only when there is something to translate. */
function getTranslator(): Translator {
  if (translator) return translator;
  const project = process.env.GCP_PROJECT_ID;
  if (!project) throw new Error('Set GCP_PROJECT_ID (or use --dry-run)');
  translator = geminiTranslator({
    project,
    location: process.env.GCP_LOCATION || undefined,
    model: process.env.GEMINI_MODEL || undefined,
  });
  return translator;
}

let errors = 0;
let missing = 0;
for (const locale of locales) {
  const result = await translateLocale(locale);
  errors += result.errors;
  missing += result.missing;
}
if (values['dry-run'] && process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `missing=${missing}\n`);
}
if (errors > 0) {
  console.error(`${errors} segments could not be translated with matching placeholders`);
  process.exitCode = 1;
}
