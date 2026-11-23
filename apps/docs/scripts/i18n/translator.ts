/**
 * The translation engine behind one interface (adr/0033). The default is Gemini
 * on Vertex AI; another engine (e.g. DeepL) can implement the same interface.
 */
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, Type } from '@google/genai';

export type TranslationRequest = {
  id: string;
  /** English text with `<xN/>` / `<xN>…</xN>` placeholders */
  text: string;
  /** What each placeholder stands for, as context only */
  placeholders: Record<string, string>;
};

export interface Translator {
  /** Returns the translations by request id. Requests may be missing from the result. */
  translate(requests: TranslationRequest[], locale: string): Promise<Record<string, string>>;
}

type LocaleConfig = {
  name: string;
  style: string[];
  terms?: Record<string, string>;
};

type GlossaryConfig = {
  keepInEnglish: string[];
  locales: Record<string, LocaleConfig>;
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const GLOSSARY_PATH = join(resolve(__dirname, '../..'), 'i18n', 'glossary.json');

function readGlossary(): GlossaryConfig {
  return JSON.parse(readFileSync(GLOSSARY_PATH, 'utf8')) as GlossaryConfig;
}

export function systemInstruction(locale: string, glossary: GlossaryConfig = readGlossary()) {
  const language = glossary.locales[locale];
  if (!language) throw new Error(`No translation settings for locale "${locale}"`);

  const lines = [
    `You translate the documentation of leve-ui, a headless UI component library for Qwik, from English to ${language.name}.`,
    'Each request has an id, a text and the meaning of its placeholders.',
    'Rules:',
    '- Keep every placeholder exactly as written: `<x0/>` is replaced with code or a component, and `<x1>…</x1>` with a link or emphasis around the text between the tags. Translate the text between paired tags. You may move placeholders to fit the grammar, but never drop, duplicate, rename or add them.',
    '- The placeholder meanings are context only. Never write their content into the translation.',
    `- Keep in English: ${glossary.keepInEnglish.join(', ')}.`,
    '- Translate faithfully and concisely; do not add explanations.',
    ...language.style.map((rule) => `- ${rule}`),
  ];

  const terms = Object.entries(language.terms ?? {});
  if (terms.length > 0) {
    lines.push('- Glossary (follow these translations strictly):');
    for (const [source, target] of terms) {
      lines.push(`  - "${source}" -> ${target}`);
    }
  }

  lines.push('Return a JSON object that maps every request id to its translation.');
  return lines.join('\n');
}

export type GeminiOptions = {
  project: string;
  /** Vertex AI location. `global` serves the newest models. */
  location?: string;
  model?: string;
};

export const DEFAULT_GEMINI_MODEL = 'gemini-4-hydrogen';

/** Gemini on Vertex AI, authenticated with Application Default Credentials. */
export function geminiTranslator({
  project,
  location = 'global',
  model = DEFAULT_GEMINI_MODEL,
}: GeminiOptions): Translator {
  const ai = new GoogleGenAI({ vertexai: true, project, location });

  return {
    async translate(requests, locale) {
      const response = await ai.models.generateContent({
        model,
        contents: JSON.stringify(requests),
        config: {
          systemInstruction: systemInstruction(locale),
          temperature: 0.2,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: Object.fromEntries(requests.map((r) => [r.id, { type: Type.STRING }])),
            required: requests.map((r) => r.id),
          },
        },
      });
      const result: unknown = JSON.parse(response.text ?? '{}');
      if (typeof result !== 'object' || result === null) return {};
      return Object.fromEntries(
        Object.entries(result).filter((entry): entry is [string, string] => {
          return typeof entry[1] === 'string';
        }),
      );
    },
  };
}
