import { expect, test } from '@playwright/test';
import { pressTab } from './keyboard';
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

  test('Enter で checked / unchecked が切り替わる', async ({ page }) => {
    await gotoStory(page, 'components-checkbox--default');
    const control = page.getByRole('checkbox', { name: 'Accept terms and conditions' });

    await control.focus();
    await page.keyboard.press('Enter');
    await expect(control).toBeChecked();
    await expect(control).toHaveAttribute('data-state', 'checked');

    await page.keyboard.press('Enter');
    await expect(control).not.toBeChecked();
    await expect(control).toHaveAttribute('data-state', 'unchecked');
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
    await pressTab(page, { shift: true });
    await expect(control).toBeFocused();

    await pressTab(page);
    await expect(submit).toBeFocused();
  });

  test('disabled はフォーカスできず切り替わらない', async ({ page }) => {
    await gotoStory(page, 'components-checkbox--disabled', { focusGuards: true });
    const control = page.getByRole('checkbox', { name: 'Disabled option' });

    await expect(control).toBeDisabled();
    await control.click({ force: true });
    await expect(control).not.toBeChecked();

    // Tab でフォーカスがスキップされることを確認
    await page.getByRole('button', { name: 'Before' }).focus();
    await pressTab(page);
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

  test('フォームの Reset でチェックボックスが初期状態に戻る', async ({ page }) => {
    await gotoStory(page, 'components-checkbox--with-form');
    const control = page.getByRole('checkbox', { name: 'Agree to marketing emails' });
    const hiddenInput = page.locator('[data-leve-checkbox-hidden-input]');
    const reset = page.getByRole('button', { name: 'Reset' });
    const submit = page.getByRole('button', { name: 'Submit' });
    const output = page.locator('output');

    await control.click();
    await expect(control).toBeChecked();
    await expect(hiddenInput).toBeChecked();

    await reset.click();
    await expect(control).not.toBeChecked();
    await expect(control).toHaveAttribute('data-state', 'unchecked');
    await expect(hiddenInput).not.toBeChecked();

    await submit.click();
    await expect(output).toHaveText('{}');
  });

  test.describe('Checkbox.Group', () => {
    test('初期値が反映され、クリック・Space・Enter で複数選択できる', async ({ page }) => {
      await gotoStory(page, 'components-checkbox--group');
      const qwik = page.getByRole('checkbox', { name: 'Qwik' });
      const react = page.getByRole('checkbox', { name: 'React' });
      const svelte = page.getByRole('checkbox', { name: 'Svelte' });
      const status = page.locator('.checkbox-group-status');

      await expect(qwik).toBeChecked();
      await expect(react).not.toBeChecked();
      await expect(svelte).not.toBeChecked();
      await expect(status).toHaveText('Selected: qwik');

      await react.focus();
      await page.keyboard.press('Space');
      await expect(react).toBeChecked();
      await expect(status).toHaveText('Selected: qwik, react');

      await react.focus();
      await page.keyboard.press('Enter');
      await expect(react).not.toBeChecked();
      await expect(status).toHaveText('Selected: qwik');
    });

    test('maxSelectedValues に達すると未選択の項目が disabled になり、解除すると再び選択できる', async ({
      page,
    }) => {
      await gotoStory(page, 'components-checkbox--group');
      const qwik = page.getByRole('checkbox', { name: 'Qwik' });
      const react = page.getByRole('checkbox', { name: 'React' });
      const svelte = page.getByRole('checkbox', { name: 'Svelte' });
      const status = page.locator('.checkbox-group-status');

      await react.click();
      await expect(react).toBeChecked();
      await expect(svelte).toBeDisabled();
      await expect(svelte).toHaveAttribute('data-disabled', '');

      await svelte.click({ force: true });
      await expect(svelte).not.toBeChecked();
      await expect(status).toHaveText('Selected: qwik, react');

      await qwik.click();
      await expect(qwik).not.toBeChecked();
      await expect(svelte).toBeEnabled();

      await svelte.click();
      await expect(svelte).toBeChecked();
      await expect(status).toHaveText('Selected: react, svelte');
    });
  });
});
