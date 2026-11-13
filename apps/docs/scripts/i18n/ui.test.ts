import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { textSegment, uiStrings } from './ui.ts';

describe('textSegment', () => {
  it('protects inline code and {name} placeholders', () => {
    const segment = textSegment('Also accepts all {element} attributes, like `id`.');
    assert.equal(segment.text, 'Also accepts all <x0/> attributes, like <x1/>.');
    assert.equal(segment.restore('<x1/> など、<x0/> の属性'), '`id` など、{element} の属性');
  });

  it('rejects translations that lose a placeholder', () => {
    assert.throws(() => textSegment('Set `value`.').restore('値を設定します。'));
  });
});

describe('uiStrings', () => {
  it('collects literals in t(locale, ...) and msg(...)', () => {
    const src = mkdtempSync(join(tmpdir(), 'leve-i18n-'));
    mkdirSync(join(src, 'components'));
    writeFileSync(
      join(src, 'components/a.tsx'),
      "t(locale, 'On this page'); msg(\"It's here\"); t(locale, item.title); // msg('...')",
    );
    mkdirSync(join(src, 'routes/ja'), { recursive: true });
    writeFileSync(join(src, 'routes/ja/b.tsx'), "t(locale, 'Generated')");
    assert.deepEqual(uiStrings(src), [
      { text: 'On this page', where: 'src/components/a.tsx' },
      { text: "It's here", where: 'src/components/a.tsx' },
    ]);
  });
});
