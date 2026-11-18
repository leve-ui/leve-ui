/**
 * 項目の集まり（コレクション）を DOM から読むヘルパーです（`adr/0035`）。
 *
 * 項目の順序・無効状態・テキストは、操作のたびに DOM から読みます。登録用のストアは持ちません。
 */

/**
 * `root` の中の項目を DOM の順に返します。`nestedRootSelector` に一致する要素（入れ子のコレクション）の
 * 中の項目は含めません。
 */
export function getCollectionItems(
  root: Element,
  itemSelector: string,
  nestedRootSelector?: string,
): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(itemSelector)).filter((item) => {
    if (!nestedRootSelector) return true;
    const nested = item.parentElement?.closest(nestedRootSelector);
    return !nested || nested === root || !root.contains(nested);
  });
}

/** 項目が無効（`data-disabled` または `aria-disabled="true"`）かどうか */
export function isItemDisabled(item: Element): boolean {
  return item.hasAttribute('data-disabled') || item.getAttribute('aria-disabled') === 'true';
}

/** 項目のテキスト。`data-text-value` があればそれを、なければ前後の空白を除いた textContent を返します */
export function getItemTextValue(item: Element): string {
  return item.getAttribute('data-text-value') ?? item.textContent?.trim() ?? '';
}

/**
 * 有効な項目の中で、`current` から `direction` に進んだ項目を返します。
 *
 * - `'first'` / `'last'`: 最初 / 最後の有効な項目
 * - `'next'` / `'previous'`: 次 / 前の有効な項目。`current` が一覧にないときは最初 / 最後。
 *   端で `loop` が false なら `current` のまま
 */
export function getAdjacentItem(
  items: readonly HTMLElement[],
  current: HTMLElement | null,
  direction: 'first' | 'last' | 'next' | 'previous',
  { loop = false }: { loop?: boolean } = {},
): HTMLElement | null {
  const enabled = items.filter((item) => !isItemDisabled(item));
  if (enabled.length === 0) return null;
  if (direction === 'first') return enabled[0];
  if (direction === 'last') return enabled[enabled.length - 1];
  const index = current ? enabled.indexOf(current) : -1;
  if (index === -1) return direction === 'next' ? enabled[0] : enabled[enabled.length - 1];
  const nextIndex = direction === 'next' ? index + 1 : index - 1;
  if (nextIndex < 0) return loop ? enabled[enabled.length - 1] : current;
  if (nextIndex >= enabled.length) return loop ? enabled[0] : current;
  return enabled[nextIndex];
}

/**
 * 項目の値から、その項目の要素の id を作ります。値が違えば id も必ず違います（単射）。
 * 英数字と `-` 以外の文字（`_` を含む）は `_<16 進のコードポイント>_` に置き換えます。
 *
 * @example
 * itemId('combobox-1-list', 'a b') // 'combobox-1-list-item-a_20_b'
 * itemId('combobox-1-list', 'a-b') // 'combobox-1-list-item-a-b'
 */
export function itemId(base: string, value: string): string {
  const encoded = Array.from(value)
    .map((char) =>
      /[A-Za-z0-9-]/.test(char) ? char : `_${(char.codePointAt(0) ?? 0).toString(16)}_`,
    )
    .join('');
  return `${base}-item-${encoded}`;
}
