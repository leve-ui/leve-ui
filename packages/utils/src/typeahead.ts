import { isRovingItemDisabled } from './roving-focus';

/**
 * タイプアヘッドによるフォーカス移動のオプション。
 */
export interface TypeaheadOptions {
  /**
   * 入力バッファをクリアするまでの非アクティブ時間（ミリ秒）。
   *
   * @default 500
   */
  timeout?: number;

  /**
   * 項目のマッチング対象となる文字列を取得する関数。
   *
   * @default (el) => el.textContent ?? ''
   */
  getLabel?: (el: HTMLElement) => string;

  /**
   * 無効化された項目（isRovingItemDisabled を参照）にもフォーカスを当てるかどうか。
   *
   * @default false
   */
  focusableWhenDisabled?: boolean;
}

/**
 * 入力文字列と現在位置から、次にフォーカスすべき項目のインデックスを計算する純粋関数です。
 *
 * - 比較は大文字小文字を区別せず（`toLocaleLowerCase()`）、ラベルの前後の空白は `trim()` して比較します。
 * - `search` が空文字列の場合は `null` を返します。
 * - `search` の全文字が同一文字（例: `"a"`, `"aaa"`）の場合は、その 1 文字を検索文字列とし、
 *   `currentIndex` の次の項目から検索を開始します（繰り返し入力で循環移動）。
 * - それ以外（例: `"ap"`）の場合は、入力文字列全体で `currentIndex` 自身から検索を開始します
 *   （現在の一致項目を維持するため）。
 * - リストの末尾に達した場合は先頭へ循環します。`isFocusable[i]` が `false` の項目はスキップします。
 * - `currentIndex` が `-1` の場合はインデックス 0 から検索を開始します。
 * - 最初に一致したインデックスを返します。一致する項目がない場合、または一致先が `currentIndex` 自身の場合は `null` を返します。
 *
 * @param search 検索する文字列
 * @param currentIndex 現在フォーカスされている項目のインデックス（未選択の場合は `-1`）
 * @param labels 各項目のテキストラベルの配列
 * @param isFocusable 各項目がフォーカス可能かどうかを示す真偽値の配列（省略時はすべて `true`）
 * @returns 次にフォーカスすべき項目のインデックス。移動先がない場合は `null`
 *
 * @example
 * const nextIndex = getTypeaheadIndex('ap', 0, ['Apple', 'Apricot', 'Banana']);
 */
export const getTypeaheadIndex = (
  search: string,
  currentIndex: number,
  labels: readonly string[],
  isFocusable?: readonly boolean[],
): number | null => {
  const count = labels.length;
  if (count === 0) return null;

  const query = search.toLocaleLowerCase();
  if (query.length === 0) return null;

  const chars = Array.from(query);
  const firstChar = chars[0];
  const allSame = chars.every((c) => c === firstChar);

  const searchString = allSame ? firstChar : query;

  const validCurrentIndex = currentIndex >= 0 && currentIndex < count ? currentIndex : -1;
  const startIndex = allSame
    ? (validCurrentIndex + 1 + count) % count
    : Math.max(validCurrentIndex, 0);

  for (let step = 0; step < count; step++) {
    const index = (startIndex + step) % count;
    if (isFocusable && !isFocusable[index]) {
      continue;
    }

    const label = labels[index].trim().toLocaleLowerCase();
    if (label.startsWith(searchString)) {
      return index === currentIndex ? null : index;
    }
  }

  return null;
};

/**
 * 押下されたキーがタイプアヘッドの入力文字かどうかを判定します。
 *
 * - `event.key.length === 1` かつ `ctrlKey` / `metaKey` / `altKey` が押されていない場合に `true` を返します。
 * - スペースキーは `buffer` が空でない場合のみ `true` を返します（単体のスペースは項目の決定等の既定操作を優先するため）。
 *
 * @param event キーボードイベント
 * @param buffer 現在蓄積されている入力バッファ
 * @returns タイプアヘッド入力文字の場合は `true`、それ以外は `false`
 *
 * @example
 * if (isTypeaheadKey(event, buffer)) {
 *   // バッファに追加して検索
 * }
 */
