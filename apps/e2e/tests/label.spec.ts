import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('Label', () => {
  test('for で関連付けたコントロールのアクセシブルネームになる', async ({ page }) => {
    await gotoStory(page, 'components-label--default');

    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
  });

  test('クリックすると関連付けたコントロールにフォーカスが移る', async ({ page }) => {
    await gotoStory(page, 'components-label--default');

    await page.locator('[data-leve-label]').click();
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeFocused();
  });

  test('包んだチェックボックスはラベルのクリックで切り替わる', async ({ page }) => {
    await gotoStory(page, 'components-label--wrapping');

    const checkbox = page.getByRole('checkbox', { name: 'Accept terms' });
    await page.locator('[data-leve-label]').click();
    await expect(checkbox).toBeChecked();
  });
});
