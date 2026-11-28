import { expect, test } from '@playwright/test';
import { pressTab } from './keyboard';
import { gotoStory } from './story';

test.describe('Steps', () => {
  test('navigates between steps by clicking Triggers', async ({ page }) => {
    await gotoStory(page, 'components-steps--default');

    const items = page.locator('[data-leve-steps-item]');
    const accountTrigger = page.getByRole('button', { name: 'Account' });
    const profileTrigger = page.getByRole('button', { name: 'Profile' });
    const reviewTrigger = page.getByRole('button', { name: 'Review' });

    await expect(items.nth(0)).toHaveAttribute('aria-current', 'step');
    await expect(accountTrigger).toHaveAttribute('data-state', 'current');
    await expect(
      page.getByText('Enter your email and password to create an account.'),
    ).toBeVisible();

    await reviewTrigger.click();
    await expect(items.nth(0)).not.toHaveAttribute('aria-current', 'step');
    await expect(items.nth(0)).toHaveAttribute('data-state', 'complete');
    await expect(items.nth(1)).toHaveAttribute('data-state', 'complete');
    await expect(items.nth(2)).toHaveAttribute('aria-current', 'step');
    await expect(items.nth(2)).toHaveAttribute('data-state', 'current');
    await expect(page.getByText('Confirm your information before submitting.')).toBeVisible();

    await profileTrigger.click();
    await expect(items.nth(1)).toHaveAttribute('aria-current', 'step');
    await expect(items.nth(2)).toHaveAttribute('data-state', 'upcoming');
    await expect(page.getByText('Add your display name and profile details.')).toBeVisible();
  });

  test('navigates sequentially with NextTrigger and PrevTrigger and disables at boundaries', async ({
    page,
  }) => {
    await gotoStory(page, 'components-steps--default');

    const items = page.locator('[data-leve-steps-item]');
    const prev = page.getByRole('button', { name: 'Previous' });
    const next = page.getByRole('button', { name: 'Next' });

    await expect(prev).toBeDisabled();
    await expect(next).toBeEnabled();

    await next.click();
    await expect(items.nth(1)).toHaveAttribute('aria-current', 'step');
    await expect(prev).toBeEnabled();
    await expect(next).toBeEnabled();
    await expect(page.getByText('Add your display name and profile details.')).toBeVisible();

    await next.click();
    await expect(items.nth(2)).toHaveAttribute('aria-current', 'step');
    await expect(prev).toBeEnabled();
    await expect(next).toBeDisabled();
    await expect(page.getByText('Confirm your information before submitting.')).toBeVisible();

    await prev.click();
    await expect(items.nth(1)).toHaveAttribute('aria-current', 'step');
    await expect(next).toBeEnabled();
  });

  test('restricts jumping ahead to upcoming steps in linear mode', async ({ page }) => {
    await gotoStory(page, 'components-steps--linear');

    const items = page.locator('[data-leve-steps-item]');
    const shipping = page.getByRole('button', { name: 'Shipping' });
    const payment = page.getByRole('button', { name: 'Payment' });
    const confirmation = page.getByRole('button', { name: 'Confirmation' });
    const next = page.getByRole('button', { name: 'Next' });

    await expect(shipping).toBeEnabled();
    await expect(payment).toBeDisabled();
    await expect(confirmation).toBeDisabled();
    await expect(items.nth(0)).toHaveAttribute('aria-current', 'step');

    await next.click();
    await expect(items.nth(1)).toHaveAttribute('aria-current', 'step');
    await expect(shipping).toBeEnabled();
    await expect(payment).toBeEnabled();
    await expect(confirmation).toBeDisabled();

    // Navigating backward to a completed step via Trigger is allowed
    await shipping.click();
    await expect(items.nth(0)).toHaveAttribute('aria-current', 'step');
    await expect(payment).toBeDisabled();

    // Advancing to the final step enables all previous steps
    await next.click();
    await next.click();
    await expect(items.nth(2)).toHaveAttribute('aria-current', 'step');
    await expect(shipping).toBeEnabled();
    await expect(payment).toBeEnabled();
    await expect(confirmation).toBeEnabled();
  });

  test('supports Tab navigation and Enter/Space activation', async ({ page }) => {
    await gotoStory(page, 'components-steps--default', { focusGuards: true });

    const before = page.getByRole('button', { name: 'Before' });
    const after = page.getByRole('button', { name: 'After' });
    const account = page.getByRole('button', { name: 'Account' });
    const profile = page.getByRole('button', { name: 'Profile' });
    const review = page.getByRole('button', { name: 'Review' });
    const prev = page.getByRole('button', { name: 'Previous' });
    const items = page.locator('[data-leve-steps-item]');

    await before.focus();

    await pressTab(page);
    await expect(account).toBeFocused();

    await pressTab(page);
    await expect(profile).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(items.nth(1)).toHaveAttribute('aria-current', 'step');
    await expect(page.getByText('Add your display name and profile details.')).toBeVisible();

    await pressTab(page);
    await expect(review).toBeFocused();
    await page.keyboard.press('Space');
    await expect(items.nth(2)).toHaveAttribute('aria-current', 'step');
    await expect(page.getByText('Confirm your information before submitting.')).toBeVisible();

    // Prev is now enabled; Next is disabled on the final step so Tab skips Next and reaches After
    await pressTab(page);
    await expect(prev).toBeFocused();

    await pressTab(page);
    await expect(after).toBeFocused();
  });

  test('renders vertical orientation attributes', async ({ page }) => {
    await gotoStory(page, 'components-steps--vertical');

    const root = page.locator('[data-leve-steps]');
    await expect(root).toHaveAttribute('data-orientation', 'vertical');
    await expect(page.locator('[data-leve-steps-list]')).toHaveAttribute(
      'data-orientation',
      'vertical',
    );

    await page.getByRole('button', { name: 'Delivered' }).click();
    await expect(page.getByText('Your package has arrived at the delivery address.')).toBeVisible();
  });

  test('synchronizes external status and reset in controlled mode', async ({ page }) => {
    await gotoStory(page, 'components-steps--controlled');

    await expect(page.getByText('Step 2 of 3')).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Step 3 of 3')).toBeVisible();

    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(page.getByText('Step 1 of 3')).toBeVisible();
  });
});
