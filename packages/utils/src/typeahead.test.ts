import { createDOM } from '@builder.io/qwik/testing';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { getTypeaheadIndex, isTypeaheadKey, moveTypeaheadFocus, resetTypeahead } from './typeahead';

describe('getTypeaheadIndex', () => {
  it('大文字小文字を区別せず、ラベルの前後の空白を trim して次の項目に一致する', () => {
    const labels = ['  Apple  ', 'Banana', '  cherry  '];
    expect(getTypeaheadIndex('a', -1, labels)).toBe(0);
    expect(getTypeaheadIndex('A', -1, labels)).toBe(0);
    expect(getTypeaheadIndex('c', -1, labels)).toBe(2);
    expect(getTypeaheadIndex('C', -1, labels)).toBe(2);
  });

  it('同じ文字の繰り返し入力 ("b", "bb", "bbb") は一致する項目を循環する', () => {
    const labels = ['Banana', 'Berry', 'Blueberry'];
    // currentIndex: 0 ('Banana') から 'b' を入力 -> 次の 'Berry' (1)
    expect(getTypeaheadIndex('b', 0, labels)).toBe(1);
    // currentIndex: 1 ('Berry') から 'bb' を入力 -> 次の 'Blueberry' (2)
    expect(getTypeaheadIndex('bb', 1, labels)).toBe(2);
    // currentIndex: 2 ('Blueberry') から 'bbb' を入力 -> 先頭へ循環して 'Banana' (0)
    expect(getTypeaheadIndex('bbb', 2, labels)).toBe(0);

    // 一致する項目が 1 つしかない場合は移動先がないため null を返す
    const singleMatch = ['Banana', 'Apple', 'Cherry'];
    expect(getTypeaheadIndex('b', 0, singleMatch)).toBeNull();
  });

  it('複数文字の検索は、現在の項目が一致していればそのまま維持し、一致しなければ次を探す', () => {
    const labels = ['Apple', 'Apricot', 'Banana'];

    // 現在の項目 (0: 'Apple') が "ap" に一致している場合、移動しないため null を返す
    expect(getTypeaheadIndex('ap', 0, labels)).toBeNull();

    // 現在の項目 (0: 'Apple') が "apr" に一致しない場合、次の一致項目 (1: 'Apricot') を返す
    expect(getTypeaheadIndex('apr', 0, labels)).toBe(1);

    // 現在の項目 (2: 'Banana') から "ap" を検索した場合、最初の一致項目 (0: 'Apple') を返す
    expect(getTypeaheadIndex('ap', 2, labels)).toBe(0);

    // 現在の項目 (1: 'Apricot') から "ap" を検索した場合、現在の項目が一致するため null を返す
    expect(getTypeaheadIndex('ap', 1, labels)).toBeNull();
  });

  it('フォーカス不可の項目をスキップする', () => {
    const labels = ['Apple', 'Apricot', 'Avocado'];
    const isFocusable = [true, false, true];

    // インデックス 1 ('Apricot') が無効な場合、インデックス 0 から 'a' を検索すると 2 ('Avocado') へ移動
    expect(getTypeaheadIndex('a', 0, labels, isFocusable)).toBe(2);

    // 有効な一致項目がない場合は null を返す
    expect(getTypeaheadIndex('a', 0, labels, [true, false, false])).toBeNull();
  });

  it('currentIndex が -1 の場合はインデックス 0 から検索する', () => {
    const labels = ['Banana', 'Apple', 'Apricot'];
    expect(getTypeaheadIndex('a', -1, labels)).toBe(1);
    expect(getTypeaheadIndex('ap', -1, labels)).toBe(1);
  });

  it('一致する項目がない場合は null を返す', () => {
    const labels = ['Apple', 'Banana'];
    expect(getTypeaheadIndex('z', 0, labels)).toBeNull();
    expect(getTypeaheadIndex('z', -1, labels)).toBeNull();
    expect(getTypeaheadIndex('a', 0, [])).toBeNull();
  });

  it('検索文字列が空の場合は null を返す', () => {
    const labels = ['Apple', 'Banana'];
    expect(getTypeaheadIndex('', 0, labels)).toBeNull();
    expect(getTypeaheadIndex('', -1, labels)).toBeNull();
  });
});

