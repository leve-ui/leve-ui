#!/usr/bin/env node
/**
 * 新しい ADR を adr/template.md から作成し、adr/README.md の一覧に追加します。
 *
 * 使い方:
 *   node .agents/skills/write-adr/scripts/new-adr.mjs "Use Floating UI for positioning"
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const ADR_DIR = join(ROOT, 'adr');

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error(
    '✖ Please provide a title in English. e.g. new-adr.mjs "Use Floating UI for positioning"',
  );
  process.exit(1);
}
if (/[^\x20-\x7E]/.test(title)) {
  console.error('✖ ADR titles must be in English (ASCII only).');
  process.exit(1);
}

const numbers = readdirSync(ADR_DIR)
  .map((f) => /^(\d{4})-/.exec(f)?.[1])
  .filter(Boolean)
  .map(Number);
const number = String(Math.max(0, ...numbers) + 1).padStart(4, '0');
const slug = title
  .toLowerCase()
  .replace(/[`'"]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');
const fileName = `${number}-${slug}.md`;
const today = new Date().toISOString().slice(0, 10);

const template = readFileSync(join(ADR_DIR, 'template.md'), 'utf8');
const content = template
  .replace(/^# NNNN\. .*$/m, `# ${number}. ${title}`)
  .replace(/^- Status: .*$/m, '- Status: Proposed')
  .replace(/^- Date: .*$/m, `- Date: ${today}`);
writeFileSync(join(ADR_DIR, fileName), content);

const readmePath = join(ADR_DIR, 'README.md');
const readme = readFileSync(readmePath, 'utf8').trimEnd().split('\n');
const lastRow = readme.findLastIndex((line) => /^\| \[\d{4}\]/.test(line));
readme.splice(lastRow + 1, 0, `| [${number}](${fileName}) | ${title} | Proposed |`);
writeFileSync(readmePath, `${readme.join('\n')}\n`);

console.log(`✔ Created adr/${fileName} and added it to adr/README.md`);
