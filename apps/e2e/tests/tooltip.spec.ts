import { expect, type Page, test } from '@playwright/test';
import { gotoStory } from './story';

const setup = async (page: Page) => {
  await gotoStory(page, 'components-tooltip--default');
  const trigger = page.getByRole('button', { name: 'Undo' });
  await expect(trigger).toBeVisible({ timeout: 15_000 });
  return { trigger, tooltip: page.getByRole('tooltip') };
};

test.describe('Tooltip', () => {
  test('フォーカスですぐに表示し、Trigger の説明になる', async ({ page }) => {
    const { trigger, tooltip } = await setup(page);

    // WebKit does not move to buttons with Tab by default
    await trigger.focus();
    await expect(trigger).toBeFocused();
    await expect(tooltip).toBeVisible();
    await expect(trigger).toHaveAccessibleDescription('Undo the last change (Ctrl+Z)');
  });

  test('フォーカスが外れると隠れる', async ({ page }) => {
    const { trigger, tooltip } = await setup(page);

    await trigger.focus();
    await expect(tooltip).toBeVisible();
    await trigger.blur();
    await expect(tooltip).toBeHidden();
  });

  test('Escape で隠れ、フォーカスは Trigger に残る', async ({ page }) => {
    const { trigger, tooltip } = await setup(page);

    await trigger.focus();
    await expect(tooltip).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(tooltip).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('ポインタを載せると遅れて表示し、離すと隠れる', async ({ page }) => {
    const { trigger, tooltip } = await setup(page);

    await trigger.hover();
    await page.waitForTimeout(300);
    await expect(tooltip).toBeHidden();
    await expect(tooltip).toBeVisible();

    await page.mouse.move(5, 5);
    await expect(tooltip).toBeHidden();
  });

  test('ポインタを Tooltip に移す間は閉じない（WCAG 1.4.13）', async ({ page }) => {
    const { trigger, tooltip } = await setup(page);

    await trigger.hover();
    await expect(tooltip).toBeVisible();
    await tooltip.hover();
    await page.waitForTimeout(500);
    await expect(tooltip).toBeVisible();
  });

  test('Trigger を押すと隠れる', async ({ page }) => {
    const { trigger, tooltip } = await setup(page);

    await trigger.hover();
    await expect(tooltip).toBeVisible();
    await page.mouse.down();
    await expect(tooltip).toBeHidden();
    await page.mouse.up();
  });
});
