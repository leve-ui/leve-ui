import { expect, test } from '@playwright/test';
import { pressTab } from './keyboard';
import { gotoStory } from './story';

test.describe('Switch', () => {
  test('オフの switch としてアクセシビリティツリーに現れる', async ({ page }) => {
    await gotoStory(page, 'components-switch--default');

    const control = page.getByRole('switch', { name: 'Airplane mode' });
    await expect(control).toBeVisible();
    await expect(control).not.toBeChecked();
    await expect(control).toHaveAttribute('aria-checked', 'false');
    await expect(control).toHaveAttribute('data-state', 'unchecked');
  });

  test('defaultChecked のときはオンで表示される', async ({ page }) => {
    await gotoStory(page, 'components-switch--checked');

    const control = page.getByRole('switch', { name: 'Wi-Fi' });
    await expect(control).toBeChecked();
    await expect(control).toHaveAttribute('data-state', 'checked');
  });

  test('クリックでオン/オフが切り替わる', async ({ page }) => {
    await gotoStory(page, 'components-switch--default');
    const control = page.getByRole('switch', { name: 'Airplane mode' });

    await control.click();
    await expect(control).toBeChecked();
    await expect(control).toHaveAttribute('data-state', 'checked');

    await control.click();
    await expect(control).not.toBeChecked();
    await expect(control).toHaveAttribute('data-state', 'unchecked');
  });

  test('Space でオン/オフが切り替わる', async ({ page }) => {
    await gotoStory(page, 'components-switch--default');
    const control = page.getByRole('switch', { name: 'Airplane mode' });

    await control.focus();
    await page.keyboard.press('Space');
    await expect(control).toBeChecked();

    await page.keyboard.press('Space');
    await expect(control).not.toBeChecked();
  });

  test('Enter でオン/オフが切り替わる', async ({ page }) => {
    await gotoStory(page, 'components-switch--default');
    const control = page.getByRole('switch', { name: 'Airplane mode' });

    await control.focus();
    await page.keyboard.press('Enter');
    await expect(control).toBeChecked();

    await page.keyboard.press('Enter');
    await expect(control).not.toBeChecked();
  });

  test('Label をクリックするとオン/オフが切り替わる', async ({ page }) => {
    await gotoStory(page, 'components-switch--default');
    const control = page.getByRole('switch', { name: 'Airplane mode' });
    const label = page.getByText('Airplane mode', { exact: true });

    await label.click();
    await expect(control).toBeChecked();

    await label.click();
    await expect(control).not.toBeChecked();
  });

  test('disabled のときは Label をクリックしても切り替わらない', async ({ page }) => {
    await gotoStory(page, 'components-switch--disabled');
    const control = page.getByRole('switch', { name: 'Bluetooth' });

    // 無効なコントロールのラベルは Playwright が操作不可とみなすため force でクリックする
    await page.getByText('Bluetooth', { exact: true }).click({ force: true });
    await expect(control).not.toBeChecked();
  });

  test('disabled のときは無効になり、クリックしても切り替わらない', async ({ page }) => {
    await gotoStory(page, 'components-switch--disabled');
    const control = page.getByRole('switch', { name: 'Bluetooth' });

    await expect(control).toBeDisabled();
    await control.click({ force: true });
    await expect(control).not.toBeChecked();
  });

  test('disabled のときは Tab で飛ばされる', async ({ page }) => {
    await gotoStory(page, 'components-switch--disabled', { focusGuards: true });

    await page.getByRole('button', { name: 'Before' }).focus();
    await pressTab(page);
    await expect(page.getByRole('button', { name: 'After' })).toBeFocused();
  });

  test('隠し input は Tab で飛ばされる', async ({ page }) => {
    await gotoStory(page, 'components-switch--form');

    await page.getByRole('switch', { name: 'Notifications' }).focus();
    await pressTab(page);
    await expect(page.getByRole('button', { name: 'Save' })).toBeFocused();
  });

  test('フォーム送信でオンのときだけ値が送られる', async ({ page }) => {
    await gotoStory(page, 'components-switch--form');
    const control = page.getByRole('switch', { name: 'Notifications' });
    const save = page.getByRole('button', { name: 'Save' });
    const output = page.locator('output');

    await save.click();
    await expect(output).toHaveText('{}');

    await control.click();
    // Qwik は状態の反映を非同期に描画するため、隠し input に反映されてから送信する
    await expect(page.locator('[data-leve-switch-hidden-input]')).toBeChecked();
    await save.click();
    await expect(output).toHaveText('{"notifications":"on"}');
  });

  test('フォームの Reset でスイッチが初期状態に戻る', async ({ page }) => {
    await gotoStory(page, 'components-switch--form');
    const control = page.getByRole('switch', { name: 'Notifications' });
    const hiddenInput = page.locator('[data-leve-switch-hidden-input]');
    const reset = page.getByRole('button', { name: 'Reset' });
    const save = page.getByRole('button', { name: 'Save' });
    const output = page.locator('output');

    await control.click();
    await expect(control).toBeChecked();
    await expect(hiddenInput).toBeChecked();

    await reset.click();
    await expect(control).not.toBeChecked();
    await expect(control).toHaveAttribute('data-state', 'unchecked');
    await expect(hiddenInput).not.toBeChecked();

    await save.click();
    await expect(output).toHaveText('{}');
  });

  test('Field の Label がアクセシブルネームになり、Description が説明になる', async ({ page }) => {
    await gotoStory(page, 'components-switch--with-field');

    const control = page.getByRole('switch', { name: 'Dark mode' });
    await expect(control).toBeVisible();
    await expect(control).toHaveAccessibleDescription('Use a dark color scheme.');
  });

  test('Field の Label をクリックするとオン/オフが切り替わる', async ({ page }) => {
    await gotoStory(page, 'components-switch--with-field');
    const control = page.getByRole('switch', { name: 'Dark mode' });

    await page.getByText('Dark mode', { exact: true }).click();
    await expect(control).toBeChecked();
  });
});
