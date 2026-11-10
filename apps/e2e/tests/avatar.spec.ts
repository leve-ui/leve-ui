import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('Avatar', () => {
  test('画像の読み込みに失敗するとフォールバックを表示する', async ({ page }) => {
    await gotoStory(page, 'components-avatar--fallback');

    const fallback = page.locator('[data-levis-avatar-fallback]');
    await expect(fallback).toHaveAttribute('data-state', 'error');
    await expect(fallback).toHaveText('LU');
    await expect(page.locator('[data-levis-avatar-image]')).toBeHidden();
  });

  test('src の画像を表示すると、フォールバックは消える', async ({ page }) => {
    await page.route('**/i.pravatar.cc/**', (route) =>
      route.fulfill({
        contentType: 'image/svg+xml',
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="tomato"/></svg>',
      }),
    );
    await gotoStory(page, 'components-avatar--default');

    const image = page.locator('[data-levis-avatar-image]');
    await expect(image).toHaveAttribute('data-state', 'loaded');
    await expect(image).toBeVisible();
    await expect(page.locator('[data-levis-avatar-fallback]')).toHaveCount(0);
  });
});
