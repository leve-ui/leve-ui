import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('Tabs', () => {
  test('Tab で選択中の Trigger にフォーカス', async ({ page }) => {
    await gotoStory(page, 'components-tabs--controlled');

    await page.getByRole('button', { name: 'Select Tab 2' }).focus();
    await page.keyboard.press('Tab');
    const firstTab = page.getByRole('tab', { name: 'First' });
    await expect(firstTab).toBeFocused();
  });

  test('もう一度 Tab でタブパネルにフォーカス', async ({ page }) => {
    await gotoStory(page, 'components-tabs--default');

    const firstTab = page.getByRole('tab', { name: 'Account' });
    await firstTab.focus();
    await page.keyboard.press('Tab');
    const panel = page.getByRole('tabpanel');
    await expect(panel).toBeFocused();
  });

  test('→ で次のタブへフォーカスと選択（automatic）', async ({ page }) => {
    await gotoStory(page, 'components-tabs--default');

    const firstTab = page.getByRole('tab', { name: 'Account' });
    const secondTab = page.getByRole('tab', { name: 'Password' });

    await firstTab.focus();
    await page.keyboard.press('ArrowRight');

    await expect(secondTab).toBeFocused();
    await expect(secondTab).toHaveAttribute('aria-selected', 'true');
    await expect(firstTab).toHaveAttribute('aria-selected', 'false');
    await expect(page.getByRole('tabpanel')).toHaveText(/Change your password/);
  });

  test('← で前へ', async ({ page }) => {
    await gotoStory(page, 'components-tabs--default');

    const firstTab = page.getByRole('tab', { name: 'Account' });
    const secondTab = page.getByRole('tab', { name: 'Password' });

    await secondTab.focus();
    await page.keyboard.press('ArrowLeft');
    await expect(firstTab).toBeFocused();
    await expect(firstTab).toHaveAttribute('aria-selected', 'true');
    await expect(secondTab).toHaveAttribute('aria-selected', 'false');
    await expect(page.getByRole('tabpanel')).toHaveText(/Manage your account details/);
  });

  test('末尾で → を押すと先頭へ循環', async ({ page }) => {
    await gotoStory(page, 'components-tabs--default');

    const firstTab = page.getByRole('tab', { name: 'Account' });
    const thirdTab = page.getByRole('tab', { name: 'Settings' });

    await thirdTab.focus();
    await page.keyboard.press('ArrowRight');
    await expect(firstTab).toBeFocused();
    await expect(firstTab).toHaveAttribute('aria-selected', 'true');
    await expect(thirdTab).toHaveAttribute('aria-selected', 'false');
  });

  test('Home で先頭', async ({ page }) => {
    await gotoStory(page, 'components-tabs--default');

    const firstTab = page.getByRole('tab', { name: 'Account' });
    const thirdTab = page.getByRole('tab', { name: 'Settings' });

    await thirdTab.focus();
    await page.keyboard.press('Home');
    await expect(firstTab).toBeFocused();
    await expect(firstTab).toHaveAttribute('aria-selected', 'true');
  });

  test('End で末尾', async ({ page }) => {
    await gotoStory(page, 'components-tabs--default');

    const firstTab = page.getByRole('tab', { name: 'Account' });
    const thirdTab = page.getByRole('tab', { name: 'Settings' });

    await firstTab.focus();
    await page.keyboard.press('End');
    await expect(thirdTab).toBeFocused();
    await expect(thirdTab).toHaveAttribute('aria-selected', 'true');
  });

  test('無効な Trigger を飛ばす', async ({ page }) => {
    await gotoStory(page, 'components-tabs--disabled-trigger');

    const firstTab = page.getByRole('tab', { name: 'Available', exact: true });
    const thirdTab = page.getByRole('tab', { name: 'Also Available', exact: true });

    await firstTab.focus();
    await page.keyboard.press('ArrowRight');
    await expect(thirdTab).toBeFocused();
    await expect(thirdTab).toHaveAttribute('aria-selected', 'true');
  });

  test('vertical で ↓ ↑ が動き ← → は動かない', async ({ page }) => {
    await gotoStory(page, 'components-tabs--vertical');

    const firstTab = page.getByRole('tab', { name: 'Profile' });
    const secondTab = page.getByRole('tab', { name: 'Billing' });

    await firstTab.focus();

    // 水平キーは無視される
    await page.keyboard.press('ArrowRight');
    await expect(firstTab).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(firstTab).toBeFocused();

    // 垂直キーで移動
    await page.keyboard.press('ArrowDown');
    await expect(secondTab).toBeFocused();
    await expect(secondTab).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('ArrowUp');
    await expect(firstTab).toBeFocused();
    await expect(firstTab).toHaveAttribute('aria-selected', 'true');
  });

  test('manual で → はフォーカスだけ移り選択は変わらない', async ({ page }) => {
    await gotoStory(page, 'components-tabs--manual');

    const firstTab = page.getByRole('tab', { name: 'First' });
    const secondTab = page.getByRole('tab', { name: 'Second' });

    await firstTab.focus();
    await page.keyboard.press('ArrowRight');

    await expect(secondTab).toBeFocused();
    await expect(secondTab).toHaveAttribute('aria-selected', 'false');
    await expect(firstTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toHaveText(/Panel 1/);
  });

  test('manual で Enter で選択', async ({ page }) => {
    await gotoStory(page, 'components-tabs--manual');

    const firstTab = page.getByRole('tab', { name: 'First' });
    const secondTab = page.getByRole('tab', { name: 'Second' });

    await firstTab.focus();
    await page.keyboard.press('ArrowRight');
    await expect(secondTab).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(secondTab).toHaveAttribute('aria-selected', 'true');
    await expect(firstTab).toHaveAttribute('aria-selected', 'false');
    await expect(page.getByRole('tabpanel')).toHaveText(/Panel 2/);
  });

  test('manual で Space で選択', async ({ page }) => {
    await gotoStory(page, 'components-tabs--manual');

    const firstTab = page.getByRole('tab', { name: 'First' });
    const secondTab = page.getByRole('tab', { name: 'Second' });

    await firstTab.focus();
    await page.keyboard.press('ArrowRight');
    await expect(secondTab).toBeFocused();

    await page.keyboard.press('Space');
    await expect(secondTab).toHaveAttribute('aria-selected', 'true');
    await expect(firstTab).toHaveAttribute('aria-selected', 'false');
    await expect(page.getByRole('tabpanel')).toHaveText(/Panel 2/);
  });

  test('クリックで選択しパネルが切り替わる', async ({ page }) => {
    await gotoStory(page, 'components-tabs--default');

    const firstTab = page.getByRole('tab', { name: 'Account' });
    const secondTab = page.getByRole('tab', { name: 'Password' });
    const thirdTab = page.getByRole('tab', { name: 'Settings' });

    await secondTab.click();
    await expect(secondTab).toHaveAttribute('aria-selected', 'true');
    await expect(firstTab).toHaveAttribute('aria-selected', 'false');
    await expect(page.getByRole('tabpanel')).toHaveText(/Change your password/);

    await thirdTab.click();
    await expect(thirdTab).toHaveAttribute('aria-selected', 'true');
    await expect(secondTab).toHaveAttribute('aria-selected', 'false');
    await expect(page.getByRole('tabpanel')).toHaveText(/Configure application preferences/);
  });
});
