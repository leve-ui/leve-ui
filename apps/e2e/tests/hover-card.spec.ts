import { expect, type Page, test } from '@playwright/test';
import { gotoStory } from './story';

const setup = async (page: Page) => {
  await gotoStory(page, 'components-hovercard--default');
  const trigger = page.getByRole('link', { name: '@ada' });
  await expect(trigger).toBeVisible({ timeout: 15_000 });
  return { trigger, card: page.locator('[data-leve-hover-card-content]') };
};

test.describe('Hover Card', () => {
  test('ポインタを載せると遅れて表示し、離すと隠れる', async ({ page }) => {
    const { trigger, card } = await setup(page);

    await trigger.hover();
    await page.waitForTimeout(300);
    await expect(card).toBeHidden();
    await expect(card).toBeVisible();

    await page.mouse.move(5, 5);
    await expect(card).toBeHidden();
  });

  test('ポインタを Content に移しても閉じず、中のリンクを押せる', async ({ page }) => {
    const { trigger, card } = await setup(page);

    await trigger.hover();
    await expect(card).toBeVisible();
    const link = card.getByRole('link', { name: 'View profile' });
    await link.hover();
    await page.waitForTimeout(500);
    await expect(card).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/#ada$/);
  });

  test('フォーカスで遅れて表示し、フォーカスが外れると隠れる', async ({ page }) => {
    const { trigger, card } = await setup(page);

    await trigger.focus();
    await expect(card).toBeVisible();
    await expect(trigger).toBeFocused();

    await trigger.blur();
    await expect(card).toBeHidden();
  });

  test('Escape で隠れる', async ({ page }) => {
    const { trigger, card } = await setup(page);

    await trigger.focus();
    await expect(card).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(card).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('as にカスタムリンクコンポーネントを渡しても属性とクライアントサイド遷移が機能する', async ({
    page,
  }) => {
    await gotoStory(page, 'components-hovercard--custom-trigger');
    const trigger = page.getByRole('link', { name: '@ada' });
    const card = page.locator('[data-leve-hover-card-content]');
    await expect(trigger).toBeVisible({ timeout: 15_000 });

    await page.evaluate(() => {
      (window as unknown as { __noReload?: boolean }).__noReload = true;
    });

    await trigger.focus();
    await expect(card).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(card).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await expect(page.getByText('Navigated to /users/ada')).toBeVisible();
    expect(
      await page.evaluate(() => (window as unknown as { __noReload?: boolean }).__noReload),
    ).toBe(true);
  });
});
