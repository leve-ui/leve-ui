import { expect, test } from '@playwright/test';
import { pressTab } from './keyboard';
import { gotoStory } from './story';

test.describe('Editable', () => {
  test('enters edit mode on focus and commits on Enter', async ({ page }) => {
    await gotoStory(page, 'components-editable--default', { focusGuards: true });

    const before = page.getByRole('button', { name: 'Before' });
    await before.focus();
    await pressTab(page);

    const input = page.getByRole('textbox', { name: 'Project title' });
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();

    await input.fill('Updated title');
    await page.keyboard.press('Enter');

    await expect(input).toBeHidden();
    const preview = page.locator('[data-leve-editable-preview]');
    await expect(preview).toBeVisible();
    await expect(preview).toHaveText('Updated title');
    await expect(page.getByRole('button', { name: 'Edit' })).toBeFocused();
  });

  test('reverts draft value and exits edit mode on Escape', async ({ page }) => {
    await gotoStory(page, 'components-editable--default');

    await page.getByRole('button', { name: 'Edit' }).click();
    const input = page.getByRole('textbox', { name: 'Project title' });
    await expect(input).toBeFocused();

    await input.fill('Temporary text');
    await page.keyboard.press('Escape');

    await expect(input).toBeHidden();
    await expect(page.locator('[data-leve-editable-preview]')).toHaveText('Click or focus to edit');
    await expect(page.getByRole('button', { name: 'Edit' })).toBeFocused();
  });

  test('commits on SubmitTrigger click and reverts on CancelTrigger click without blur-commit race', async ({
    page,
  }) => {
    await gotoStory(page, 'components-editable--default');

    await page.getByRole('button', { name: 'Edit' }).click();
    const input = page.getByRole('textbox', { name: 'Project title' });
    await input.fill('Should be cancelled');
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(input).toBeHidden();
    await expect(page.locator('[data-leve-editable-preview]')).toHaveText('Click or focus to edit');

    await page.getByRole('button', { name: 'Edit' }).click();
    await input.fill('Saved via button');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(input).toBeHidden();
    await expect(page.locator('[data-leve-editable-preview]')).toHaveText('Saved via button');
  });

  test('commits on blur when focus moves outside', async ({ page }) => {
    await gotoStory(page, 'components-editable--default', { focusGuards: true });

    await page.getByRole('button', { name: 'Edit' }).click();
    const input = page.getByRole('textbox', { name: 'Project title' });
    await input.fill('Committed on blur');

    await page.getByRole('button', { name: 'After' }).focus();

    await expect(input).toBeHidden();
    await expect(page.locator('[data-leve-editable-preview]')).toHaveText('Committed on blur');
  });

  test('supports controlled bind:value and bind:edit', async ({ page }) => {
    await gotoStory(page, 'components-editable--controlled');

    await page.getByRole('button', { name: /Toggle edit/ }).click();
    const input = page.getByRole('textbox', { name: 'Display name' });
    await expect(input).toBeVisible();

    await input.fill('New controlled name');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(input).toBeHidden();
    await expect(page.locator('.editable-controlled-status')).toHaveText(
      'Committed: New controlled name',
    );
  });

  test('requires double click when activationMode is dblclick', async ({ page }) => {
    await gotoStory(page, 'components-editable--double-click');

    const preview = page.locator('[data-leve-editable-preview]');
    const input = page.getByRole('textbox', { name: 'Document name' });

    await preview.click();
    await expect(input).toBeHidden();

    await preview.dblclick();
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();
  });

  test('inserts newline on Enter and commits on Ctrl+Enter in multiline mode', async ({ page }) => {
    await gotoStory(page, 'components-editable--multiline');

    await page.getByRole('button', { name: 'Edit' }).click();
    const textarea = page.getByRole('textbox', { name: 'Notes' });
    await expect(textarea).toBeFocused();

    await textarea.fill('Line one');
    await page.keyboard.press('Enter');
    await page.keyboard.type('Line two');
    await expect(textarea).toBeVisible();

    await page.keyboard.press('Control+Enter');
    await expect(textarea).toBeHidden();
    await expect(page.locator('[data-leve-editable-preview]')).toContainText('Line one');
    await expect(page.locator('[data-leve-editable-preview]')).toContainText('Line two');
  });

  test('prevents editing when disabled or readOnly', async ({ page }) => {
    await gotoStory(page, 'components-editable--disabled');
    await expect(page.getByRole('button', { name: 'Edit' })).toBeDisabled();
    await page.locator('[data-leve-editable-preview]').click();
    await expect(page.locator('[data-leve-editable-input]')).toBeHidden();

    await gotoStory(page, 'components-editable--read-only');
    await expect(page.getByRole('button', { name: 'Edit' })).toBeDisabled();
    await page.locator('[data-leve-editable-preview]').click();
    await expect(page.locator('[data-leve-editable-input]')).toBeHidden();
  });

  test('integrates with Field label, description, and error message', async ({ page }) => {
    await gotoStory(page, 'components-editable--with-field');

    const preview = page.locator('[data-leve-editable-preview]');
    await expect(preview).toHaveAttribute('data-invalid', '');

    await page.getByRole('button', { name: 'Edit' }).click();
    const input = page.getByRole('textbox', { name: 'Display name' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAttribute('aria-describedby', /.+/);

    await input.fill('Alice');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(preview).not.toHaveAttribute('data-invalid', '');
  });
});
