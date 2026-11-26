import { expect, test } from '@playwright/test';
import { pressTab } from './keyboard';
import { gotoStory } from './story';

test.describe('Slider', () => {
  test('supports keyboard navigation with Arrow keys, PageUp, PageDown, Home, and End', async ({
    page,
  }) => {
    await gotoStory(page, 'components-slider--default');

    const thumb = page.getByRole('slider', { name: 'Volume' });
    await expect(thumb).toHaveAttribute('aria-valuenow', '40');

    await thumb.focus();
    await expect(thumb).toBeFocused();

    await page.keyboard.press('ArrowRight');
    await expect(thumb).toHaveAttribute('aria-valuenow', '41');

    await page.keyboard.press('ArrowUp');
    await expect(thumb).toHaveAttribute('aria-valuenow', '42');

    await page.keyboard.press('ArrowLeft');
    await expect(thumb).toHaveAttribute('aria-valuenow', '41');

    await page.keyboard.press('ArrowDown');
    await expect(thumb).toHaveAttribute('aria-valuenow', '40');

    await page.keyboard.press('PageUp');
    await expect(thumb).toHaveAttribute('aria-valuenow', '50');

    await page.keyboard.press('PageDown');
    await expect(thumb).toHaveAttribute('aria-valuenow', '40');

    await page.keyboard.press('Home');
    await expect(thumb).toHaveAttribute('aria-valuenow', '0');

    await page.keyboard.press('End');
    await expect(thumb).toHaveAttribute('aria-valuenow', '100');
  });

  test('supports multi-thumb crossing prevention and dynamic aria-valuemin/aria-valuemax', async ({
    page,
  }) => {
    await gotoStory(page, 'components-slider--range');

    const minThumb = page.getByRole('slider', { name: 'Minimum price' });
    const maxThumb = page.getByRole('slider', { name: 'Maximum price' });

    await expect(minThumb).toHaveAttribute('aria-valuenow', '20');
    await expect(minThumb).toHaveAttribute('aria-valuemax', '70');
    await expect(maxThumb).toHaveAttribute('aria-valuenow', '80');
    await expect(maxThumb).toHaveAttribute('aria-valuemin', '30');

    // Pressing End on minThumb stops at 70 (80 - 2 * 5)
    await minThumb.focus();
    await page.keyboard.press('End');
    await expect(minThumb).toHaveAttribute('aria-valuenow', '70');
    await expect(maxThumb).toHaveAttribute('aria-valuemin', '80');

    // Pressing ArrowRight cannot cross maxThumb
    await page.keyboard.press('ArrowRight');
    await expect(minThumb).toHaveAttribute('aria-valuenow', '70');

    // Pressing Home on maxThumb stops at 80 (70 + 2 * 5)
    await maxThumb.focus();
    await page.keyboard.press('Home');
    await expect(maxThumb).toHaveAttribute('aria-valuenow', '80');
  });

  test('supports vertical slider orientation and keyboard interaction', async ({ page }) => {
    await gotoStory(page, 'components-slider--vertical');

    const thumb = page.getByRole('slider', { name: 'Gain' });
    await expect(thumb).toHaveAttribute('aria-orientation', 'vertical');
    await expect(thumb).toHaveAttribute('aria-valuenow', '60');

    await thumb.focus();
    await page.keyboard.press('ArrowUp');
    await expect(thumb).toHaveAttribute('aria-valuenow', '61');

    await page.keyboard.press('ArrowDown');
    await expect(thumb).toHaveAttribute('aria-valuenow', '60');
  });

  test('supports pointer dragging on Track and Thumb', async ({ page }) => {
    await gotoStory(page, 'components-slider--controlled');

    const track = page.locator('[data-leve-slider-track]');
    const thumb = page.getByRole('slider', { name: 'Volume' });
    const box = await track.boundingBox();
    if (!box) throw new Error('Expected bounding box for slider track');

    // Click & drag from 20% to 80% on the track
    const startX = box.x + box.width * 0.2;
    const endX = box.x + box.width * 0.8;
    const y = box.y + box.height / 2;

    await page.mouse.move(startX, y);
    await page.mouse.down();
    await expect(thumb).toHaveAttribute('aria-valuenow', '20');
    await expect(thumb).toHaveAttribute('data-state', 'dragging');

    await page.mouse.move(endX, y);
    await expect(thumb).toHaveAttribute('aria-valuenow', '80');

    await page.mouse.up();
    await expect(thumb).toHaveAttribute('data-state', 'idle');
    await expect(page.getByText('80% (committed: 80%)')).toBeVisible();
  });

  test('prevents interaction when disabled or readOnly', async ({ page }) => {
    await gotoStory(page, 'components-slider--disabled', { focusGuards: true });

    const before = page.getByRole('button', { name: 'Before' });
    const after = page.getByRole('button', { name: 'After' });
    const disabledThumb = page.getByRole('slider', { name: 'Disabled slider' });

    await expect(disabledThumb).toHaveAttribute('aria-disabled', 'true');
    await expect(disabledThumb).toHaveAttribute('tabindex', '-1');

    // Tab skips disabled thumb
    await before.focus();
    await pressTab(page);
    await expect(after).toBeFocused();

    // Read-only thumb is focusable but cannot be changed
    await gotoStory(page, 'components-slider--read-only');
    const readOnlyThumb = page.getByRole('slider', { name: 'Read-only slider' });
    await expect(readOnlyThumb).toHaveAttribute('aria-readonly', 'true');
    await expect(readOnlyThumb).toHaveAttribute('aria-valuenow', '65');

    await readOnlyThumb.focus();
    await expect(readOnlyThumb).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(readOnlyThumb).toHaveAttribute('aria-valuenow', '65');
  });

  test('associates label and description via Field', async ({ page }) => {
    await gotoStory(page, 'components-slider--with-field');

    const thumb = page.getByRole('slider', { name: 'Brightness' });
    await expect(thumb).toBeVisible();
    await expect(thumb).toHaveAttribute('aria-valuenow', '70');
    await expect(thumb).toHaveAttribute('aria-describedby', /.+/);
  });

  test('submits and resets value in native form', async ({ page }) => {
    await gotoStory(page, 'components-slider--with-form');

    const thumb = page.getByRole('slider', { name: 'Volume' });
    const submitButton = page.getByRole('button', { name: 'Submit' });
    const resetButton = page.getByRole('button', { name: 'Reset' });

    await thumb.focus();
    await page.keyboard.press('PageUp');
    await expect(thumb).toHaveAttribute('aria-valuenow', '45');

    await submitButton.click();
    await expect(page.getByText('Submitted: 45')).toBeVisible();

    await resetButton.click();
    await expect(thumb).toHaveAttribute('aria-valuenow', '35');
    await expect(page.getByText('Not submitted')).toBeVisible();
  });
});
