/**
 * Translates the segments that are missing from the translation memory and
 * removes entries whose English text no longer exists (adr/0033).
 *
 * Run: pnpm --filter @leve-ui/docs i18n:translate [--locale ja] [--dry-run] [--keep-stale]
 *
 * Environment:
 * - GCP_PROJECT_ID: Google Cloud project with Vertex AI (required unless --dry-run)
 * - GCP_LOCATION: Vertex AI location (default: global)
 * - GEMINI_MODEL: model id (default: see translator.ts)
 *
 * Authenticates with Application Default Credentials (`gcloud auth
 * application-default login` locally, Workload Identity Federation in CI).
 */
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
  const requests: TranslationRequest[] = texts.map((t, i) => ({ id: `s${i}`, ...t }));
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

async function translateLocale(locale: string, translator: Translator | undefined) {
  const memory: Memory = readMemory(locale);
  const texts = sourceTexts();
  const hashes = new Set(texts.map((t) => segmentHash(t.text)));

  const stale = Object.keys(memory).filter((hash) => !hashes.has(hash));
  if (!values['keep-stale']) for (const hash of stale) delete memory[hash];

  const missing = texts.filter((t) => !memory[segmentHash(t.text)]);
  const chars = missing.reduce((sum, t) => sum + t.text.length, 0);
  console.log(
    `${locale}: ${texts.length} segments, ${missing.length} missing (${chars} chars), ` +
      `${stale.length} stale${values['keep-stale'] ? ' (kept)' : ' (removed)'}`,
  );
  if (!translator) return 0;

  const save = (text: string, translation: string) => {
    memory[segmentHash(text)] = { source: text, translation };
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
  return errors;
}

const locales = (values.locale ?? LOCALES.filter((l) => l !== SOURCE_LOCALE)) as string[];
let translator: Translator | undefined;
if (!values['dry-run']) {
  const project = process.env.GCP_PROJECT_ID;
  if (!project) throw new Error('Set GCP_PROJECT_ID (or use --dry-run)');
  translator = geminiTranslator({
    project,
    location: process.env.GCP_LOCATION || undefined,
    model: process.env.GEMINI_MODEL || undefined,
  });
}

let errors = 0;
for (const locale of locales) errors += await translateLocale(locale, translator);
if (errors > 0) {
  console.error(`${errors} segments could not be translated with matching placeholders`);
  process.exitCode = 1;
}
