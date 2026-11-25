import { expect, test } from '@playwright/test';
import { pressTab } from './keyboard';
import { gotoStory } from './story';

test.describe('RatingGroup', () => {
  test('renders radiogroup with radio items and selects on click', async ({ page }) => {
    await gotoStory(page, 'components-ratinggroup--default');

    const group = page.getByRole('radiogroup', { name: 'Product rating' });
    await expect(group).toBeVisible();

    const radios = group.getByRole('radio');
    await expect(radios).toHaveCount(5);
    await expect(radios.nth(2)).toHaveAttribute('aria-checked', 'true');

    await radios.nth(4).click();
    await expect(radios.nth(4)).toHaveAttribute('aria-checked', 'true');
    await expect(radios.nth(2)).toHaveAttribute('aria-checked', 'false');
  });

  test('navigates and selects with ArrowRight, ArrowUp, ArrowLeft, ArrowDown, Home, End, and Space', async ({
    page,
  }) => {
    await gotoStory(page, 'components-ratinggroup--default');

    const radios = page.getByRole('radiogroup', { name: 'Product rating' }).getByRole('radio');
    await radios.nth(2).focus();
    await expect(radios.nth(2)).toBeFocused();

    await page.keyboard.press('ArrowRight');
    await expect(radios.nth(3)).toBeFocused();
    await expect(radios.nth(3)).toHaveAttribute('aria-checked', 'true');

    await page.keyboard.press('ArrowUp');
    await expect(radios.nth(4)).toBeFocused();
    await expect(radios.nth(4)).toHaveAttribute('aria-checked', 'true');

    await page.keyboard.press('ArrowLeft');
    await expect(radios.nth(3)).toBeFocused();
    await expect(radios.nth(3)).toHaveAttribute('aria-checked', 'true');

    await page.keyboard.press('ArrowDown');
    await expect(radios.nth(2)).toBeFocused();
    await expect(radios.nth(2)).toHaveAttribute('aria-checked', 'true');

    await page.keyboard.press('Home');
    await expect(radios.nth(0)).toBeFocused();
    await expect(radios.nth(0)).toHaveAttribute('aria-checked', 'true');

    await page.keyboard.press('End');
    await expect(radios.nth(4)).toBeFocused();
    await expect(radios.nth(4)).toHaveAttribute('aria-checked', 'true');

    await radios.nth(1).focus();
    await page.keyboard.press(' ');
    await expect(radios.nth(1)).toHaveAttribute('aria-checked', 'true');
  });

  test('supports Tab into and out of the group with roving tabindex', async ({ page }) => {
    await gotoStory(page, 'components-ratinggroup--default', { focusGuards: true });

    const before = page.getByRole('button', { name: 'Before' });
    const after = page.getByRole('button', { name: 'After' });
    const radios = page.getByRole('radiogroup', { name: 'Product rating' }).getByRole('radio');

    await before.focus();
    await pressTab(page);
    // defaultValue is 3 -> 3rd item has tabIndex 0
    await expect(radios.nth(2)).toBeFocused();

    await pressTab(page);
    await expect(after).toBeFocused();
  });

  test('supports half-star ratings via keyboard and pointer', async ({ page }) => {
    await gotoStory(page, 'components-ratinggroup--half-ratings');

    const group = page.getByRole('radiogroup', { name: 'Half-star rating' });
    const radios = group.getByRole('radio');

    // Initial value is 3.5 -> 4th item is half
    await expect(radios.nth(3)).toHaveAttribute('data-state', 'half');
    await expect(radios.nth(3)).toHaveAttribute('aria-checked', 'true');

    await radios.nth(3).focus();
    await page.keyboard.press('ArrowRight');
    await expect(radios.nth(3)).toHaveAttribute('data-state', 'checked');
    await expect(page.getByText('4 stars')).toBeVisible();

    await page.keyboard.press('ArrowDown');
    await expect(radios.nth(3)).toHaveAttribute('data-state', 'half');
    await expect(page.getByText('3.5 stars')).toBeVisible();

    // Click left half of 2nd star -> 1.5
    const box = await radios.nth(1).boundingBox();
    if (!box) throw new Error('Expected bounding box for 2nd star');
    await page.mouse.click(box.x + box.width * 0.2, box.y + box.height / 2);
    await expect(radios.nth(1)).toHaveAttribute('data-state', 'half');
    await expect(page.getByText('1.5 stars')).toBeVisible();
  });

  test('keeps readOnly items focusable but prevents changes', async ({ page }) => {
    await gotoStory(page, 'components-ratinggroup--read-only');

    const group = page.getByRole('radiogroup', { name: 'Average customer rating' });
    const radios = group.getByRole('radio');
    await expect(group).toHaveAttribute('aria-readonly', 'true');

    await radios.nth(3).focus();
    await expect(radios.nth(3)).toBeFocused();

    await page.keyboard.press('ArrowLeft');
    await expect(radios.nth(3)).toHaveAttribute('aria-checked', 'true');

    await radios.nth(0).click();
    await expect(radios.nth(3)).toHaveAttribute('aria-checked', 'true');
  });

  test('prevents focus and interaction when disabled', async ({ page }) => {
    await gotoStory(page, 'components-ratinggroup--disabled', { focusGuards: true });

    const before = page.getByRole('button', { name: 'Before' });
    const after = page.getByRole('button', { name: 'After' });
    const group = page.getByRole('radiogroup', { name: 'Disabled rating' });

    await expect(group).toHaveAttribute('aria-disabled', 'true');
    await before.focus();
    await pressTab(page);
    await expect(after).toBeFocused();
  });

  test('submits and resets rating with native form', async ({ page }) => {
    await gotoStory(page, 'components-ratinggroup--with-form');

    const radios = page.getByRole('radiogroup', { name: 'Service rating' }).getByRole('radio');
    await radios.nth(4).click();
    await expect(radios.nth(4)).toHaveAttribute('aria-checked', 'true');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByTestId('submitted-rating')).toHaveText('Submitted: 5');

    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(radios.nth(2)).toHaveAttribute('aria-checked', 'true');

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByTestId('submitted-rating')).toHaveText('Submitted: 3');
  });
});
