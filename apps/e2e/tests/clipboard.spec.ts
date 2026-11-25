import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('Clipboard', () => {
  test('displays read-only input with value', async ({ page }) => {
    await gotoStory(page, 'components-clipboard--default');

    const input = page.locator('[data-leve-clipboard-input]');
    await expect(input).toHaveValue('pnpm add @leve-ui/clipboard');
    await expect(input).toHaveAttribute('readonly', '');
  });

  test('clicking Trigger copies and announces via live region', async ({ page }) => {
    await gotoStory(page, 'components-clipboard--default');

    const root = page.locator('[data-leve-clipboard]');
    const trigger = page.getByRole('button', { name: 'Copy to clipboard' });

    await expect(root).toHaveAttribute('data-state', 'idle');
    await expect(root).not.toHaveAttribute('data-copied', '');

    await trigger.click();

    await expect(root).toHaveAttribute('data-state', 'copied');
    await expect(root).toHaveAttribute('data-copied', '');
    await expect(trigger).toHaveAttribute('data-state', 'copied');

    const region = page.locator('[data-leve-announcer-region="polite"]');
    await expect(region).toHaveText('Copied to clipboard');
  });

  test('Space key on Trigger copies', async ({ page }) => {
    await gotoStory(page, 'components-clipboard--default');

    const root = page.locator('[data-leve-clipboard]');
    const trigger = page.getByRole('button', { name: 'Copy to clipboard' });

    await trigger.focus();
    await page.keyboard.press('Space');

    await expect(root).toHaveAttribute('data-state', 'copied');
    await expect(root).toHaveAttribute('data-copied', '');
  });

  test('Enter key on Trigger copies', async ({ page }) => {
    await gotoStory(page, 'components-clipboard--default');

    const root = page.locator('[data-leve-clipboard]');
    const trigger = page.getByRole('button', { name: 'Copy to clipboard' });

    await trigger.focus();
    await page.keyboard.press('Enter');

    await expect(root).toHaveAttribute('data-state', 'copied');
    await expect(root).toHaveAttribute('data-copied', '');
  });

  test('resets copied state after custom timeout', async ({ page }) => {
    await gotoStory(page, 'components-clipboard--custom-timeout');

    const root = page.locator('[data-leve-clipboard]');
    const trigger = page.getByRole('button', { name: 'Copy API key' });

    await trigger.click();
    await expect(root).toHaveAttribute('data-state', 'copied');
    await expect(root).toHaveAttribute('data-copied', '');

    await expect(root).toHaveAttribute('data-state', 'idle', { timeout: 2000 });
    await expect(root).not.toHaveAttribute('data-copied', '');
  });
});
