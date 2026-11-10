import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('Breadcrumb', () => {
  test('aria-label="Breadcrumb" のナビゲーションランドマークになる', async ({ page }) => {
    await gotoStory(page, 'components-breadcrumb--default');

    const nav = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(nav).toBeVisible();
    // Separator は支援技術から隠れるため、リストの項目数に含まれない
    await expect(nav.getByRole('listitem')).toHaveCount(3);
  });

  test('現在のページのリンクに aria-current="page" が付く', async ({ page }) => {
    await gotoStory(page, 'components-breadcrumb--default');

    await expect(page.getByRole('link', { name: 'Breadcrumb' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(page.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });

  test('Tab でリンクを順にたどれる', async ({ page }) => {
    await gotoStory(page, 'components-breadcrumb--default');

    const home = page.getByRole('link', { name: 'Home' });
    await home.focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Components' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Breadcrumb' })).toBeFocused();
  });
});
