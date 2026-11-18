import { expect, test } from '@playwright/test';
import { pressTab } from './keyboard';
import { gotoStory } from './story';

test.describe('Toolbar', () => {
  test('Tab で最初の項目に入り、もう一度 Tab で抜ける（タブストップは 1 つ）', async ({ page }) => {
    await gotoStory(page, 'components-toolbar--default', { focusGuards: true });
    const bold = page.getByRole('button', { name: 'Bold' });
    await expect(bold).toBeVisible({ timeout: 15_000 });

    await page.getByRole('button', { name: 'Before' }).focus();
    await pressTab(page);
    await expect(bold).toBeFocused();

    await pressTab(page);
    await expect(page.getByRole('button', { name: 'After' })).toBeFocused();
  });

  test('→ / ← で Toggle Group をまたいで項目を移動する', async ({ page }) => {
    await gotoStory(page, 'components-toolbar--default');
    const underline = page.getByRole('button', { name: 'Underline' });
    const alignLeft = page.getByRole('button', { name: 'Align left' });
    await expect(underline).toBeVisible({ timeout: 15_000 });

    await underline.focus();
    await page.keyboard.press('ArrowRight');
    await expect(alignLeft).toBeFocused();

    await page.keyboard.press('ArrowLeft');
    await expect(underline).toBeFocused();
  });

  test('Home / End で最初と最後の項目へ移動する', async ({ page }) => {
    await gotoStory(page, 'components-toolbar--default');
    const bold = page.getByRole('button', { name: 'Bold' });
    const share = page.getByRole('button', { name: 'Share' });
    await expect(bold).toBeVisible({ timeout: 15_000 });

    await bold.focus();
    await page.keyboard.press('End');
    await expect(share).toBeFocused();

    await page.keyboard.press('Home');
    await expect(bold).toBeFocused();
  });

  test('最後の項目で → を押すと最初へ循環する（loop）', async ({ page }) => {
    await gotoStory(page, 'components-toolbar--default');
    const share = page.getByRole('button', { name: 'Share' });
    await expect(share).toBeVisible({ timeout: 15_000 });

    await share.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('button', { name: 'Bold' })).toBeFocused();
  });

  test('矢印キーでは押下状態が変わらず、Space で切り替わる', async ({ page }) => {
    await gotoStory(page, 'components-toolbar--default');
    const bold = page.getByRole('button', { name: 'Bold' });
    const italic = page.getByRole('button', { name: 'Italic' });
    await expect(bold).toBeVisible({ timeout: 15_000 });

    await bold.focus();
    await page.keyboard.press('ArrowRight');
    await expect(italic).toBeFocused();
    await expect(italic).toHaveAttribute('aria-pressed', 'false');

    await page.keyboard.press('Space');
    await expect(italic).toHaveAttribute('aria-pressed', 'true');
  });

  test('Tab で戻ると、最後にフォーカスした項目に入る', async ({ page }) => {
    await gotoStory(page, 'components-toolbar--default', { focusGuards: true });
    const bold = page.getByRole('button', { name: 'Bold' });
    const alignCenter = page.getByRole('button', { name: 'Align center' });
    await expect(bold).toBeVisible({ timeout: 15_000 });

    await bold.focus();
    const order = ['Italic', 'Underline', 'Align left', 'Align center'];
    for (const name of order) {
      await page.keyboard.press('ArrowRight');
      await expect(page.getByRole('button', { name })).toBeFocused();
    }
    await expect(alignCenter).toBeFocused();

    await pressTab(page);
    await expect(page.getByRole('button', { name: 'After' })).toBeFocused();
    await pressTab(page, { shift: true });
    await expect(alignCenter).toBeFocused();
  });

  test('縦のツールバーは ↓ / ↑ で移動し、無効な項目を飛ばす。中の Toggle も項目になる', async ({
    page,
  }) => {
    await gotoStory(page, 'components-toolbar--vertical');
    const undo = page.getByRole('button', { name: 'Undo' });
    const grid = page.getByRole('button', { name: 'Show grid' });
    await expect(undo).toBeVisible({ timeout: 15_000 });

    await undo.focus();
    await page.keyboard.press('ArrowRight');
    await expect(undo).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(grid).toBeFocused();

    await page.keyboard.press('ArrowUp');
    await expect(undo).toBeFocused();
  });
});
