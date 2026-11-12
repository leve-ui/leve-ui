# 0033. Translate docs through a segment-level translation memory with Gemini

- Status: Proposed
- Date: 2026-11-13
- Related: [0021](0021-write-contributor-facing-documents-in-english.md), [0032](0032-author-docs-in-mdx-and-generate-api-reference-from-prop-types.md)

## Context

The docs site must be available in English and Japanese. There are also communities in Taiwan, France and Israel, so adding more languages later must be cheap.

Constraints:

- Copying every MDX file per language and editing the copies by hand does not scale: every change to the English page must be repeated in every language, and copies silently go stale.
- The maintainer cannot review every language. Machine translation is needed, but only changed text should be retranslated, and the result must be reviewable in pull requests.
- MDX contains code blocks, JSX components, inline code and links that must not be translated or broken.
- The maintainer's Google AI Pro plan includes a monthly Google Cloud credit that can be used for the Gemini API through Vertex AI. Credits may not apply to Google AI Studio prepaid balances.
- Hebrew is a right-to-left language. Supporting it affects the docs layout and the components' own keyboard behavior.

## Considered Options

### Source format

1. **One MDX file per language** — The common approach (Docusaurus, Starlight). Simple rendering, but every language is a full copy to keep in sync.
2. **Key-based messages (i18next style)** — Prose split into keys in JSON. Authoring becomes awkward and MDX loses its readability.
3. **Segment-level translation memory** — English MDX is the only source. A script parses MDX into an AST, extracts translatable segments, and stores translations per language in JSON keyed by a hash of the source segment. Localized MDX is generated at build time.

### Translation engine

1. **Gemini (Vertex AI)** — Follows instructions about markup and terminology well, returns structured JSON, and is covered by the existing monthly credit.
2. **DeepL API** — High quality, free tier, glossary support. Needs extra handling to protect inline markup.
3. **Google Cloud Translation** — Similar to DeepL, weaker on technical prose.

## Decision

- English MDX is the only hand-written source. We will not commit per-language copies of MDX.
- We will add a translation script that:
  1. Parses MDX with `remark` and extracts headings, paragraphs, list items and table cells as segments. Code blocks, imports and JSX components are skipped. Inline code, links and inline JSX inside a segment are replaced with numbered placeholders.
  2. Looks up each segment by the hash of its English text in `i18n/<locale>.json`, and sends only missing segments to the translation engine.
  3. Rejects translations whose placeholders do not match the source, retries, and fails if they still do not match.
- At build time, localized MDX is generated from the English AST and the translation memory into a git-ignored directory. Missing translations fall back to English.
- The same translation memory is used for generated API reference descriptions (JSDoc) and for UI strings of the docs site.
- Translations are produced in CI and proposed as a pull request that changes only `i18n/*.json`, so reviewers see source and translation pairs.
- The translation engine sits behind one interface (`translate(segments, locale)`). We will use Gemini through Vertex AI by default, with a low temperature and a prompt that keeps component names, part names, props and `data-*` attributes untranslated. A DeepL implementation may be added behind the same interface.
- CI authenticates to Google Cloud with Workload Identity Federation, not with a long-lived key.
- URLs are prefixed with the locale (`/en/...`, `/ja/...`). The docs layout uses logical CSS properties so that right-to-left languages can be added without rewriting it.
- We will launch with `en` and `ja`. `zh-TW` and `fr` are added when a community reviewer is available; until reviewed, pages in those languages show a "machine translated" notice. `he` is added only after right-to-left support of the components is designed in a separate issue. British English is served by the `en` locale.

## Rationale

- A translation memory keeps one source, retranslates only what changed, and makes stale translations impossible to miss (their hash no longer matches).
- Per-language MDX copies (option 1) would multiply maintenance by the number of languages. Key-based messages (option 2) make authoring prose painful.
- Gemini handles placeholders and terminology rules in prose better than sentence-level translation APIs, and its cost is covered by the existing credit given the small volume of changed segments.

## Consequences

- The translation script and the MDX generator must be maintained in `apps/docs`.
- Maintainers must set up a Google Cloud project with Vertex AI, Workload Identity Federation for this repository, and enable the Developer Program credit. AI agents must not create credentials or change Google Cloud settings.
- Rewording an English sentence retranslates it in every language. Small fixes cost a retranslation.
- Machine translations can be wrong; languages without a reviewer must be marked as machine translated.

## Revisit When

- The monthly credit no longer covers the translation volume, or the credit stops applying to Vertex AI.
- A community grows large enough to prefer a translation platform (Crowdin, etc.) with human translators.
