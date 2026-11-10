import { describe, expect, it } from 'vitest';
import { dataAttr } from './data-attr';

describe('dataAttr', () => {
  it('true のとき空文字を返す', () => {
    expect(dataAttr(true)).toBe('');
  });

  it('false / undefined のとき undefined を返す', () => {
    expect(dataAttr(false)).toBeUndefined();
    expect(dataAttr(undefined)).toBeUndefined();
  });
});
