import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('Collapsible', () => {
  test('Enter で開く', async ({ page }) => {
    await gotoStory(page, 'components-collapsible--default');

    const trigger = page.getByRole('button', {
      name: 'Can I use this component in my project?',
    });
    const content = page.locator('[data-leve-collapsible-content]');

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(content).toBeHidden();

    await trigger.focus();
    await page.keyboard.press('Enter');

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(content).toBeVisible();
  });

  test('Enter でもう一度押すと閉じる', async ({ page }) => {
    await gotoStory(page, 'components-collapsible--default');

    const trigger = page.getByRole('button', {
      name: 'Can I use this component in my project?',
    });
    const content = page.locator('[data-leve-collapsible-content]');

    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(content).toBeVisible();

    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(content).toBeHidden();
  });

  test('Space で開く', async ({ page }) => {
    await gotoStory(page, 'components-collapsible--default');

    const trigger = page.getByRole('button', {
      name: 'Can I use this component in my project?',
    });
    const content = page.locator('[data-leve-collapsible-content]');

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(content).toBeHidden();

    await trigger.focus();
    await page.keyboard.press('Space');

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(content).toBeVisible();
  });

  test('クリックで開閉', async ({ page }) => {
    await gotoStory(page, 'components-collapsible--default');

    const trigger = page.getByRole('button', {
      name: 'Can I use this component in my project?',
    });
    const content = page.locator('[data-leve-collapsible-content]');

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(trigger).toHaveAttribute('data-state', 'open');
    await expect(content).toBeVisible();
    await expect(content).toHaveAttribute('data-state', 'open');

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveAttribute('data-state', 'closed');
    await expect(content).toBeHidden();
    await expect(content).toHaveAttribute('data-state', 'closed');
  });

  test('開いたとき Content が表示され aria-expanded="true"', async ({ page }) => {
    await gotoStory(page, 'components-collapsible--open');

    const trigger = page.getByRole('button', { name: 'What is leve-ui?' });
    const content = page.locator('[data-leve-collapsible-content]');

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(trigger).toHaveAttribute('data-state', 'open');
    await expect(content).toBeVisible();
    await expect(content).toHaveAttribute('data-state', 'open');
    await expect(content).not.toHaveAttribute('hidden', '');
  });

  test('Tab で Trigger にフォーカス', async ({ page }) => {
    await gotoStory(page, 'components-collapsible--controlled');

    const external = page.getByRole('button', { name: 'Open from outside' });
    const trigger = page.getByRole('button', { name: 'Controlled collapsible' });

    await external.focus();
    await page.keyboard.press('Tab');
    await expect(trigger).toBeFocused();
  });

  test('disabled の Trigger はフォーカスできず開かない', async ({ page }) => {
    await gotoStory(page, 'components-collapsible--disabled');

    const trigger = page.getByRole('button', { name: 'Disabled section' });
    const content = page.locator('[data-leve-collapsible-content]');

    await expect(trigger).toBeDisabled();
    await expect(trigger).toHaveAttribute('data-disabled', '');

    await page.keyboard.press('Tab');
    await expect(trigger).not.toBeFocused();

    await trigger.click({ force: true });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(content).toBeHidden();
  });
});
