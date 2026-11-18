import type { Page } from '@playwright/test';

/**
 * Tab（`shift` のときは Shift+Tab）でフォーカスを移します。
 *
 * macOS の WebKit（Safari と同じ）は、既定では Tab でテキスト入力欄の間しか移らず、ボタンやリンクを
 * 飛ばします（macOS の「キーボードナビゲーション」と、Safari の「Tab キーを押すと Web ページ上の
 * 各項目が強調表示されます」が既定でオフのため）。そこでは、Safari の利用者がすべての項目に移るときと
 * 同じく Option+Tab を押します。ほかの環境（CI の Linux の WebKit を含む）では Tab を押します（#170）。
 */
export const pressTab = (page: Page, { shift = false }: { shift?: boolean } = {}) => {
  const macWebKit =
    process.platform === 'darwin' && page.context().browser()?.browserType().name() === 'webkit';
  return page.keyboard.press(`${shift ? 'Shift+' : ''}${macWebKit ? 'Alt+' : ''}Tab`);
};
