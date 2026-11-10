import { describe, expect, it } from 'vitest';
import { withCssVars } from './style';

describe('withCssVars', () => {
  it('style が無いときは CSS 変数だけのオブジェクトを返す', () => {
    expect(withCssVars(undefined, { '--a': '1' })).toEqual({ '--a': '1' });
  });

  it('オブジェクトの style に CSS 変数を足す', () => {
    expect(withCssVars({ color: 'red' }, { '--a': '1' })).toEqual({ color: 'red', '--a': '1' });
  });

  it('文字列の style に CSS 変数を足す', () => {
    expect(withCssVars('color: red;', { '--a': '1' })).toBe('color: red; --a: 1');
    expect(withCssVars('', { '--a': '1' })).toBe('--a: 1');
  });

  it('値が undefined の CSS 変数は出力せず、元の style をそのまま返す', () => {
    const style = { color: 'red' };
    expect(withCssVars(style, { '--a': undefined })).toBe(style);
    expect(withCssVars('color: red', { '--a': undefined })).toBe('color: red');
  });

  it('利用者が同じ CSS 変数を渡しても、ライブラリの値を優先する', () => {
    expect(withCssVars({ '--a': 'user' }, { '--a': 'lib' })).toEqual({ '--a': 'lib' });
  });
});
