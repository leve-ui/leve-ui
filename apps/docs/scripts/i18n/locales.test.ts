import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  getLocale,
  localeRouteDir,
  localizeHref,
  matchLocale,
  SOURCE_LOCALE,
  stripLocale,
} from '../../src/i18n/locales.ts';

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

describe('localizeHref', () => {
  it('serves the default locale at root without a prefix', () => {
    assert.equal(localizeHref('/', 'en'), '/');
    assert.equal(localizeHref('/components/dialog/', 'en'), '/components/dialog/');
  });

  it('prefixes non-default locales', () => {
    assert.equal(localizeHref('/', 'ja'), '/ja/');
    assert.equal(localizeHref('/components/dialog/', 'ja'), '/ja/components/dialog/');
  });

  it('preserves external links and already-localized hrefs', () => {
    assert.equal(localizeHref('https://example.com', 'ja'), 'https://example.com');
    assert.equal(localizeHref('/ja/overview/', 'ja'), '/ja/overview/');
  });
});

describe('getLocale / stripLocale / localeRouteDir', () => {
  it('detects and strips locale prefixes', () => {
    assert.equal(getLocale('/'), 'en');
    assert.equal(getLocale('/components/dialog/'), 'en');
    assert.equal(getLocale('/ja/'), 'ja');
    assert.equal(getLocale('/ja/components/dialog/'), 'ja');

    assert.equal(stripLocale('/'), '/');
    assert.equal(stripLocale('/components/dialog/'), '/components/dialog/');
    assert.equal(stripLocale('/ja/'), '/');
    assert.equal(stripLocale('/ja/components/dialog/'), '/components/dialog/');
  });

  it('maps locales to route directory names', () => {
    assert.equal(localeRouteDir('en'), '(en)');
    assert.equal(localeRouteDir('ja'), 'ja');
  });
});
