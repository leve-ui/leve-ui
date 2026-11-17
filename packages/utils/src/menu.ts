import { moveRovingFocus } from './roving-focus';
import { moveTypeaheadFocus } from './typeahead';

/** The item roles of a menu (APG Menu and Menubar). */
export const MENU_ITEM_SELECTOR =
  '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';

/**
 * メニューの項目を DOM の順で返します。入れ子のメニュー（サブメニュー）の項目は含めません（`adr/0035`）。
 *
 * @param menu `role="menu"` の要素
 */
export function getMenuItems(menu: HTMLElement): HTMLElement[] {
  return Array.from(menu.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR)).filter(
    (item) => item.closest('[role="menu"]') === menu,
  );
}

/** 項目の文字（タイプアヘッド用）。`data-text-value` があればそれ、なければ表示テキスト。 */
function itemLabel(item: HTMLElement): string {
  return item.getAttribute('data-text-value') ?? item.textContent ?? '';
}

/**
 * メニューのキー操作でフォーカスを移します（APG Menu）。
 *
 * - ↑ / ↓: 前 / 次の有効な項目（`loop` のときは端で反対側へ）
 * - Home / End: 最初 / 最後の有効な項目
 * - 文字キー: その文字で始まる項目（タイプアヘッド）
 *
 * 無効な項目（`aria-disabled="true"`）は飛ばします。移動したら `event.preventDefault()` を呼び、
 * 移動先の項目を返します。
 */
export function moveMenuFocus(
  event: KeyboardEvent,
  menu: HTMLElement,
  options?: { loop?: boolean },
): HTMLElement | null {
  const items = getMenuItems(menu);
  if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
    return moveRovingFocus(event, items, { orientation: 'vertical', loop: options?.loop ?? false });
  }
  return moveTypeaheadFocus(event, items, { getLabel: itemLabel });
}

/** 最初または最後の有効な項目を返します（開いたときの初期フォーカス用）。 */
export function getEdgeMenuItem(menu: HTMLElement, edge: 'first' | 'last'): HTMLElement | null {
  const items = getMenuItems(menu).filter((item) => item.getAttribute('aria-disabled') !== 'true');
  return (edge === 'first' ? items[0] : items[items.length - 1]) ?? null;
}
