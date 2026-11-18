import { expect, type Page, test } from '@playwright/test';
import { pressTab } from './keyboard';
import { gotoStory } from './story';

const open = async (page: Page, story: string, triggerName: string, name: string) => {
  await gotoStory(page, `components-drawer--${story}`);
  const trigger = page.getByRole('button', { name: triggerName });
  await expect(trigger).toBeVisible({ timeout: 15_000 });
  await trigger.click();
  const drawer = page.getByRole('dialog', { name });
  await expect(drawer).toBeVisible();
  return { trigger, drawer };
};

test.describe('Drawer（非モーダル）', () => {
  const openDefault = (page: Page) => open(page, 'default', 'Order details', 'Order #1042');

  test('Trigger で開き、Drawer の中にフォーカスが移る', async ({ page }) => {
    const { trigger, drawer } = await openDefault(page);

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(drawer).not.toHaveAttribute('aria-modal');
    await expect(drawer).toHaveAccessibleDescription('Shipped on November 12 to Osaka.');
    await expect(drawer.getByRole('button', { name: 'Close' })).toBeFocused();
  });

  test('開いている間もページを操作でき、外側のクリックでは閉じない', async ({ page }) => {
    const { drawer } = await openDefault(page);
    const other = page.getByRole('button', { name: 'Another page action' });

    await other.click();
    await expect(drawer).toBeVisible();
    // WebKit does not focus a button on click; move focus to it like a keyboard user would
    await other.focus();
    await expect(other).toBeFocused();
    await expect(drawer).toBeVisible();
  });

  test('Tab で Drawer の外へ出られる（フォーカスを閉じ込めない）', async ({ page }) => {
    const { drawer } = await openDefault(page);
    await expect(drawer.getByRole('button', { name: 'Close' })).toBeFocused();

    await pressTab(page);
    await expect
      .poll(() => drawer.evaluate((el) => el.contains(document.activeElement)))
      .toBe(false);
    await expect(drawer).toBeVisible();
  });

  test('Escape で閉じ、Trigger にフォーカスが戻る', async ({ page }) => {
    const { trigger, drawer } = await openDefault(page);

    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('ページの別の場所にフォーカスがあるときに閉じても、フォーカスを動かさない', async ({
    page,
  }) => {
    const { drawer } = await openDefault(page);
    const other = page.getByRole('button', { name: 'Another page action' });

    await other.focus();
    await expect(other).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(other).toBeFocused();
  });

  test('開いているときに Trigger を押すと閉じる', async ({ page }) => {
    const { trigger, drawer } = await openDefault(page);

    await trigger.click();
    await expect(drawer).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('Drawer（モーダル）', () => {
  const openModal = (page: Page) => open(page, 'modal', 'Open navigation', 'Navigation');

  test('aria-modal が付き、Tab は Drawer の中で循環する', async ({ page }) => {
    const { drawer } = await openModal(page);

    await expect(drawer).toHaveAttribute('aria-modal', 'true');
    await expect(drawer.getByRole('link', { name: 'Home' })).toBeFocused();
    await pressTab(page, { shift: true });
    await expect(drawer.getByRole('button', { name: 'Close' })).toBeFocused();
    await pressTab(page);
    await expect(drawer.getByRole('link', { name: 'Home' })).toBeFocused();
  });

  test('背景のクリックで閉じ、Trigger にフォーカスが戻る', async ({ page }) => {
    const { trigger, drawer } = await openModal(page);

    await page.mouse.click((page.viewportSize()?.width ?? 1280) - 5, 5);
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('開いている間はページのスクロールを止める', async ({ page }) => {
    const { drawer } = await openModal(page);
    await expect(page.locator('html')).toHaveAttribute('data-leve-scroll-locked', '');

    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(page.locator('html')).not.toHaveAttribute('data-leve-scroll-locked');
  });
});
