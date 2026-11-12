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
