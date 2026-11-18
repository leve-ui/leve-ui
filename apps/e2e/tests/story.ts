import type { Page } from '@playwright/test';

type GotoStoryOptions = {
  /**
   * ストーリーの前後に `Before` / `After` ボタンを置く（.storybook/preview.tsx の focusGuards）。
   * Tab でのフォーカスの出入りを確かめるテストで使う。
   */
  focusGuards?: boolean;
};

/** ストーリーを単体表示で開きます（例: gotoStory(page, 'components-avatar--default')） */
export const gotoStory = (
  page: Page,
  storyId: string,
  { focusGuards = false }: GotoStoryOptions = {},
) =>
  page.goto(
    `/iframe.html?id=${storyId}&viewMode=story${focusGuards ? '&globals=focusGuards:!true' : ''}`,
  );

/**
 * ストーリーの Docs ページを開きます。Docs ページはストーリーごとに別の Qwik コンテナで描くため、
 * `useId()` の id が重複します。複数コンテナでのパーツ同士の参照を確かめるテストで使います（#167）。
 */
export const gotoDocs = (page: Page, component: string) =>
  page.goto(`/iframe.html?id=components-${component}--docs&viewMode=docs`);

/** 開いたポップアップが、Trigger の近く（下または横）にあることを確かめるための距離 */
export const distance = (
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
) => {
  const dx = Math.max(0, a.x - (b.x + b.width), b.x - (a.x + a.width));
  const dy = Math.max(0, a.y - (b.y + b.height), b.y - (a.y + a.height));
  return Math.hypot(dx, dy);
};
