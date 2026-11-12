import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('Checkbox', () => {
  test('Space で checked になる', async ({ page }) => {
    await gotoStory(page, 'components-checkbox--default');
    const control = page.getByRole('checkbox', { name: 'Accept terms and conditions' });

    await control.focus();
    await page.keyboard.press('Space');
    await expect(control).toBeChecked();
    await expect(control).toHaveAttribute('data-state', 'checked');
  });

  test('Space をもう一度で unchecked', async ({ page }) => {
    await gotoStory(page, 'components-checkbox--default');
    const control = page.getByRole('checkbox', { name: 'Accept terms and conditions' });

    await control.focus();
    await page.keyboard.press('Space');
    await expect(control).toBeChecked();

    await page.keyboard.press('Space');
    await expect(control).not.toBeChecked();
    await expect(control).toHaveAttribute('data-state', 'unchecked');
  });

  test('Enter では変わらない', async ({ page }) => {
    await gotoStory(page, 'components-checkbox--default');
    const control = page.getByRole('checkbox', { name: 'Accept terms and conditions' });

    await control.focus();
    await page.keyboard.press('Enter');
    await expect(control).not.toBeChecked();
    await expect(control).toHaveAttribute('data-state', 'unchecked');

    // Checked 状態でも Enter で変わらないことを確認
    await gotoStory(page, 'components-checkbox--checked');
    const checkedControl = page.getByRole('checkbox', { name: 'Subscribe to newsletter' });
    await checkedControl.focus();
    await page.keyboard.press('Enter');
    await expect(checkedControl).toBeChecked();
    await expect(checkedControl).toHaveAttribute('data-state', 'checked');
  });

  test('indeterminate から Space で checked', async ({ page }) => {
    await gotoStory(page, 'components-checkbox--indeterminate');
    const parentControl = page.getByRole('checkbox', { name: 'Select all ingredients' });

    await parentControl.focus();
    await expect(parentControl).toHaveAttribute('aria-checked', 'mixed');
    await expect(parentControl).toHaveAttribute('data-state', 'indeterminate');

    await page.keyboard.press('Space');
    await expect(parentControl).toBeChecked();
    await expect(parentControl).toHaveAttribute('aria-checked', 'true');
    await expect(parentControl).toHaveAttribute('data-state', 'checked');
  });

  test('Label クリックで切り替わる', async ({ page }) => {
    await gotoStory(page, 'components-checkbox--default');
    const control = page.getByRole('checkbox', { name: 'Accept terms and conditions' });
    const label = page.getByText('Accept terms and conditions', { exact: true });

    await label.click();
    await expect(control).toBeChecked();
    await expect(control).toHaveAttribute('data-state', 'checked');

    await label.click();
    await expect(control).not.toBeChecked();
    await expect(control).toHaveAttribute('data-state', 'unchecked');
  });

  test('Tab で Control にフォーカスが入る', async ({ page }) => {
    await gotoStory(page, 'components-checkbox--with-form');
    const control = page.getByRole('checkbox', { name: 'Agree to marketing emails' });
    const submit = page.getByRole('button', { name: 'Submit' });

    await submit.focus();
    await page.keyboard.press('Shift+Tab');
    await expect(control).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(submit).toBeFocused();
  });

  test('disabled はフォーカスできず切り替わらない', async ({ page }) => {
    await gotoStory(page, 'components-checkbox--disabled');
    const control = page.getByRole('checkbox', { name: 'Disabled option' });

    await expect(control).toBeDisabled();
    await control.click({ force: true });
    await expect(control).not.toBeChecked();

    // Tab でフォーカスがスキップされることを確認
    await page.getByRole('button', { name: 'Before' }).focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'After' })).toBeFocused();
  });

  test('HiddenInput の checked が連動する', async ({ page }) => {
    await gotoStory(page, 'components-checkbox--with-form');
    const control = page.getByRole('checkbox', { name: 'Agree to marketing emails' });
    const hiddenInput = page.locator('[data-leve-checkbox-hidden-input]');
    const submit = page.getByRole('button', { name: 'Submit' });
    const output = page.locator('output');

    // 未チェック時は送信データに含まれない
    await submit.click();
    await expect(output).toHaveText('{}');

    // クリックでチェックされ、hiddenInput も checked になる
    await control.click();
    await expect(hiddenInput).toBeChecked();
    await submit.click();
    await expect(output).toHaveText('{"marketing":"subscribed"}');

    // もう一度クリックで未チェックに戻る
    await control.click();
    await expect(hiddenInput).not.toBeChecked();
    await submit.click();
    await expect(output).toHaveText('{}');
  });
});
