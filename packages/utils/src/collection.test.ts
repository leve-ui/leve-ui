import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import {
  getAdjacentItem,
  getCollectionItems,
  getItemTextValue,
  isItemDisabled,
  itemId,
} from './collection';

const { screen } = await createDOM();
const doc = screen.ownerDocument as unknown as Document;

function id(item: HTMLElement | null) {
  return item?.id;
}

function html(markup: string) {
  const root = doc.createElement('div');
  root.innerHTML = markup;
  return root;
}

describe('getCollectionItems', () => {
  it('DOM の順に返し、入れ子のコレクションの項目を除く', () => {
    const root = html(`
      <div data-item id="a"></div>
      <div data-list><div data-item id="nested"></div></div>
      <div data-item id="b"></div>
    `);
    expect(getCollectionItems(root, '[data-item]').map((item) => item.id)).toEqual([
      'a',
      'nested',
      'b',
    ]);
    expect(getCollectionItems(root, '[data-item]', '[data-list]').map((item) => item.id)).toEqual([
      'a',
      'b',
    ]);
  });

  it('root 自身が入れ子の selector に一致しても、その直下の項目は含める', () => {
    const outer = html('<div data-list id="root"><div data-item id="a"></div></div>');
    const root = outer.querySelector<HTMLElement>('#root');
    if (!root) throw new Error('no root');
    expect(getCollectionItems(root, '[data-item]', '[data-list]').map((item) => item.id)).toEqual([
      'a',
    ]);
  });
});

describe('isItemDisabled / getItemTextValue', () => {
  it('data-disabled と aria-disabled を無効とみなす', () => {
    const root = html('<div data-disabled></div><div aria-disabled="true"></div><div></div>');
    expect(Array.from(root.children).map(isItemDisabled)).toEqual([true, true, false]);
  });

  it('data-text-value を優先し、なければ textContent を trim して返す', () => {
    const root = html('<div data-text-value="Apple"> 🍎 Apple </div><div>  Banana </div>');
    expect(Array.from(root.children).map(getItemTextValue)).toEqual(['Apple', 'Banana']);
  });
});

describe('getAdjacentItem', () => {
  const root = html(
    '<div id="a"></div><div id="b" data-disabled></div><div id="c"></div><div id="d"></div>',
  );
  const items = Array.from(root.children) as HTMLElement[];
  const [a, , c, d] = items;

  it('first / last は有効な項目の端を返す', () => {
    expect(id(getAdjacentItem(items, null, 'first'))).toBe('a');
    expect(id(getAdjacentItem(items, null, 'last'))).toBe('d');
  });

  it('next / previous は無効な項目を飛ばす', () => {
    expect(id(getAdjacentItem(items, a, 'next'))).toBe('c');
    expect(id(getAdjacentItem(items, c, 'previous'))).toBe('a');
  });

  it('current がなければ next は最初、previous は最後', () => {
    expect(id(getAdjacentItem(items, null, 'next'))).toBe('a');
    expect(id(getAdjacentItem(items, null, 'previous'))).toBe('d');
  });

  it('端では loop のときだけ反対側へ回る', () => {
    expect(id(getAdjacentItem(items, d, 'next'))).toBe('d');
    expect(id(getAdjacentItem(items, d, 'next', { loop: true }))).toBe('a');
    expect(id(getAdjacentItem(items, a, 'previous', { loop: true }))).toBe('d');
  });

  it('有効な項目がなければ null', () => {
    expect(getAdjacentItem([items[1]], null, 'first')).toBeNull();
  });
});

describe('itemId', () => {
  it('英数字と - はそのまま、それ以外は 16 進に置き換える', () => {
    expect(itemId('list', 'apple-1')).toBe('list-item-apple-1');
    expect(itemId('list', 'a b')).toBe('list-item-a_20_b');
    expect(itemId('list', 'ü')).toBe('list-item-_fc_');
  });

  it('違う値から同じ id を作らない', () => {
    const values = ['a b', 'a-b', 'a_b', 'a_20_b', 'a__b', ''];
    const ids = values.map((value) => itemId('list', value));
    expect(new Set(ids).size).toBe(values.length);
  });
});
