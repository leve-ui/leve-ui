#!/usr/bin/env node
/**
 * Single-shot PR review script powered by the Gemini REST API.
 *
 * Collects the PR metadata, filtered diff, full contents of modified files,
 * AGENTS.md, and path-relevant rule files under .agents/rules/, then requests
 * one structured review from Gemini and writes it to OUTPUT_FILE.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const thinkingLevel = process.env.GEMINI_THINKING_LEVEL || 'medium';
const repo = process.env.REPO;
const prNumber = process.env.PR_NUMBER;
const outputFile = process.env.OUTPUT_FILE || '/tmp/gemini-review.md';

if (!apiKey || !repo || !prNumber) {
  console.error('Missing required env vars: GEMINI_API_KEY, REPO, PR_NUMBER');
  process.exit(1);
}

const MAX_DIFF_CHARS = 120_000;
const MAX_FILE_CHARS = 20_000;
const MAX_TOTAL_FILES_CHARS = 100_000;

const IGNORED_PATTERNS = [
  /^pnpm-lock\.yaml$/,
  /^apps\/docs\/i18n\/.*\.json$/,
  /(^|\/)(dist|lib|lib-types|storybook-static|styled-system)\//,
  /\.(svg|png|jpe?g|gif|webp|ico|woff2?|pen)$/i,
];

function isIgnored(filePath) {
  return IGNORED_PATTERNS.some((pattern) => pattern.test(filePath));
}

function runGh(args) {
  return execFileSync('gh', args, {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
}

function filterDiff(rawDiff) {
  const sections = rawDiff.split(/(?=^diff --git )/m);
  const kept = [];
  for (const section of sections) {
    if (!section.trim()) continue;
    const match = section.match(/^diff --git a\/(.+?) b\/(.+?)$/m);
    const filePath = match ? match[2] : '';
    if (filePath && isIgnored(filePath)) continue;
    kept.push(section);
  }
  const combined = kept.join('');
  if (combined.length <= MAX_DIFF_CHARS) return combined;
  return `${combined.slice(0, MAX_DIFF_CHARS)}\n\n... [diff truncated at ${MAX_DIFF_CHARS} chars]`;
}

function selectRuleFiles(filePaths) {
  const rules = new Set(['.agents/rules/git-commit.md']);
  for (const path of filePaths) {
    if (path.startsWith('packages/components/')) {
      rules.add('.agents/rules/accessibility.md');
      rules.add('.agents/rules/component-architecture.md');
      rules.add('.agents/rules/testing.md');
      rules.add('.agents/rules/project-structure.md');
    } else if (path.startsWith('packages/core/') || path.startsWith('packages/utils/')) {
      rules.add('.agents/rules/component-architecture.md');
      rules.add('.agents/rules/testing.md');
      rules.add('.agents/rules/project-structure.md');
    } else if (path.startsWith('apps/storybook/')) {
      rules.add('.agents/rules/storybook.md');
      rules.add('.agents/rules/testing.md');
    } else if (path.startsWith('apps/e2e/')) {
      rules.add('.agents/rules/testing.md');
    } else if (path.startsWith('apps/docs/')) {
      rules.add('.agents/rules/docs-site.md');
    } else if (
      path.startsWith('.github/') ||
      path.startsWith('.agents/') ||
      path === 'AGENTS.md' ||
      path === 'CONTRIBUTING.md'
    ) {
      rules.add('.agents/rules/project-structure.md');
    }
  }
  return [...rules].filter((rulePath) => existsSync(rulePath));
}

function readChangedFiles(filePaths) {
  const chunks = [];
  let totalChars = 0;
  for (const path of filePaths) {
    if (isIgnored(path) || !existsSync(path)) continue;
    let content;
    try {
      content = readFileSync(path, 'utf8');
    } catch {
      continue;
    }
    if (content.includes('\0')) continue;
    const trimmed =
      content.length > MAX_FILE_CHARS
        ? `${content.slice(0, MAX_FILE_CHARS)}\n... [truncated at ${MAX_FILE_CHARS} chars]`
        : content;
    if (totalChars + trimmed.length > MAX_TOTAL_FILES_CHARS) break;
    totalChars += trimmed.length;
    chunks.push(`### ${path}\n\`\`\`\n${trimmed}\n\`\`\``);
  }
  return chunks.join('\n\n');
}

const prData = JSON.parse(
  runGh(['pr', 'view', prNumber, '--repo', repo, '--json', 'title,body,files']),
);
const changedPaths = (prData.files ?? []).map((f) => f.path);
const rawDiff = runGh(['pr', 'diff', prNumber, '--repo', repo]);
const diff = filterDiff(rawDiff);

if (!diff.trim()) {
  writeFileSync(outputFile, '# Gemini PR Review\n\nNo issues found.\n');
  console.log('No reviewable diff after filtering ignored files.');
  process.exit(0);
}

const agentsMd = existsSync('AGENTS.md') ? readFileSync('AGENTS.md', 'utf8') : '';
const ruleFiles = selectRuleFiles(changedPaths);
const rulesContent = ruleFiles
  .map((rulePath) => `### ${rulePath}\n${readFileSync(rulePath, 'utf8')}`)
  .join('\n\n');
const changedFilesContent = readChangedFiles(changedPaths);

const systemInstruction = `You are an assertive, thorough code reviewer for \`leve-ui\` (a Headless UI library for Qwik).
Review the Pull Request in English.

Focus strictly on:
- Bugs, security vulnerabilities, edge cases, and Qwik SSR/hydration pitfalls (\`useId()\`, avoiding \`Math.random()\`, \`useVisibleTask$\` justification, parent/child state ordering)
- WAI-ARIA / APG compliance (native elements, required \`role\`/\`aria-*\` after \`{...props}\`, keyboard navigation, focus management)
- Headless architecture (1 DOM element = 1 part, \`data-leve-*\` / \`data-state\`, no bundled CSS/styles, \`useControllableState\`, \`useFieldControl\`)
- Missing unit tests, Storybook demos, E2E tests, or English changesets (never use \`major\` before 1.0)
- PR title format (English Conventional Commits) and repository rules

Output requirements:
- Keep output very concise to minimize length and tokens.
- Use ONLY this exact Markdown structure (omit long explanations and walkthroughs; include a short code block of a few lines only when strictly necessary to show a concrete fix):

# Gemini PR Review

## <Short Title>(🟣Critical)
- \`path/to/file:line\` — Concise issue and fix in 1-2 sentences.

## <Short Title>(🔴High)
- \`path/to/file:line\` — Concise issue and fix in 1-2 sentences.

## <Short Title>(🟠Middle)
- \`path/to/file:line\` — Concise issue and fix in 1-2 sentences.

## <Short Title>(🟢Low)
- \`path/to/file:line\` — Concise issue and fix in 1-2 sentences.

- Priority badges MUST be strictly one of \`(🟣Critical)\`, \`(🔴High)\`, \`(🟠Middle)\`, or \`(🟢Low)\`, ordered from highest to lowest severity.
- Omit any unused priority levels; only create sections for actual findings.
- If there are no actionable issues, output ONLY:
# Gemini PR Review

No issues found.`;

const userPrompt = `# Pull Request #${prNumber}

## Title
${prData.title ?? ''}

## Body
${prData.body ?? ''}

## Changed Files
${(prData.files ?? []).map((f) => `- ${f.path} (+${f.additions}/-${f.deletions})`).join('\n')}

## Repository Guidelines (AGENTS.md)
${agentsMd}

## Relevant Rules
${rulesContent}

## Full Contents of Modified Files
${changedFilesContent}

## Diff
\`\`\`diff
${diff}
\`\`\`
`;

const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

const response = await fetch(endpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-goog-api-key': apiKey,
  },
  body: JSON.stringify({
    systemInstruction: {
      parts: [{ text: systemInstruction }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      thinkingConfig: {
        thinkingLevel,
      },
    },
  }),
});

if (!response.ok) {
  const errorBody = await response.text();
  console.error(`Gemini API request failed (${response.status}): ${errorBody}`);
  process.exit(1);
}

const data = await response.json();
const parts = data.candidates?.[0]?.content?.parts ?? [];
const reviewText = parts
  .filter((part) => !part.thought && typeof part.text === 'string')
  .map((part) => part.text)
  .join('')
  .trim();

if (!reviewText) {
  console.error('Gemini API returned an empty review:', JSON.stringify(data));
  process.exit(1);
}

if (data.usageMetadata) {
  const { promptTokenCount, candidatesTokenCount, thoughtsTokenCount, totalTokenCount } =
    data.usageMetadata;
  console.log(
    `Model: ${model} (thinking=${thinkingLevel}) | Tokens: prompt=${promptTokenCount ?? 0}, output=${candidatesTokenCount ?? 0}, thoughts=${thoughtsTokenCount ?? 0}, total=${totalTokenCount ?? 0}`,
  );
}

writeFileSync(outputFile, `${reviewText}\n`);
