import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('TagsInput', () => {
  test('adds tags with Enter and delimiter, deletes individual tag, and clears all', async ({
    page,
  }) => {
    await gotoStory(page, 'components-tagsinput--default');

    const input = page.getByRole('textbox', { name: 'Frameworks' });
    const items = page.locator('[data-leve-tags-input-item]');

    await expect(items).toHaveCount(2);

    await input.focus();
    await input.fill('Vite');
    await page.keyboard.press('Enter');
    await expect(items).toHaveCount(3);
    await expect(items.nth(2)).toContainText('Vite');
    await expect(input).toHaveValue('');

    await input.pressSequentially('Vitest,');
    await expect(items).toHaveCount(4);
    await expect(items.nth(3)).toContainText('Vitest');
    await expect(input).toHaveValue('');

    // Delete individual tag and restore focus to Input
    await page.getByRole('button', { name: 'Delete tag Vite', exact: true }).click();
    await expect(items).toHaveCount(3);
    await expect(input).toBeFocused();

    // Clear all tags and restore focus to Input
    await page.getByRole('button', { name: 'Clear all tags' }).click();
    await expect(items).toHaveCount(0);
    await expect(page.getByRole('group')).toHaveAttribute('data-state', 'empty');
    await expect(input).toBeFocused();
  });

  test('supports Backspace, ArrowLeft/Right, Home/End, Delete, and Escape navigation', async ({
    page,
  }) => {
    await gotoStory(page, 'components-tagsinput--editable');

    const input = page.getByRole('textbox', { name: /Editable tags/ });
    const items = page.locator('[data-leve-tags-input-item]');
    await expect(items).toHaveCount(3);

    await input.focus();

    // First Backspace highlights last tag (index 2: gamma)
    await page.keyboard.press('Backspace');
    await expect(items.nth(2)).toHaveAttribute('data-state', 'active');

    // ArrowLeft moves to index 1 (beta)
    await page.keyboard.press('ArrowLeft');
    await expect(items.nth(1)).toHaveAttribute('data-state', 'active');
    await expect(items.nth(2)).toHaveAttribute('data-state', 'idle');

    // Home jumps to first tag (index 0: alpha)
    await page.keyboard.press('Home');
    await expect(items.nth(0)).toHaveAttribute('data-state', 'active');

    // End jumps to last tag (index 2: gamma)
    await page.keyboard.press('End');
    await expect(items.nth(2)).toHaveAttribute('data-state', 'active');

    // ArrowRight past last tag clears highlight
    await page.keyboard.press('ArrowRight');
    await expect(items.nth(2)).toHaveAttribute('data-state', 'idle');

    // Highlight again and Escape clears highlight
    await page.keyboard.press('ArrowLeft');
    await expect(items.nth(2)).toHaveAttribute('data-state', 'active');
    await page.keyboard.press('Escape');
    await expect(items.nth(2)).toHaveAttribute('data-state', 'idle');

    // Backspace twice removes last tag
    await page.keyboard.press('Backspace');
    await expect(items.nth(2)).toHaveAttribute('data-state', 'active');
    await page.keyboard.press('Backspace');
    await expect(items).toHaveCount(2);

    // Delete removes highlighted tag (index 1: beta)
    await expect(items.nth(1)).toHaveAttribute('data-state', 'active');
    await page.keyboard.press('Delete');
    await expect(items).toHaveCount(1);
    await expect(items.nth(0)).toContainText('alpha');
  });

  test('supports inline editing via double-click and F2/Enter, commit and cancel', async ({
    page,
  }) => {
    await gotoStory(page, 'components-tagsinput--editable');

    const input = page.getByRole('textbox', { name: /Editable tags/ });
    const items = page.locator('[data-leve-tags-input-item]');

    // Double-click first tag to edit and commit with Enter
    await items.nth(0).dblclick();
    const editAlpha = page.getByRole('textbox', { name: 'Edit tag alpha' });
    await expect(editAlpha).toBeVisible();
    await expect(editAlpha).toBeFocused();
    await editAlpha.fill('omega');
    await page.keyboard.press('Enter');
    await expect(items.nth(0)).toContainText('omega');
    await expect(input).toBeFocused();

    // Highlight second tag and press F2, then Escape to cancel
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(items.nth(1)).toHaveAttribute('data-state', 'active');
    await page.keyboard.press('F2');
    const editBeta = page.getByRole('textbox', { name: 'Edit tag beta' });
    await expect(editBeta).toBeVisible();
    await expect(editBeta).toBeFocused();
    await editBeta.fill('changed');
    await page.keyboard.press('Escape');
    await expect(items.nth(1)).toContainText('beta');
    await expect(input).toBeFocused();
  });

  test('enforces max, allowDuplicates, and addOnPaste', async ({ page }) => {
    await gotoStory(page, 'components-tagsinput--validation');

    const input = page.getByRole('textbox', { name: /Keywords/ });
    const items = page.locator('[data-leve-tags-input-item]');
    await expect(items).toHaveCount(2);

    await input.focus();
    // Duplicate ignored
    await input.fill('one');
    await page.keyboard.press('Enter');
    await expect(items).toHaveCount(2);
    await expect(input).toHaveValue('one');

    // Paste multiple tags (three, four, five) -> capped at max=4
    await input.fill('');
    await input.evaluate((el) => {
      const dt = new DataTransfer();
      dt.setData('text/plain', 'three, four, five');
      const event = new ClipboardEvent('paste', { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'clipboardData', { value: dt });
      el.dispatchEvent(event);
    });

    await expect(items).toHaveCount(4);
    await expect(items.nth(2)).toContainText('three');
    await expect(items.nth(3)).toContainText('four');
  });

  test('respects disabled and readOnly states', async ({ page }) => {
    await gotoStory(page, 'components-tagsinput--disabled');
    const disabledInput = page.getByRole('textbox', { name: 'Tags (disabled)' });
    await expect(disabledInput).toBeDisabled();

    await gotoStory(page, 'components-tagsinput--read-only');
    const readOnlyInput = page.getByRole('textbox', { name: 'Tags (read-only)' });
    await expect(readOnlyInput).not.toBeDisabled();
    await expect(readOnlyInput).toHaveAttribute('readonly', '');
    await readOnlyInput.focus();
    await expect(readOnlyInput).toBeFocused();
    await expect(page.locator('[data-leve-tags-input-item]')).toHaveCount(2);
  });

  test('submits FormData and resets tags on form reset', async ({ page }) => {
    await gotoStory(page, 'components-tagsinput--with-form');

    const input = page.getByRole('textbox', { name: 'Tags' });
    const items = page.locator('[data-leve-tags-input-item]');
    const output = page.locator('output');

    await input.focus();
    await input.fill('solid');
    await page.keyboard.press('Enter');
    await expect(items).toHaveCount(3);

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(output).toHaveText('Submitted: qwik,ui,solid');

    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(items).toHaveCount(2);
    await expect(items.nth(0)).toContainText('qwik');
    await expect(items.nth(1)).toContainText('ui');
  });
});
