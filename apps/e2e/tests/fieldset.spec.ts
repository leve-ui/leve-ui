import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('Fieldset', () => {
  test('Legend をアクセシブルネームに持つ group になる', async ({ page }) => {
    await gotoStory(page, 'components-fieldset--default');

    const group = page.getByRole('group', { name: 'Shipping method' });
    await expect(group).toBeVisible();
    await expect(group.getByRole('radio')).toHaveCount(2);
  });

  test('disabled のときは中の leve-ui のコントロールも無効になる', async ({ page }) => {
    await gotoStory(page, 'components-fieldset--disabled');

    const group = page.getByRole('group', { name: 'Notifications' });
    const email = group.getByRole('switch', { name: 'Email' });
    const push = group.getByRole('switch', { name: 'Push' });
    await expect(email).toBeDisabled();
    await expect(push).toBeDisabled();
    await expect(email).toHaveAttribute('data-disabled', '');

    // Clicking the label does not toggle it either
    await group.getByText('Push').click({ force: true });
    await expect(push).not.toBeChecked();
  });

  test('disabled のときは Tab で中のコントロールを飛ばす', async ({ page }) => {
    await gotoStory(page, 'components-fieldset--disabled', { focusGuards: true });

    await page.getByRole('button', { name: 'Before' }).focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'After' })).toBeFocused();
  });
});