describe('isTypeaheadKey', () => {
  function createKeyEvent(
    key: string,
    modifiers: { ctrlKey?: boolean; metaKey?: boolean; altKey?: boolean; shiftKey?: boolean } = {},
  ): KeyboardEvent {
    return {
      key,
      ctrlKey: modifiers.ctrlKey ?? false,
      metaKey: modifiers.metaKey ?? false,
      altKey: modifiers.altKey ?? false,
      shiftKey: modifiers.shiftKey ?? false,
    } as unknown as KeyboardEvent;
  }

  it('英数字や記号（長さ 1 の文字）は true を返す', () => {
    expect(isTypeaheadKey(createKeyEvent('a'), '')).toBe(true);
    expect(isTypeaheadKey(createKeyEvent('Z'), '')).toBe(true);
    expect(isTypeaheadKey(createKeyEvent('0'), '')).toBe(true);
    expect(isTypeaheadKey(createKeyEvent('9'), '')).toBe(true);
    expect(isTypeaheadKey(createKeyEvent('-'), '')).toBe(true);
    expect(isTypeaheadKey(createKeyEvent('/'), '')).toBe(true);
  });

  it('修飾キー（Ctrl / Meta / Alt）が押されている場合は false を返す', () => {
    expect(isTypeaheadKey(createKeyEvent('a', { ctrlKey: true }), '')).toBe(false);
    expect(isTypeaheadKey(createKeyEvent('a', { metaKey: true }), '')).toBe(false);
    expect(isTypeaheadKey(createKeyEvent('a', { altKey: true }), '')).toBe(false);
    // Shift のみは true（大文字入力など）
    expect(isTypeaheadKey(createKeyEvent('A', { shiftKey: true }), '')).toBe(true);
  });

  it('Enter, ArrowDown, Tab などの特殊キーは false を返す', () => {
    expect(isTypeaheadKey(createKeyEvent('Enter'), '')).toBe(false);
    expect(isTypeaheadKey(createKeyEvent('ArrowDown'), '')).toBe(false);
    expect(isTypeaheadKey(createKeyEvent('ArrowUp'), '')).toBe(false);
    expect(isTypeaheadKey(createKeyEvent('Tab'), '')).toBe(false);
    expect(isTypeaheadKey(createKeyEvent('Escape'), '')).toBe(false);
    expect(isTypeaheadKey(createKeyEvent('Backspace'), '')).toBe(false);
  });

  it('スペースキーはバッファが空でない場合のみ true を返す', () => {
    expect(isTypeaheadKey(createKeyEvent(' '), '')).toBe(false);
    expect(isTypeaheadKey(createKeyEvent(' '), 'a')).toBe(true);
    expect(isTypeaheadKey(createKeyEvent(' '), 'new')).toBe(true);
  });
});

