import { expect, test } from '@playwright/test';
import { pressTab } from './keyboard';
import { gotoStory } from './story';

test.describe('NumberInput', () => {
  test('increments and decrements on trigger click and keeps focus on input', async ({ page }) => {
    await gotoStory(page, 'components-numberinput--default');

    const input = page.getByRole('spinbutton', { name: 'Quantity' });
    const inc = page.getByRole('button', { name: 'Increment quantity' });
    const dec = page.getByRole('button', { name: 'Decrement quantity' });

    await expect(input).toHaveValue('1');
    await expect(input).toHaveAttribute('aria-valuenow', '1');

    await input.focus();
    await expect(input).toBeFocused();

    await inc.click();
    await expect(input).toHaveValue('2');
    await expect(input).toHaveAttribute('aria-valuenow', '2');
    await expect(input).toBeFocused();

    await dec.click();
    await expect(input).toHaveValue('1');
    await expect(input).toHaveAttribute('aria-valuenow', '1');
    await expect(input).toBeFocused();
  });

  test('steps with ArrowUp and ArrowDown', async ({ page }) => {
    await gotoStory(page, 'components-numberinput--min-max-step');

    const input = page.getByRole('spinbutton', { name: 'Offset (-10 to 10)' });
    await input.focus();

    await page.keyboard.press('ArrowUp');
    await expect(input).toHaveValue('0.5');
    await expect(input).toHaveAttribute('aria-valuenow', '0.5');

    await page.keyboard.press('ArrowDown');
    await expect(input).toHaveValue('0');
    await expect(input).toHaveAttribute('aria-valuenow', '0');

    await page.keyboard.press('ArrowDown');
    await expect(input).toHaveValue('-0.5');
    await expect(input).toHaveAttribute('aria-valuenow', '-0.5');
  });

  test('steps by largeStep with PageUp and PageDown', async ({ page }) => {
    await gotoStory(page, 'components-numberinput--min-max-step');

    const input = page.getByRole('spinbutton', { name: 'Offset (-10 to 10)' });
    await input.focus();

    await page.keyboard.press('PageUp');
    await expect(input).toHaveValue('2');

    await page.keyboard.press('PageDown');
    await expect(input).toHaveValue('0');
    await page.keyboard.press('PageDown');
    await expect(input).toHaveValue('-2');
  });

  test('jumps to min and max with Home and End', async ({ page }) => {
    await gotoStory(page, 'components-numberinput--min-max-step');

    const input = page.getByRole('spinbutton', { name: 'Offset (-10 to 10)' });
    const inc = page.getByRole('button', { name: 'Increment by 0.5' });
    const dec = page.getByRole('button', { name: 'Decrement by 0.5' });

    await input.focus();

    await page.keyboard.press('End');
    await expect(input).toHaveValue('10');
    await expect(inc).toBeDisabled();

    await page.keyboard.press('Home');
    await expect(input).toHaveValue('-10');
    await expect(dec).toBeDisabled();
  });

  test('commits and formats on Enter and reverts invalid text on blur', async ({ page }) => {
    await gotoStory(page, 'components-numberinput--formatted');

    const input = page.getByRole('spinbutton', { name: 'Price' });
    await expect(input).toHaveValue('$1,250.00');
    await expect(input).toHaveAttribute('aria-valuetext', '$1,250.00');

    await input.fill('2000');
    await page.keyboard.press('Enter');
    await expect(input).toHaveValue('$2,000.00');
    await expect(input).toHaveAttribute('aria-valuenow', '2000');

    await input.fill('invalid');
    await input.blur();
    await expect(input).toHaveValue('$2,000.00');
    await expect(input).toHaveAttribute('aria-valuenow', '2000');
  });

  test('skips disabled input and triggers on Tab', async ({ page }) => {
    await gotoStory(page, 'components-numberinput--disabled', { focusGuards: true });

    const before = page.getByRole('button', { name: 'Before' });
    const after = page.getByRole('button', { name: 'After' });
    const input = page.getByRole('spinbutton', { name: 'Disabled quantity' });

    await expect(input).toBeDisabled();

    await before.focus();
    await expect(before).toBeFocused();

    await pressTab(page);
    await expect(after).toBeFocused();
  });

  test('prevents value changes when readOnly', async ({ page }) => {
    await gotoStory(page, 'components-numberinput--read-only');

    const input = page.getByRole('spinbutton', { name: 'Read-only value' });
    const inc = page.getByRole('button', { name: 'Increment' });

    await expect(input).toHaveAttribute('aria-readonly', 'true');
    await expect(inc).toBeDisabled();

    await input.focus();
    await page.keyboard.press('ArrowUp');
    await expect(input).toHaveValue('42');
  });

  test('associates Field.Label with the spinbutton input', async ({ page }) => {
    await gotoStory(page, 'components-numberinput--with-field');

    const label = page.getByText('Seat count');
    const input = page.getByRole('spinbutton', { name: /Seat count/ });

    await label.click();
    await expect(input).toBeFocused();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAttribute('aria-required', 'true');
  });

  test('submits and resets inside a form', async ({ page }) => {
    await gotoStory(page, 'components-numberinput--with-form');

    const input = page.getByRole('spinbutton', { name: 'Quantity' });
    const inc = page.getByRole('button', { name: 'Increment quantity' });
    const submit = page.getByRole('button', { name: 'Submit' });
    const reset = page.getByRole('button', { name: 'Reset' });
    const output = page.locator('output');

    await inc.click();
    await expect(input).toHaveValue('4');

    await submit.click();
    await expect(output).toContainText('Submitted: 4');

    await reset.click();
    await expect(input).toHaveValue('3');
  });
});
