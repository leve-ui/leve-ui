import { expect, test } from '@playwright/test';
import { pressTab } from './keyboard';
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
    await gotoStory(page, 'components-field--disabled', { focusGuards: true });

    await page.getByRole('button', { name: 'Before' }).focus();
    await pressTab(page);
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

  test('readOnly のときは編集不可だがフォーカスでき、readonly と data-readonly が付く', async ({
    page,
  }) => {
    await gotoStory(page, 'components-field--read-only', { focusGuards: true });

    const input = page.getByRole('textbox', { name: 'Email' });
    await expect(input).toBeEnabled();
    await expect(input).toHaveAttribute('readonly', '');
    await expect(input).toHaveAttribute('data-readonly', '');
    await expect(input).toHaveValue('hello@leve-ui.dev');

    await page.getByRole('button', { name: 'Before' }).focus();
    await pressTab(page);
    await expect(input).toBeFocused();

    await input.pressSequentially('extra');
    await expect(input).toHaveValue('hello@leve-ui.dev');
  });

  test('Select にも Label と Description が関連付き、選択を変更できる', async ({ page }) => {
    await gotoStory(page, 'components-field--select');

    const select = page.getByRole('combobox', { name: 'Country' });
    await expect(select).toBeVisible();
    await expect(select).toHaveAccessibleDescription('Used for shipping and tax calculation.');

    await select.selectOption('jp');
    await expect(select).toHaveValue('jp');
  });

  test('RequiredIndicator は視覚的に表示されるが aria-hidden="true" でアクセシブルネームに含まれない', async ({
    page,
  }) => {
    await gotoStory(page, 'components-field--required');

    const indicator = page.locator('[data-leve-field-required-indicator]');
    await expect(indicator).toBeVisible();
    await expect(indicator).toHaveText('*');
    await expect(indicator).toHaveAttribute('aria-hidden', 'true');

    const input = page.getByRole('textbox', { name: 'Full name', exact: true });
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('required', '');
  });

  test('autoresize が有効な Textarea は複数行入力で高さが自動的に増える', async ({ page }) => {
    await gotoStory(page, 'components-field--autoresize');

    const textarea = page.getByRole('textbox', { name: 'Notes' });
    const initialHeight = await textarea.evaluate((el) => el.getBoundingClientRect().height);

    await textarea.fill('Line 1\nLine 2\nLine 3\nLine 4\nLine 5');
    await expect
      .poll(() => textarea.evaluate((el) => el.getBoundingClientRect().height))
      .toBeGreaterThan(initialHeight);
  });
});
