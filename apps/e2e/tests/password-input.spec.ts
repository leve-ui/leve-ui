import { expect, test } from '@playwright/test';
import { pressTab } from './keyboard';
import { gotoStory } from './story';

test.describe('PasswordInput', () => {
  test('toggles visibility on VisibilityTrigger click', async ({ page }) => {
    await gotoStory(page, 'components-passwordinput--default');

    const input = page.getByLabel('Password', { exact: true });
    const trigger = page.getByRole('button', { name: 'Toggle password visibility' });

    await expect(input).toHaveAttribute('type', 'password');
    await expect(trigger).toHaveAttribute('aria-pressed', 'false');

    await trigger.click();
    await expect(input).toHaveAttribute('type', 'text');
    await expect(trigger).toHaveAttribute('aria-pressed', 'true');

    await trigger.click();
    await expect(input).toHaveAttribute('type', 'password');
    await expect(trigger).toHaveAttribute('aria-pressed', 'false');
  });

  test('toggles visibility with Space and Enter on VisibilityTrigger', async ({ page }) => {
    await gotoStory(page, 'components-passwordinput--default');

    const input = page.getByLabel('Password', { exact: true });
    const trigger = page.getByRole('button', { name: 'Toggle password visibility' });

    await trigger.focus();
    await expect(trigger).toBeFocused();

    await page.keyboard.press('Space');
    await expect(input).toHaveAttribute('type', 'text');
    await expect(trigger).toHaveAttribute('aria-pressed', 'true');

    await page.keyboard.press('Enter');
    await expect(input).toHaveAttribute('type', 'password');
    await expect(trigger).toHaveAttribute('aria-pressed', 'false');
  });

  test('preserves typed value when toggling visibility', async ({ page }) => {
    await gotoStory(page, 'components-passwordinput--default');

    const input = page.getByLabel('Password', { exact: true });
    const trigger = page.getByRole('button', { name: 'Toggle password visibility' });

    await input.fill('my-secret-123');
    await expect(input).toHaveAttribute('type', 'password');
    await expect(input).toHaveValue('my-secret-123');

    await trigger.click();
    await expect(input).toHaveAttribute('type', 'text');
    await expect(input).toHaveValue('my-secret-123');
  });

  test('skips disabled input and trigger on Tab', async ({ page }) => {
    await gotoStory(page, 'components-passwordinput--disabled', { focusGuards: true });

    const before = page.getByRole('button', { name: 'Before' });
    const after = page.getByRole('button', { name: 'After' });
    const input = page.getByLabel('Password', { exact: true });
    const trigger = page.getByRole('button', { name: 'Toggle password visibility' });

    await expect(input).toBeDisabled();
    await expect(trigger).toBeDisabled();

    await before.focus();
    await expect(before).toBeFocused();

    await pressTab(page);
    await expect(after).toBeFocused();
  });

  test('associates Field.Label with the password input', async ({ page }) => {
    await gotoStory(page, 'components-passwordinput--with-field');

    const label = page.getByText('Password');
    const input = page.getByLabel('Password', { exact: true });

    await label.click();
    await expect(input).toBeFocused();
  });
});
