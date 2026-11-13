import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { checkPlaceholders, extractSegments, translateMdx } from './segments.ts';

const page = `---
title: Tabs
description: A set of panels shown one at a time.
---

import { Tabs } from '@leve-ui/tabs';

# Tabs

Use \`orientation\` to lay out the [tab list](/components/tabs/) **vertically**.

<Demo id="tabs/default" />

\`\`\`tsx
const notTranslated = true;
\`\`\`

- An item with <Kbd>Enter</Kbd>

| Key | Description |
| --- | --- |
| \`Home\` | Moves to the first tab. |
`;

describe('extractSegments', () => {
  it('extracts frontmatter, headings, paragraphs, list items and table cells', () => {
    assert.deepEqual(
      extractSegments(page).map((s) => s.text),
      [
        'Tabs',
        'A set of panels shown one at a time.',
        'Tabs',
        'Use <x0/> to lay out the <x1>tab list</x1> <x2>vertically</x2>.',
        'An item with <x0/>',
        'Key',
        'Description',
        'Moves to the first tab.',
      ],
    );
  });

  it('describes each placeholder', () => {
    const segment = extractSegments(page)[3];
    assert.deepEqual(segment.placeholders, {
      x0: '`orientation`',
      x1: '[…](/components/tabs/)',
      x2: '<strong>…</strong>',
    });
  });

  it('skips cells without words', () => {
    assert.ok(!extractSegments(page).some((s) => s.text === '<x0/>'));
  });
});

describe('translateMdx', () => {
  const ja: Record<string, string> = {
    'A set of panels shown one at a time.': '一度に 1 つずつ表示するパネル。',
    'Use <x0/> to lay out the <x1>tab list</x1> <x2>vertically</x2>.':
      '<x0/> で<x1>タブの一覧</x1>を<x2>縦に</x2>並べます。',
    'Moves to the first tab.': '最初のタブに移ります。',
  };
  const { mdx, translated, total } = translateMdx(page, (text) => ja[text]);

  it('writes translations back and keeps everything else', () => {
    assert.equal(translated, 3);
    assert.equal(total, 8);
    assert.match(mdx, /^description: "一度に 1 つずつ表示するパネル。"$/m);
    assert.match(
      mdx,
      /^`orientation` で\[タブの一覧\]\(\/components\/tabs\/\)を<strong>縦に<\/strong>並べます。$/m,
    );
    assert.match(mdx, /^\| `Home` \| 最初のタブに移ります。 \|$/m);
    assert.ok(mdx.includes("import { Tabs } from '@leve-ui/tabs';"));
    assert.ok(mdx.includes('<Demo id="tabs/default" />'));
    assert.ok(mdx.includes('const notTranslated = true;'));
  });

  it('escapes characters that MDX reads as JSX', () => {
    const result = translateMdx(page, (text) =>
      text === 'Moves to the first tab.' ? '{a} < b' : undefined,
    );
    assert.ok(result.mdx.includes('| \\{a\\} \\< b |'));
  });

  it('rejects translations that lose a placeholder', () => {
    assert.throws(() =>
      translateMdx(page, (text) => (text.startsWith('Use') ? 'タブを縦に並べます。' : undefined)),
    );
  });
});

describe('checkPlaceholders', () => {
  it('accepts reordered placeholders', () => {
    assert.equal(checkPlaceholders('<x0/> and <x1/>', '<x1/> と <x0/>'), undefined);
  });

  it('rejects missing, duplicated or misordered placeholders', () => {
    assert.ok(checkPlaceholders('<x0/> and <x1/>', '<x0/>'));
    assert.ok(checkPlaceholders('<x0/>', '<x0/><x0/>'));
    assert.ok(checkPlaceholders('<x0>a</x0>', '</x0>a<x0>'));
  });
});
