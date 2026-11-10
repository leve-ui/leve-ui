import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('Separator', () => {
  test('横向きの separator としてアクセシビリティツリーに現れる', async ({ page }) => {
    await gotoStory(page, 'components-separator--default');

    const separator = page.getByRole('separator');
    await expect(separator).toBeVisible();
    await expect(separator).toHaveAttribute('data-orientation', 'horizontal');
  });

  test('縦向きのときは aria-orientation="vertical" になる', async ({ page }) => {
    await gotoStory(page, 'components-separator--vertical');

    await expect(page.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  test('decorative のときはアクセシビリティツリーから隠れる', async ({ page }) => {
    await gotoStory(page, 'components-separator--decorative');

    await expect(page.locator('[data-leve-separator]')).toBeVisible();
    await expect(page.getByRole('separator')).toHaveCount(0);
  });
});