describe('moveTypeaheadFocus', () => {
  let doc: Document;

  beforeAll(async () => {
    const { screen } = await createDOM();
    doc = screen.ownerDocument as unknown as Document;
  });

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
    doc.body.innerHTML = '';
  });

  function dispatchKeyEvent(
    target: HTMLElement,
    key: string,
    modifiers: { ctrlKey?: boolean; metaKey?: boolean; altKey?: boolean } = {},
  ): KeyboardEvent {
    const event = doc.createEvent('Event') as unknown as KeyboardEvent;
    event.initEvent('keydown', true, true);
    Object.defineProperty(event, 'key', { value: key });
    if (modifiers.ctrlKey) Object.defineProperty(event, 'ctrlKey', { value: true });
    if (modifiers.metaKey) Object.defineProperty(event, 'metaKey', { value: true });
    if (modifiers.altKey) Object.defineProperty(event, 'altKey', { value: true });
    target.dispatchEvent(event as unknown as Event);
    return event;
  }

  function setupButtons(labels: string[]): HTMLButtonElement[] {
    const container = doc.createElement('div');
    doc.body.appendChild(container);
    const buttons: HTMLButtonElement[] = [];
    for (let i = 0; i < labels.length; i++) {
      const btn = doc.createElement('button');
      btn.textContent = labels[i];
      btn.tabIndex = i === 0 ? 0 : -1;
      container.appendChild(btn);
      buttons.push(btn);
    }
    return buttons;
  }

  it('一致する項目にフォーカスを移動し、tabIndex を更新して preventDefault を呼ぶ', () => {
    const [b0, b1, b2] = setupButtons(['Apple', 'Banana', 'Cherry']);
    const focusSpy = vi.spyOn(b1, 'focus');

    const event = dispatchKeyEvent(b0, 'b');
    const result = moveTypeaheadFocus(event, [b0, b1, b2]);

    expect(result).toBe(b1);
    expect(focusSpy).toHaveBeenCalledOnce();
    expect(b0.tabIndex).toBe(-1);
    expect(b1.tabIndex).toBe(0);
    expect(b2.tabIndex).toBe(-1);
    expect(event.defaultPrevented).toBe(true);
  });

  it('すばやく "a" 次に "p" を入力すると接頭辞 ("ap") で一致する項目にフォーカスする', () => {
    const [b0, b1, b2] = setupButtons(['Banana', 'Avocado', 'Apricot']);

    // b0 ('Banana') から 'a' を入力 -> 'Avocado' (b1) に移動
    const ev1 = dispatchKeyEvent(b0, 'a');
    const r1 = moveTypeaheadFocus(ev1, [b0, b1, b2]);
    expect(r1).toBe(b1);
    expect(b1.tabIndex).toBe(0);

    // 100ms 後に b1 ('Avocado') から 'p' を入力 -> バッファは "ap"
    // 'Avocado' は "ap" に一致しないため、次の "ap" に一致する 'Apricot' (b2) に移動
    vi.setSystemTime(Date.now() + 100);
    const ev2 = dispatchKeyEvent(b1, 'p');
    const r2 = moveTypeaheadFocus(ev2, [b0, b1, b2]);
    expect(r2).toBe(b2);
    expect(b0.tabIndex).toBe(-1);
    expect(b1.tabIndex).toBe(-1);
    expect(b2.tabIndex).toBe(0);
    expect(ev2.defaultPrevented).toBe(true);
  });

  it('非アクティブ時間（既定 500ms）が経過するとバッファがリセットされる', () => {
    const [b0, b1, b2] = setupButtons(['Banana', 'Berry', 'Blueberry']);

    // 'b' を入力 -> 'Berry' (b1)
    const ev1 = dispatchKeyEvent(b0, 'b');
    const r1 = moveTypeaheadFocus(ev1, [b0, b1, b2]);
    expect(r1).toBe(b1);

    // 600ms 経過（タイムアウト）
    vi.setSystemTime(Date.now() + 600);

    // 'b' を入力 -> バッファはリセットされ 'bb' ではなく単一文字 'b' として動作
    // 'Berry' (b1) から 'b' で次へ -> 'Blueberry' (b2)
    const ev2 = dispatchKeyEvent(b1, 'b');
    const r2 = moveTypeaheadFocus(ev2, [b0, b1, b2]);
    expect(r2).toBe(b2);
  });

  it('カスタムの timeout オプションを尊重する', () => {
    const [b0, b1, b2] = setupButtons(['Banana', 'Avocado', 'Apricot']);

    // timeout: 1000
    const ev1 = dispatchKeyEvent(b0, 'a');
    moveTypeaheadFocus(ev1, [b0, b1, b2], { timeout: 1000 });

    // 700ms 経過（500ms は超えているが 1000ms 未満）
    vi.setSystemTime(Date.now() + 700);

    const ev2 = dispatchKeyEvent(b1, 'p');
    const r2 = moveTypeaheadFocus(ev2, [b0, b1, b2], { timeout: 1000 });
    // バッファ "ap" として 'Apricot' (b2) に一致
    expect(r2).toBe(b2);
  });

  it('カスタムの getLabel オプションを尊重する', () => {
    const [b0, b1] = setupButtons(['1', '2']);
    b0.setAttribute('data-label', 'Apple');
    b1.setAttribute('data-label', 'Banana');

    const ev = dispatchKeyEvent(b0, 'b');
    const result = moveTypeaheadFocus(ev, [b0, b1], {
      getLabel: (el) => el.getAttribute('data-label') ?? '',
    });

    expect(result).toBe(b1);
  });

  it('無効化された項目をスキップする（focusableWhenDisabled: true ではフォーカスする）', () => {
    const [b0, b1, b2] = setupButtons(['Apple', 'Apricot', 'Avocado']);
    b1.disabled = true;

    // 通常は無効化項目をスキップして b2 ('Avocado') へ移動
    const ev1 = dispatchKeyEvent(b0, 'a');
    const r1 = moveTypeaheadFocus(ev1, [b0, b1, b2]);
    expect(r1).toBe(b2);

    // focusableWhenDisabled: true のときは b1 ('Apricot') へ移動
    const ev2 = dispatchKeyEvent(b0, 'a');
    const r2 = moveTypeaheadFocus(ev2, [b0, b1, b2], { focusableWhenDisabled: true });
    expect(r2).toBe(b1);
  });

  it('resetTypeahead でバッファがクリアされる', () => {
    const [b0, b1, b2] = setupButtons(['Banana', 'Avocado', 'Apricot']);

    const ev1 = dispatchKeyEvent(b0, 'a');
    moveTypeaheadFocus(ev1, [b0, b1, b2]);

    // バッファをリセット
    resetTypeahead([b0, b1, b2]);

    // 50ms 後に 'p' を入力しても "ap" ではなく "p" の単独検索になるため、
    // "p" で始まる項目がなく null を返す
    vi.setSystemTime(Date.now() + 50);
    const ev2 = dispatchKeyEvent(b1, 'p');
    const r2 = moveTypeaheadFocus(ev2, [b0, b1, b2]);
    expect(r2).toBeNull();
  });

  it('対象外のキーでは null を返し、preventDefault を呼ばない', () => {
    const [b0, b1, b2] = setupButtons(['Apple', 'Banana', 'Cherry']);

    for (const key of ['ArrowDown', 'Enter', 'Tab', 'Escape']) {
      const event = dispatchKeyEvent(b0, key);
      const result = moveTypeaheadFocus(event, [b0, b1, b2]);
      expect(result).toBeNull();
      expect(event.defaultPrevented).toBe(false);
    }
  });

  it('タイプアヘッドキーが消費されたが一致しなかった場合、スペースキーのみ preventDefault を呼ぶ', () => {
    const [b0, b1] = setupButtons(['Apple', 'Banana']);

    // 'z' を入力 -> 一致なし、preventDefault は呼ばれない
    const evZ = dispatchKeyEvent(b0, 'z');
    const rZ = moveTypeaheadFocus(evZ, [b0, b1]);
    expect(rZ).toBeNull();
    expect(evZ.defaultPrevented).toBe(false);

    // バッファに 'a' を蓄積
    const evA = dispatchKeyEvent(b0, 'a');
    moveTypeaheadFocus(evA, [b0, b1]);

    // 次にスペースを入力 -> バッファは "a " となり一致なしだが、スペースなので preventDefault が呼ばれる
    const evSpace = dispatchKeyEvent(b0, ' ');
    const rSpace = moveTypeaheadFocus(evSpace, [b0, b1]);
    expect(rSpace).toBeNull();
    expect(evSpace.defaultPrevented).toBe(true);
  });

  it('項目が空配列の場合は null を返す', () => {
    const btn = doc.createElement('button');
    const ev = dispatchKeyEvent(btn, 'a');
    expect(moveTypeaheadFocus(ev, [])).toBeNull();
    expect(() => resetTypeahead([])).not.toThrow();
  });
});
