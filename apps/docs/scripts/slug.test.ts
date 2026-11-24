import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { extractHeadingIds } from './slug.ts';

describe('extractHeadingIds', () => {
  it('extracts heading ids in document order and deduplicates repeats', () => {
    const mdx = [
      '---',
      'title: Dialog',
      '---',
      '',
      '# Dialog',
      '',
      '## Installation',
      '',
      '```md',
      '## Ignored heading inside fence',
      '```',
      '',
      '## API Reference',
      '',
      '### `Root`',
      '',
      '### Root',
    ].join('\n');

    assert.deepEqual(extractHeadingIds(mdx), [
      'dialog',
      'installation',
      'api-reference',
      'root',
      'root-1',
    ]);
  });
});
