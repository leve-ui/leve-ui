import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('Field', () => {
  test('Label がアクセシブルネームになり、Description がアクセシブルな説明になる', async ({
    page,
  }) => {
    await gotoStory(page, 'components-field--default');

    const input = page.getByRole('textbox', { name: 'Email' });
    await expect(input).toBeVisible();
    await expect(input).toHaveAccessibleDescription("We'll never share your email.");
    await expect(input).not.toHaveAttribute('aria-invalid');
  });

  test('Label をクリックすると Input にフォーカスが移る', async ({ page }) => {
    await gotoStory(page, 'components-field--default');

    await page.getByText('Email', { exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeFocused();
  });

  test('入力を空にするとエラーメッセージが表示され、説明と aria-invalid に反映される', async ({
    page,
  }) => {
    await gotoStory(page, 'components-field--invalid');

    const input = page.getByRole('textbox', { name: 'Username' });
    await expect(input).toHaveValue('leve');
    await expect(page.locator('[data-leve-field-error-message]')).toHaveCount(0);
    await expect(input).not.toHaveAttribute('aria-invalid');

    await input.fill('');
    await expect(page.getByText('Username is required.')).toBeVisible();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('Username is required.');
  });

  test('値を入力し直すとエラーメッセージが消える', async ({ page }) => {
    await gotoStory(page, 'components-field--invalid');
    const input = page.getByRole('textbox', { name: 'Username' });

    await input.fill('');
    await expect(page.getByText('Username is required.')).toBeVisible();

    await input.pressSequentially('qwik');
    await expect(page.locator('[data-leve-field-error-message]')).toHaveCount(0);
    await expect(input).not.toHaveAttribute('aria-invalid');
    await expect(input).toHaveAccessibleDescription('');
  });

  test('required のときは Input が必須になる', async ({ page }) => {
    await gotoStory(page, 'components-field--required');

    const input = page.getByRole('textbox', { name: 'Full name' });
    await expect(input).toHaveAttribute('required', '');
  });

  test('disabled のときは Input が無効になる', async ({ page }) => {
    await gotoStory(page, 'components-field--disabled');

    await expect(page.getByRole('textbox', { name: 'Name' })).toBeDisabled();
  });

  test('disabled のときは Tab で Input を飛ばす', async ({ page }) => {
    await gotoStory(page, 'components-field--disabled');

    await page.getByRole('button', { name: 'Before' }).focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'After' })).toBeFocused();
  });

  test('Textarea にも Label と Description が関連付く', async ({ page }) => {
    await gotoStory(page, 'components-field--textarea');

    const textarea = page.getByRole('textbox', { name: 'Bio' });
    await expect(textarea).toHaveJSProperty('tagName', 'TEXTAREA');
    await expect(textarea).toHaveAccessibleDescription('Tell us about yourself.');

    await page.getByText('Bio', { exact: true }).click();
    await expect(textarea).toBeFocused();
  });
});
