import type { Page } from '@playwright/test';

/** ストーリーを単体表示で開きます（例: gotoStory(page, 'components-avatar--default')） */
export const gotoStory = (page: Page, storyId: string) =>
  page.goto(`/iframe.html?id=${storyId}&viewMode=story`);
