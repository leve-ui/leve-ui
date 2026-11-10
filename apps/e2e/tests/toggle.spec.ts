import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('Toggle', () => {
  test('未押下の toggle button としてアクセシビリティツリーに現れる', async ({ page }) => {
    await gotoStory(page, 'components-toggle--default');

    const toggle = page.getByRole('button', { name: 'Bold' });
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(toggle).toHaveAttribute('data-state', 'off');
  });

  test('クリックで押下状態が切り替わる', async ({ page }) => {
    await gotoStory(page, 'components-toggle--default');
    const toggle = page.getByRole('button', { name: 'Bold' });

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(toggle).toHaveAttribute('data-state', 'on');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(toggle).toHaveAttribute('data-state', 'off');
  });

  test('Enter で押下状態が切り替わる', async ({ page }) => {
    await gotoStory(page, 'components-toggle--default');
    const toggle = page.getByRole('button', { name: 'Bold' });

    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');

    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  test('Space で押下状態が切り替わる', async ({ page }) => {
    await gotoStory(page, 'components-toggle--default');
    const toggle = page.getByRole('button', { name: 'Bold' });

    await toggle.focus();
    await page.keyboard.press('Space');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');

    await page.keyboard.press('Space');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  test('Tab / Shift+Tab でフォーカスが移動する', async ({ page }) => {
    await gotoStory(page, 'components-toggle--controlled');
    const toggle = page.getByRole('button', { name: 'Bold' });
    const reset = page.getByRole('button', { name: 'Reset' });

    await toggle.focus();
    await page.keyboard.press('Tab');
    await expect(reset).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(toggle).toBeFocused();
  });

  test('defaultPressed のときは押下状態で表示される', async ({ page }) => {
    await gotoStory(page, 'components-toggle--pressed');

    const toggle = page.getByRole('button', { name: 'Bold' });
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(toggle).toHaveAttribute('data-state', 'on');
  });

  test('disabled のときはフォーカスされず、状態も変わらない', async ({ page }) => {
    await gotoStory(page, 'components-toggle--disabled');
    const toggle = page.getByRole('button', { name: 'Bold' });

    await expect(toggle).toBeDisabled();
    await toggle.focus();
    await expect(toggle).not.toBeFocused();

    await toggle.click({ force: true });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  test('Controlled: bind:pressed の Signal と同期する', async ({ page }) => {
    await gotoStory(page, 'components-toggle--controlled');
    const toggle = page.getByRole('button', { name: 'Bold' });
    const status = page.getByText(/^Bold: (on|off)$/);

    await expect(status).toHaveText('Bold: off');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(status).toHaveText('Bold: on');

    // 外部から Signal を書き換えると Toggle にも反映される
    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(status).toHaveText('Bold: off');
  });
});
