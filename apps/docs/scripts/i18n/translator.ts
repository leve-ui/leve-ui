/**
 * The translation engine behind one interface (adr/0033). The default is Gemini
 * on Vertex AI; another engine (e.g. DeepL) can implement the same interface.
 */
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

const LANGUAGES: Record<string, { name: string; style: string }> = {
  ja: {
    name: 'Japanese',
    style:
      'Use the polite です／ます style of Japanese technical documentation. Use full-width 、 and 。. ' +
      'Headings, table headers and navigation labels are short noun phrases without 。. ' +
      'Do not put spaces between Japanese and English words or placeholders unless the source needs them.',
  },
};

function systemInstruction(locale: string) {
  const language = LANGUAGES[locale];
  if (!language) throw new Error(`No translation settings for locale "${locale}"`);
  return [
    `You translate the documentation of leve-ui, a headless UI component library for Qwik, from English to ${language.name}.`,
    'Each request has an id, a text and the meaning of its placeholders.',
    'Rules:',
    '- Keep every placeholder exactly as written: `<x0/>` is replaced with code or a component, and `<x1>…</x1>` with a link whose text is between the tags. Translate the text between paired tags. You may move placeholders to fit the grammar, but never drop, duplicate, rename or add them.',
    '- The placeholder meanings are context only. Never write their content into the translation.',
    '- Keep in English: leve-ui, Qwik, Qwik City, component names (e.g. Accordion, Radio Group, Toggle Group), part names (e.g. Root, Trigger, Content, HiddenInput), prop names, HTML elements and attributes, data-* attributes, CSS properties, key names (e.g. Enter, ArrowDown), WAI-ARIA, APG, and other product names.',
    '- Keep Markdown emphasis (`*text*`, `**text**`) around the translated words.',
    '- Translate faithfully and concisely; do not add explanations.',
    `- ${language.style}`,
    'Return a JSON object that maps every request id to its translation.',
  ].join('\n');
}

export type GeminiOptions = {
  project: string;
  /** Vertex AI location. `global` serves the newest models. */
  location?: string;
  model?: string;
};

export const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash';

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
