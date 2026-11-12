import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('ToggleGroup', () => {
  test('Tab でグループ内の tab stop（押下中の項目）にフォーカスし、もう一度 Tab でグループから抜ける', async ({
    page,
  }) => {
    await gotoStory(page, 'components-togglegroup--default');
    const left = page.getByRole('button', { name: 'Align left' });
    await expect(left).toBeVisible({ timeout: 15_000 });

    await page.keyboard.press('Tab');
    await expect(left).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(left).not.toBeFocused();
  });

  test('水平方向で ArrowRight / ArrowLeft でフォーカスが移動しループする', async ({ page }) => {
    await gotoStory(page, 'components-togglegroup--default');
    const left = page.getByRole('button', { name: 'Align left' });
    const center = page.getByRole('button', { name: 'Align center' });
    const right = page.getByRole('button', { name: 'Align right' });
    await expect(left).toBeVisible({ timeout: 15_000 });

    await left.focus();
    await page.keyboard.press('ArrowRight');
    await expect(center).toBeFocused();

    await page.keyboard.press('ArrowRight');
    await expect(right).toBeFocused();

    // Loop at end
    await page.keyboard.press('ArrowRight');
    await expect(left).toBeFocused();

    // Loop backwards
    await page.keyboard.press('ArrowLeft');
    await expect(right).toBeFocused();
  });

  test('垂直方向（Vertical）で ArrowDown / ArrowUp でフォーカスが移動しループする', async ({
    page,
  }) => {
    await gotoStory(page, 'components-togglegroup--vertical');
    const top = page.getByRole('button', { name: 'Align top' });
    const middle = page.getByRole('button', { name: 'Align middle' });
    const bottom = page.getByRole('button', { name: 'Align bottom' });
    await expect(top).toBeVisible({ timeout: 15_000 });

    await top.focus();
    await page.keyboard.press('ArrowDown');
    await expect(middle).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(bottom).toBeFocused();

    // Loop at bottom
    await page.keyboard.press('ArrowDown');
    await expect(top).toBeFocused();

    // Loop upwards
    await page.keyboard.press('ArrowUp');
    await expect(bottom).toBeFocused();
  });

  test('Home / End で先頭 / 末尾の項目へフォーカスが移動する', async ({ page }) => {
    await gotoStory(page, 'components-togglegroup--default');
    const left = page.getByRole('button', { name: 'Align left' });
    const center = page.getByRole('button', { name: 'Align center' });
    const right = page.getByRole('button', { name: 'Align right' });
    await expect(left).toBeVisible({ timeout: 15_000 });

    await center.focus();
    await page.keyboard.press('End');
    await expect(right).toBeFocused();

    await page.keyboard.press('Home');
    await expect(left).toBeFocused();
  });

  test('無効化された項目は矢印キーでスキップされる', async ({ page }) => {
    await gotoStory(page, 'components-togglegroup--disabled');
    const left = page.getByRole('button', { name: 'Align left' });
    const center = page.getByRole('button', { name: 'Align center' });
    const right = page.getByRole('button', { name: 'Align right' });
    await expect(left).toBeVisible({ timeout: 15_000 });
    await expect(center).toBeDisabled();

    await left.focus();
    await page.keyboard.press('ArrowRight');
    // Center is disabled, so focus moves directly to Right
    await expect(right).toBeFocused();

    await page.keyboard.press('ArrowLeft');
    await expect(left).toBeFocused();
  });

  test('Enter と Space でフォーカス項目がトグルされ、single モードでは押下位置が移動する', async ({
    page,
  }) => {
    await gotoStory(page, 'components-togglegroup--default');
    const left = page.getByRole('button', { name: 'Align left' });
    const center = page.getByRole('button', { name: 'Align center' });
    await expect(left).toBeVisible({ timeout: 15_000 });

    // Initial state: left is pressed
    await expect(left).toHaveAttribute('aria-pressed', 'true');
    await expect(center).toHaveAttribute('aria-pressed', 'false');

    // Move to center and press Enter
    await left.focus();
    await page.keyboard.press('ArrowRight');
    await expect(center).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(center).toHaveAttribute('aria-pressed', 'true');
    await expect(left).toHaveAttribute('aria-pressed', 'false');

    // Press Space on center to unpress it
    await page.keyboard.press('Space');
    await expect(center).toHaveAttribute('aria-pressed', 'false');
    await expect(left).toHaveAttribute('aria-pressed', 'false');
  });

  test('Multiple ストーリーで複数の項目を同時に押下できる', async ({ page }) => {
    await gotoStory(page, 'components-togglegroup--multiple');
    const bold = page.getByRole('button', { name: 'Bold text' });
    const italic = page.getByRole('button', { name: 'Italic text' });
    const underline = page.getByRole('button', { name: 'Underline text' });
    await expect(bold).toBeVisible({ timeout: 15_000 });

    // Initial state: bold is pressed
    await expect(bold).toHaveAttribute('aria-pressed', 'true');
    await expect(italic).toHaveAttribute('aria-pressed', 'false');
    await expect(underline).toHaveAttribute('aria-pressed', 'false');

    // Click italic
    await italic.click();
    await expect(bold).toHaveAttribute('aria-pressed', 'true');
    await expect(italic).toHaveAttribute('aria-pressed', 'true');
    await expect(underline).toHaveAttribute('aria-pressed', 'false');

    // Click underline
    await underline.click();
    await expect(bold).toHaveAttribute('aria-pressed', 'true');
    await expect(italic).toHaveAttribute('aria-pressed', 'true');
    await expect(underline).toHaveAttribute('aria-pressed', 'true');

    // Click bold to toggle off
    await bold.click();
    await expect(bold).toHaveAttribute('aria-pressed', 'false');
    await expect(italic).toHaveAttribute('aria-pressed', 'true');
    await expect(underline).toHaveAttribute('aria-pressed', 'true');
  });
});
