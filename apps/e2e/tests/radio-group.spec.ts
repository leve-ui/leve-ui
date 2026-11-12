import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('RadioGroup', () => {
  test('Tab で（選択なし）最初の Item にフォーカス', async ({ page }) => {
    await gotoStory(page, 'components-radiogroup--default');
    const before = page.getByRole('button', { name: 'Before' });
    await expect(before).toBeVisible({ timeout: 15_000 });
    await before.focus();
    await page.keyboard.press('Tab');

    const firstRadio = page.getByRole('radio', { name: 'Free' });
    await expect(firstRadio).toBeFocused();
    await expect(firstRadio).not.toBeChecked();
  });

  test('Tab でグループの外へ出る（1 つのタブストップ）', async ({ page }) => {
    await gotoStory(page, 'components-radiogroup--default');
    const before = page.getByRole('button', { name: 'Before' });
    await expect(before).toBeVisible({ timeout: 15_000 });
    await before.focus();

    // グループに入ると最初の項目にフォーカス
    await page.keyboard.press('Tab');
    await expect(page.getByRole('radio', { name: 'Free' })).toBeFocused();

    // 次の Tab でグループの外へ出る
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'After' })).toBeFocused();
  });

  test('Tab で選択中の Item にフォーカス', async ({ page }) => {
    await gotoStory(page, 'components-radiogroup--default-value');
    const before = page.getByRole('button', { name: 'Before' });
    await expect(before).toBeVisible({ timeout: 15_000 });
    await before.focus();
    await page.keyboard.press('Tab');

    const selectedRadio = page.getByRole('radio', { name: 'Starter' });
    await expect(selectedRadio).toBeFocused();
    await expect(selectedRadio).toBeChecked();
  });

  test('↓ で次へ移動して選択', async ({ page }) => {
    await gotoStory(page, 'components-radiogroup--default-value');
    const starter = page.getByRole('radio', { name: 'Starter' });
    const pro = page.getByRole('radio', { name: 'Pro' });
    await expect(starter).toBeVisible({ timeout: 15_000 });

    await starter.focus();
    await page.keyboard.press('ArrowDown');

    await expect(pro).toBeFocused();
    await expect(pro).toBeChecked();
    await expect(starter).not.toBeChecked();
  });

  test('→ で次へ移動して選択', async ({ page }) => {
    await gotoStory(page, 'components-radiogroup--default-value');
    const starter = page.getByRole('radio', { name: 'Starter' });
    const pro = page.getByRole('radio', { name: 'Pro' });
    await expect(starter).toBeVisible({ timeout: 15_000 });

    await starter.focus();
    await page.keyboard.press('ArrowRight');

    await expect(pro).toBeFocused();
    await expect(pro).toBeChecked();
    await expect(starter).not.toBeChecked();
  });

  test('↑ で前へ', async ({ page }) => {
    await gotoStory(page, 'components-radiogroup--default-value');
    const starter = page.getByRole('radio', { name: 'Starter' });
    const free = page.getByRole('radio', { name: 'Free' });
    await expect(starter).toBeVisible({ timeout: 15_000 });

    await starter.focus();
    await page.keyboard.press('ArrowUp');

    await expect(free).toBeFocused();
    await expect(free).toBeChecked();
    await expect(starter).not.toBeChecked();
  });

  test('← で前へ', async ({ page }) => {
    await gotoStory(page, 'components-radiogroup--default-value');
    const starter = page.getByRole('radio', { name: 'Starter' });
    const free = page.getByRole('radio', { name: 'Free' });
    await expect(starter).toBeVisible({ timeout: 15_000 });

    await starter.focus();
    await page.keyboard.press('ArrowLeft');

    await expect(free).toBeFocused();
    await expect(free).toBeChecked();
    await expect(starter).not.toBeChecked();
  });

  test('末尾で ↓ を押すと先頭へ循環（loop）', async ({ page }) => {
    await gotoStory(page, 'components-radiogroup--default-value');
    const pro = page.getByRole('radio', { name: 'Pro' });
    const free = page.getByRole('radio', { name: 'Free' });
    await expect(pro).toBeVisible({ timeout: 15_000 });

    await pro.focus();
    await page.keyboard.press('ArrowDown');

    await expect(free).toBeFocused();
    await expect(free).toBeChecked();
    await expect(pro).not.toBeChecked();
  });

  test('無効な Item を飛ばす', async ({ page }) => {
    await gotoStory(page, 'components-radiogroup--disabled-item');
    const standard = page.getByRole('radio', { name: /Standard/ });
    const express = page.getByRole('radio', { name: /Express/ });
    const overnight = page.getByRole('radio', { name: 'Overnight' });
    await expect(standard).toBeVisible({ timeout: 15_000 });

    await expect(express).toBeDisabled();
    await standard.focus();

    await page.keyboard.press('ArrowDown');
    await expect(overnight).toBeFocused();
    await expect(overnight).toBeChecked();
    await expect(standard).not.toBeChecked();
  });

  test('Space で選択', async ({ page }) => {
    await gotoStory(page, 'components-radiogroup--default');
    const starter = page.getByRole('radio', { name: 'Starter' });
    await expect(starter).toBeVisible({ timeout: 15_000 });

    await starter.focus();
    await expect(starter).not.toBeChecked();

    await page.keyboard.press('Space');
    await expect(starter).toBeChecked();
  });

  test('Enter では選択しない', async ({ page }) => {
    await gotoStory(page, 'components-radiogroup--default');
    const pro = page.getByRole('radio', { name: 'Pro' });
    await expect(pro).toBeVisible({ timeout: 15_000 });

    await pro.focus();
    await expect(pro).not.toBeChecked();

    await page.keyboard.press('Enter');
    await expect(pro).not.toBeChecked();
  });

  test('HiddenInput の値が連動する', async ({ page }) => {
    await gotoStory(page, 'components-radiogroup--with-form');
    const submit = page.getByRole('button', { name: 'Submit' });
    await expect(submit).toBeVisible({ timeout: 15_000 });
    const yearly = page.getByRole('radio', { name: /Yearly/ });
    const hiddenInput = page.locator('[data-leve-radio-group-hidden-input]');

    await expect(hiddenInput).toHaveValue('monthly');
    await yearly.click();
    await expect(hiddenInput).toHaveValue('yearly');

    await submit.click();
    await expect(page.getByTestId('submitted-value')).toHaveText('Submitted: yearly');
  });
});