export const isTypeaheadKey = (event: KeyboardEvent, buffer: string): boolean => {
  if (event.key.length !== 1) {
    return false;
  }
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return false;
  }
  if (event.key === ' ' && buffer.length === 0) {
    return false;
  }
  return true;
};

interface TypeaheadState {
  buffer: string;
  lastTime: number;
}

const typeaheadStates = new WeakMap<Element, TypeaheadState>();

/**
 * `keydown` イベントを受け取り、タイプアヘッド入力に従って一致する項目へフォーカスを移動します。
 *
 * - 入力されたキーをグループごとのバッファに蓄積し、一定時間（`timeout`、既定値 500ms）操作がない場合にバッファをリセットします。
 * - `items` の中から `event.target` を含む項目を現在のインデックスとします。
 * - `getTypeaheadIndex` で移動先を決定します。
 * - 移動先がある場合:
 *   1. `event.preventDefault()` を呼び出します。
 *   2. 全項目の `tabIndex` を `-1` にし、移動先の `tabIndex` を `0` に付け替えます。
 *   3. 移動先の項目に `focus()` を呼び出します。
 *   4. 移動先の要素を返します。
 * - タイプアヘッドキーが押下されたが一致先がない場合、スペースキーの場合のみ `event.preventDefault()` を呼び出します。
 * - 一致先がない場合や対象外のキーの場合は `null` を返します。
 *
 * > [!NOTE]
 * > Qwik のイベントハンドラは非同期で実行されるため、ハンドラ内での `event.preventDefault()` は
 * > ブラウザの既定の挙動を抑止できない場合があります。
 * > 確実にスクロール等を抑止したい場合は、コンポーネント側で `sync$` または `preventdefault:keydown` を併用してください。
 *
 * @param event キーボードイベント
 * @param items ナビゲーション対象となる要素の配列
 * @param options タイプアヘッドのオプション（timeout, getLabel, focusableWhenDisabled）
 * @returns フォーカスが移動した項目。移動しなかった場合は `null`
 *
 * @example
 * const onKeyDown$ = $((event: KeyboardEvent) => {
 *   const items = Array.from(containerRef.value?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
 *   moveTypeaheadFocus(event, items);
 * });
 */
export const moveTypeaheadFocus = (
  event: KeyboardEvent,
  items: readonly HTMLElement[],
  options?: TypeaheadOptions,
): HTMLElement | null => {
  if (items.length === 0) return null;

  const key = items[0].parentElement ?? items[0];
  const timeout = options?.timeout ?? 500;
  const state = typeaheadStates.get(key);

  let buffer = '';
  if (state && Date.now() - state.lastTime <= timeout) {
    buffer = state.buffer;
  }

  if (!isTypeaheadKey(event, buffer)) {
    return null;
  }

  buffer += event.key;
  typeaheadStates.set(key, { buffer, lastTime: Date.now() });

  const target = event.target as Node | null;
  const currentIndex = target
    ? items.findIndex((item) => item === target || item.contains(target))
    : -1;

  const getLabel = options?.getLabel ?? ((el: HTMLElement) => el.textContent ?? '');
  const labels = items.map(getLabel);

  const focusableWhenDisabled = options?.focusableWhenDisabled ?? false;
  const isFocusable = items.map((item) => focusableWhenDisabled || !isRovingItemDisabled(item));

  const nextIndex = getTypeaheadIndex(buffer, currentIndex, labels, isFocusable);

  if (nextIndex !== null) {
    event.preventDefault();
    for (let i = 0; i < items.length; i++) {
      items[i].tabIndex = i === nextIndex ? 0 : -1;
    }
    const nextItem = items[nextIndex];
    nextItem?.focus();
    return nextItem ?? null;
  }

  if (event.key === ' ') {
    event.preventDefault();
  }

  return null;
};

/**
 * 指定されたグループのタイプアヘッド入力バッファをクリアします。
 * メニューが閉じた際などに呼び出します。
 *
 * @param items ナビゲーション対象となる要素の配列
 *
 * @example
 * resetTypeahead(items);
 */
export const resetTypeahead = (items: readonly HTMLElement[]): void => {
  if (items.length === 0) return;
  const key = items[0].parentElement ?? items[0];
  typeaheadStates.delete(key);
};
