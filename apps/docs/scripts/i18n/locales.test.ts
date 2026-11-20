import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { matchLocale, SOURCE_LOCALE } from '../../src/i18n/locales.ts';

describe('matchLocale', () => {
  it('matches exact or base locale in preference order', () => {
    assert.equal(matchLocale(['ja-JP', 'en-US']), 'ja');
    assert.equal(matchLocale(['fr-FR', 'ja']), 'ja');
    assert.equal(matchLocale(['en-GB', 'ja-JP']), 'en');
  });

  it('falls back to SOURCE_LOCALE when no language matches', () => {
    assert.equal(matchLocale(['fr-FR', 'de-DE']), SOURCE_LOCALE);
    assert.equal(matchLocale([]), SOURCE_LOCALE);
  });
});
