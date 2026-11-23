import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { systemInstruction } from './translator.ts';

describe('systemInstruction', () => {
  it('builds instructions from i18n/glossary.json', () => {
    const prompt = systemInstruction('ja');
    assert.match(prompt, /from English to Japanese/);
    assert.match(prompt, /Keep in English: leve-ui, Qwik/);
    assert.match(prompt, /Glossary \(follow these translations strictly\):/);
    assert.match(prompt, /"part \/ parts \(component parts\)" -> パーツ/);
  });

  it('throws for an unconfigured locale', () => {
    assert.throws(() => systemInstruction('xx'), /No translation settings for locale "xx"/);
  });
});
