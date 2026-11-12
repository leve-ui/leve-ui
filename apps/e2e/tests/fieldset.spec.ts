import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('Fieldset', () => {
  test('Legend をアクセシブルネームに持つ group になる', async ({ page }) => {
    await gotoStory(page, 'components-fieldset--default');

    const group = page.getByRole('group', { name: 'Shipping method' });
    await expect(group).toBeVisible();
    await expect(group.getByRole('radio')).toHaveCount(2);
  });

  test('disabled のときは中のコントロールがすべて無効になる', async ({ page }) => {
    await gotoStory(page, 'components-fieldset--disabled');

    const radios = page.getByRole('group', { name: 'Shipping method' }).getByRole('radio');
    await expect(radios.nth(0)).toBeDisabled();
    await expect(radios.nth(1)).toBeDisabled();
  });

  test('disabled のときは Tab で中のコントロールを飛ばす', async ({ page }) => {
    await gotoStory(page, 'components-fieldset--disabled', { focusGuards: true });

    await page.getByRole('button', { name: 'Before' }).focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'After' })).toBeFocused();
  });
});
