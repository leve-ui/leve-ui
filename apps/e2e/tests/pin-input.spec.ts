import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('PinInput', () => {
  test('typing digits advances focus and triggers onComplete$', async ({ page }) => {
    await gotoStory(page, 'components-pininput--controlled');

    const digit1 = page.getByRole('textbox', { name: 'Digit 1 of 4' });
    const digit2 = page.getByRole('textbox', { name: 'Digit 2 of 4' });
    const digit3 = page.getByRole('textbox', { name: 'Digit 3 of 4' });
    const digit4 = page.getByRole('textbox', { name: 'Digit 4 of 4' });

    await digit1.focus();
    await page.keyboard.press('1');
    await expect(digit1).toHaveValue('1');
    await expect(digit2).toBeFocused();

    await page.keyboard.press('2');
    await expect(digit2).toHaveValue('2');
    await expect(digit3).toBeFocused();

    await page.keyboard.press('3');
    await expect(digit3).toHaveValue('3');
    await expect(digit4).toBeFocused();

    await page.keyboard.press('4');
    await expect(digit4).toHaveValue('4');

    await expect(page.getByRole('group')).toHaveAttribute('data-state', 'complete');
    await expect(page.getByText('Completed: 1234')).toBeVisible();
  });

  test('rejects invalid characters in numeric mode and accepts letters in alphanumeric mode', async ({
    page,
  }) => {
    await gotoStory(page, 'components-pininput--default');
    const digit1 = page.getByRole('textbox', { name: 'Digit 1 of 4' });
    await digit1.focus();
    await page.keyboard.press('a');
    await expect(digit1).toHaveValue('');
    await expect(digit1).toBeFocused();

    await gotoStory(page, 'components-pininput--alphanumeric');
    const alpha1 = page.getByRole('textbox', { name: 'Digit 1 of 4' });
    const alpha2 = page.getByRole('textbox', { name: 'Digit 2 of 4' });
    await alpha1.focus();
    await page.keyboard.press('A');
    await expect(alpha1).toHaveValue('A');
    await expect(alpha2).toBeFocused();
  });

  test('Backspace clears current slot or moves back when empty', async ({ page }) => {
    await gotoStory(page, 'components-pininput--default');

    const digit1 = page.getByRole('textbox', { name: 'Digit 1 of 4' });
    const digit2 = page.getByRole('textbox', { name: 'Digit 2 of 4' });
    const digit3 = page.getByRole('textbox', { name: 'Digit 3 of 4' });

    await digit1.focus();
    await page.keyboard.press('1');
    await expect(digit2).toBeFocused();
    await page.keyboard.press('2');
    await expect(digit3).toBeFocused();

    // Empty slot: Backspace moves to digit2 and clears it
    await page.keyboard.press('Backspace');
    await expect(digit2).toBeFocused();
    await expect(digit2).toHaveValue('');

    // Non-empty slot: Backspace clears digit1 and keeps focus on digit1
    await page.keyboard.press('ArrowLeft');
    await expect(digit1).toBeFocused();
    await expect(digit1).toHaveValue('1');
    await page.keyboard.press('Backspace');
    await expect(digit1).toBeFocused();
    await expect(digit1).toHaveValue('');
  });

  test('Delete clears current slot without moving focus', async ({ page }) => {
    await gotoStory(page, 'components-pininput--default');

    const digit1 = page.getByRole('textbox', { name: 'Digit 1 of 4' });
    const digit2 = page.getByRole('textbox', { name: 'Digit 2 of 4' });
    await digit1.focus();
    await page.keyboard.press('7');
    await expect(digit2).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(digit1).toBeFocused();
    await expect(digit1).toHaveValue('7');

    await page.keyboard.press('Delete');
    await expect(digit1).toHaveValue('');
    await expect(digit1).toBeFocused();
  });

  test('ArrowLeft, ArrowRight, Home, and End navigate between inputs', async ({ page }) => {
    await gotoStory(page, 'components-pininput--default');

    const digit1 = page.getByRole('textbox', { name: 'Digit 1 of 4' });
    const digit2 = page.getByRole('textbox', { name: 'Digit 2 of 4' });
    const digit3 = page.getByRole('textbox', { name: 'Digit 3 of 4' });
    const digit4 = page.getByRole('textbox', { name: 'Digit 4 of 4' });

    await digit1.focus();
    await page.keyboard.press('ArrowRight');
    await expect(digit2).toBeFocused();

    await page.keyboard.press('End');
    await expect(digit4).toBeFocused();

    await page.keyboard.press('ArrowLeft');
    await expect(digit3).toBeFocused();

    await page.keyboard.press('Home');
    await expect(digit1).toBeFocused();
  });

  test('fills slots on the very first paste even if clipboardData clears synchronously after dispatch', async ({
    page,
  }) => {
    await gotoStory(page, 'components-pininput--default');

    const digit1 = page.getByRole('textbox', { name: 'Digit 1 of 4' });
    const digit2 = page.getByRole('textbox', { name: 'Digit 2 of 4' });
    const digit3 = page.getByRole('textbox', { name: 'Digit 3 of 4' });
    const digit4 = page.getByRole('textbox', { name: 'Digit 4 of 4' });

    await digit1.focus();
    await digit1.evaluate((el) => {
      let active = true;
      const realData = new DataTransfer();
      realData.setData('text/plain', '4321');
      const emptyData = new DataTransfer();
      const event = new ClipboardEvent('paste', { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'clipboardData', {
        get: () => (active ? realData : emptyData),
      });
      el.dispatchEvent(event);
      active = false;
    });

    await expect(digit1).toHaveValue('4');
    await expect(digit2).toHaveValue('3');
    await expect(digit3).toHaveValue('2');
    await expect(digit4).toHaveValue('1');
    await expect(digit4).toBeFocused();
    await expect(page.getByRole('group')).toHaveAttribute('data-state', 'complete');
  });

  test('paste filters invalid characters and fills slots', async ({ page }) => {
    await gotoStory(page, 'components-pininput--default');

    const digit1 = page.getByRole('textbox', { name: 'Digit 1 of 4' });
    const digit2 = page.getByRole('textbox', { name: 'Digit 2 of 4' });
    const digit3 = page.getByRole('textbox', { name: 'Digit 3 of 4' });
    const digit4 = page.getByRole('textbox', { name: 'Digit 4 of 4' });

    // Partial paste fills starting from current index and focuses next empty
    await digit1.focus();
    await digit1.evaluate((el) => {
      const data = new DataTransfer();
      data.setData('text/plain', 'a1b2c');
      const event = new ClipboardEvent('paste', { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'clipboardData', { value: data });
      el.dispatchEvent(event);
    });
    await expect(digit1).toHaveValue('1');
    await expect(digit2).toHaveValue('2');
    await expect(digit3).toBeFocused();

    // Full-length paste fills from index 0 even when pasted on digit2
    await digit2.focus();
    await digit2.evaluate((el) => {
      const data = new DataTransfer();
      data.setData('text/plain', '9876');
      const event = new ClipboardEvent('paste', { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'clipboardData', { value: data });
      el.dispatchEvent(event);
    });
    await expect(digit1).toHaveValue('9');
    await expect(digit2).toHaveValue('8');
    await expect(digit3).toHaveValue('7');
    await expect(digit4).toHaveValue('6');
    await expect(digit4).toBeFocused();
    await expect(page.getByRole('group')).toHaveAttribute('data-state', 'complete');
  });

  test('clicking Field.Label focuses the first input', async ({ page }) => {
    await gotoStory(page, 'components-pininput--with-field');

    await page.getByText('Security code').click();
    await expect(page.getByRole('textbox', { name: 'Digit 1 of 4' })).toBeFocused();
  });

  test('submits joined value and resets inputs on form reset', async ({ page }) => {
    await gotoStory(page, 'components-pininput--with-form');

    const digit1 = page.getByRole('textbox', { name: 'Digit 1 of 4' });
    const digit3 = page.getByRole('textbox', { name: 'Digit 3 of 4' });
    const digit4 = page.getByRole('textbox', { name: 'Digit 4 of 4' });

    await digit3.focus();
    await page.keyboard.press('3');
    await expect(digit4).toBeFocused();
    await page.keyboard.press('4');

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('output')).toHaveText('{"code":"1234"}');

    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(digit1).toHaveValue('1');
    await expect(digit3).toHaveValue('');
    await expect(digit4).toHaveValue('');
  });

  test('respects disabled and readOnly states', async ({ page }) => {
    await gotoStory(page, 'components-pininput--disabled');
    await expect(page.getByRole('textbox', { name: 'Digit 1 of 4' })).toBeDisabled();

    await gotoStory(page, 'components-pininput--read-only');
    const ro1 = page.getByRole('textbox', { name: 'Digit 1 of 4' });
    await expect(ro1).toHaveAttribute('readonly', '');
    await ro1.focus();
    await page.keyboard.press('9');
    await expect(ro1).toHaveValue('4');
  });
});
