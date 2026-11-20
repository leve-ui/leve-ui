import { expect, type Page, test } from '@playwright/test';
import { pressTab } from './keyboard';
import { gotoStory } from './story';

const open = async (page: Page, story = 'default', name = 'Edit profile') => {
  await gotoStory(page, `components-dialog--${story}`);
  const trigger = page.locator('[data-leve-dialog-trigger]');
  await expect(trigger).toBeVisible({ timeout: 15_000 });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name });
  await expect(dialog).toBeVisible();
  return { trigger, dialog };
};

test.describe('Dialog', () => {
  test('Trigger で開き、最初のフォーカス可能な要素にフォーカスする', async ({ page }) => {
    const { trigger, dialog } = await open(page);

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(dialog).toHaveAttribute('data-state', 'open');
    await expect(dialog).toHaveAccessibleDescription('Change how your name appears to others.');
    await expect(dialog.getByRole('textbox', { name: 'Name' })).toBeFocused();
  });

  test('Escape で閉じ、Trigger にフォーカスが戻る', async ({ page }) => {
    const { trigger, dialog } = await open(page);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  });

  test('Close で閉じ、Trigger にフォーカスが戻る', async ({ page }) => {
    const { trigger, dialog } = await open(page);

    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('Tab は最後の要素から最初の要素へ循環する', async ({ page }) => {
    const { dialog } = await open(page);
    const close = dialog.getByRole('button', { name: 'Close' });

    await close.focus();
    await pressTab(page);
    await expect(dialog.getByRole('textbox', { name: 'Name' })).toBeFocused();
  });

  test('Shift+Tab は最初の要素から最後の要素へ循環する', async ({ page }) => {
    const { dialog } = await open(page);

    await expect(dialog.getByRole('textbox', { name: 'Name' })).toBeFocused();
    await pressTab(page, { shift: true });
    await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();
  });

  test('背景のクリックで閉じる', async ({ page }) => {
    const { trigger, dialog } = await open(page);

    await page.mouse.click(5, 5);
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('開いている間はページのスクロールを止める', async ({ page }) => {
    const { dialog } = await open(page);
    await expect(page.locator('html')).toHaveAttribute('data-leve-scroll-locked', '');

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(page.locator('html')).not.toHaveAttribute('data-leve-scroll-locked');
  });

  test('closeOnOutsideClick={false} では背景のクリックで閉じず、Escape では閉じる', async ({
    page,
  }) => {
    const { trigger, dialog } = await open(page, 'persistent', 'Delete project?');

    await page.mouse.click(5, 5);
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('bind:open で、コードから閉じられる', async ({ page }) => {
    const { trigger, dialog } = await open(page, 'controlled', 'Rename file');

    await dialog.getByRole('button', { name: 'Save' }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByText('Saved')).toBeVisible();
    await expect(trigger).toBeFocused();
  });
});
