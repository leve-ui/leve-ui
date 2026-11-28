import { expect, type Page, test } from '@playwright/test';
import { pressTab } from './keyboard';
import { distance, gotoDocs, gotoStory } from './story';

const setup = async (page: Page) => {
  await gotoStory(page, 'components-select--default', { focusGuards: true });
  const trigger = page.getByRole('combobox', { name: 'Fruit' });
  await expect(trigger).toBeVisible({ timeout: 15_000 });
  const listbox = page.getByRole('listbox', { name: 'Fruit' });
  const option = (name: string) => page.getByRole('option', { name, exact: true });
  /** Checks that the trigger points to the option with aria-activedescendant */
  const expectHighlighted = async (name: string) => {
    const id = await option(name).getAttribute('id');
    await expect(trigger).toHaveAttribute('aria-activedescendant', id ?? '');
    await expect(option(name)).toHaveAttribute('data-highlighted', '');
  };
  return { trigger, listbox, option, expectHighlighted };
};

test.describe('Select', () => {
  test('Trigger のクリックで開閉する', async ({ page }) => {
    const { trigger, listbox, expectHighlighted } = await setup(page);

    await trigger.click();
    await expect(listbox).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expectHighlighted('Apple');

    await trigger.click();
    await expect(listbox).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).not.toHaveAttribute('aria-activedescendant', /.+/);
  });

  test('閉じているとき Enter / Space / ↓ / ↑ / Home / End で開き、適切に強調される', async ({
    page,
  }) => {
    const { trigger, listbox, option, expectHighlighted } = await setup(page);

    // Nothing selected yet: Enter / Space / ArrowDown / Home highlight the first enabled option
    for (const key of ['Enter', 'Space', 'ArrowDown', 'Home']) {
      await trigger.focus();
      await page.keyboard.press(key);
      await expect(listbox).toBeVisible();
      await expectHighlighted('Apple');
      await page.keyboard.press('Escape');
      await expect(listbox).toBeHidden();
    }

    // Nothing selected yet: ArrowUp / End highlight the last enabled option
    for (const key of ['ArrowUp', 'End']) {
      await trigger.focus();
      await page.keyboard.press(key);
      await expect(listbox).toBeVisible();
      await expectHighlighted('Peach');
      await page.keyboard.press('Escape');
      await expect(listbox).toBeHidden();
    }

    // With a selected option, Enter / Space / ArrowDown / ArrowUp highlight the selected option
    await trigger.click();
    await option('Cherry').click();
    await expect(page.getByText('Selected: cherry')).toBeVisible();

    for (const key of ['Enter', 'Space', 'ArrowDown', 'ArrowUp']) {
      await trigger.focus();
      await page.keyboard.press(key);
      await expect(listbox).toBeVisible();
      await expectHighlighted('Cherry');
      await page.keyboard.press('Escape');
      await expect(listbox).toBeHidden();
    }

    // Home / End still jump to the first / last enabled option
    await trigger.focus();
    await page.keyboard.press('Home');
    await expect(listbox).toBeVisible();
    await expectHighlighted('Apple');
    await page.keyboard.press('Escape');
    await expect(listbox).toBeHidden();

    await trigger.focus();
    await page.keyboard.press('End');
    await expect(listbox).toBeVisible();
    await expectHighlighted('Peach');
  });

  test('開いているとき ↓ / ↑ と Home / End で強調を移し、無効な項目を飛ばす', async ({ page }) => {
    const { trigger, expectHighlighted } = await setup(page);

    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expectHighlighted('Apple');

    await page.keyboard.press('End');
    await expectHighlighted('Peach');

    await page.keyboard.press('ArrowUp');
    await expectHighlighted('Orange');

    // Lemon is disabled
    await page.keyboard.press('ArrowUp');
    await expectHighlighted('Grape');

    await page.keyboard.press('ArrowDown');
    await expectHighlighted('Orange');

    await page.keyboard.press('Home');
    await expectHighlighted('Apple');
  });

  test('Enter と Space で強調中の項目を選び、閉じて Trigger にフォーカスを保つ', async ({
    page,
  }) => {
    const { trigger, listbox, expectHighlighted } = await setup(page);

    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(listbox).toBeVisible();
    await expectHighlighted('Apple');
    await page.keyboard.press('ArrowDown');
    await expectHighlighted('Banana');
    await page.keyboard.press('Enter');
    await expect(listbox).toBeHidden();
    await expect(trigger).toContainText('Banana');
    await expect(page.getByText('Selected: banana')).toBeVisible();
    await expect(trigger).toBeFocused();

    await page.keyboard.press('Space');
    await expect(listbox).toBeVisible();
    await expectHighlighted('Banana');
    await page.keyboard.press('ArrowDown');
    await expectHighlighted('Blueberry');
    await page.keyboard.press('Space');
    await expect(listbox).toBeHidden();
    await expect(trigger).toContainText('Blueberry');
    await expect(page.getByText('Selected: blueberry')).toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test('クリックで選び、無効な項目は選べない', async ({ page }) => {
    const { trigger, listbox, option } = await setup(page);

    await trigger.click();
    // Playwright waits for aria-disabled options to be enabled unless forced
    await option('Lemon').click({ force: true });
    await expect(listbox).toBeVisible();
    await expect(page.getByText('Selected: none')).toBeVisible();

    await option('Cherry').click();
    await expect(listbox).toBeHidden();
    await expect(trigger).toContainText('Cherry');
    await expect(page.getByText('Selected: cherry')).toBeVisible();

    await trigger.click();
    await expect(option('Cherry')).toHaveAttribute('aria-selected', 'true');
  });

  test('Escape で値を変えずに閉じ、Trigger にフォーカスを保つ', async ({ page }) => {
    const { trigger, listbox, option, expectHighlighted } = await setup(page);

    await trigger.click();
    await option('Apple').click();
    await expect(page.getByText('Selected: apple')).toBeVisible();

    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(listbox).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await expectHighlighted('Banana');

    await page.keyboard.press('Escape');
    await expect(listbox).toBeHidden();
    await expect(trigger).toContainText('Apple');
    await expect(page.getByText('Selected: apple')).toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test('Tab で閉じてフォーカスが自然に移動する', async ({ page }) => {
    const { trigger, listbox } = await setup(page);

    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(listbox).toBeVisible();

    await pressTab(page);
    await expect(listbox).toBeHidden();
    await expect(page.getByRole('button', { name: 'After' })).toBeFocused();
  });

  test('外側のクリックで閉じる', async ({ page }) => {
    const { trigger, listbox } = await setup(page);

    await trigger.click();
    await expect(listbox).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(listbox).toBeHidden();
  });

  test('閉じた状態と開いた状態の両方でタイプアヘッドが動作する', async ({ page }) => {
    const { trigger, listbox, expectHighlighted } = await setup(page);

    // Closed: typing opens the listbox and highlights the matching option
    await trigger.focus();
    await page.keyboard.press('b');
    await expect(listbox).toBeVisible();
    await expectHighlighted('Banana');

    // Open: continuing to type refines the match
    await page.keyboard.press('l');
    await expectHighlighted('Blueberry');

    await page.keyboard.press('Enter');
    await expect(listbox).toBeHidden();
    await expect(page.getByText('Selected: blueberry')).toBeVisible();

    // Open: repeating the same character cycles matches
    await page.keyboard.press('ArrowDown');
    await expect(listbox).toBeVisible();
    await expectHighlighted('Blueberry');
    await page.keyboard.press('Home');
    await expectHighlighted('Apple');
    await page.keyboard.press('b');
    await expectHighlighted('Banana');
    await page.keyboard.press('b');
    await expectHighlighted('Blueberry');
  });
});

test.describe('Select（グループと loop）', () => {
  test('グループに名前が付き、loop で端から反対側へ回る', async ({ page }) => {
    await gotoStory(page, 'components-select--grouped');
    const trigger = page.getByRole('combobox', { name: 'Time zone' });
    await expect(trigger).toBeVisible({ timeout: 15_000 });
    const option = (name: string) => page.getByRole('option', { name, exact: true });

    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('group', { name: 'Europe' })).toBeVisible();

    const firstId = await option('New York').getAttribute('id');
    await expect(trigger).toHaveAttribute('aria-activedescendant', firstId ?? '');

    await page.keyboard.press('ArrowUp');
    const lastId = await option('Singapore').getAttribute('id');
    await expect(trigger).toHaveAttribute('aria-activedescendant', lastId ?? '');

    await page.keyboard.press('ArrowDown');
    await expect(trigger).toHaveAttribute('aria-activedescendant', firstId ?? '');
  });
});

test.describe('Select（disabled）', () => {
  test('無効状態のときは開かない', async ({ page }) => {
    await gotoStory(page, 'components-select--disabled');
    const trigger = page.getByRole('combobox', { name: 'Plan' });
    await expect(trigger).toBeVisible({ timeout: 15_000 });
    await expect(trigger).toBeDisabled();
    await expect(trigger).toContainText('Starter');

    await trigger.click({ force: true });
    await expect(page.getByRole('listbox')).toBeHidden();
  });
});

test.describe('Select（Field 連携）', () => {
  test('Field のラベル・説明文・必須・エラー表示とフォーム送信が連携する', async ({ page }) => {
    await gotoStory(page, 'components-select--field');
    const trigger = page.getByRole('combobox', { name: 'Country' });
    await expect(trigger).toBeVisible({ timeout: 15_000 });
    await expect(trigger).toHaveAttribute('aria-required', 'true');
    await expect(trigger).toHaveAccessibleDescription('Used for shipping and tax calculation.');

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Please select a country.')).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-invalid', 'true');

    await trigger.click();
    await page.getByRole('option', { name: 'Japan' }).click();
    await expect(page.getByText('Please select a country.')).toBeHidden();
    await expect(trigger).not.toHaveAttribute('aria-invalid', 'true');

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Submitted: jp')).toBeVisible();
  });
});

test('複数の Qwik コンテナがあるページでも、Trigger の下に開く（#167）', async ({ page }) => {
  await gotoDocs(page, 'select');
  const trigger = page.getByRole('combobox', { name: 'Fruit' }).last();
  await expect(trigger).toBeVisible({ timeout: 15_000 });
  await trigger.scrollIntoViewIfNeeded();
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  const listbox = page.locator('[data-leve-select-content]').filter({ visible: true });
  await expect(listbox).toHaveCount(1);
  const [triggerBox, listBox] = await Promise.all([trigger.boundingBox(), listbox.boundingBox()]);
  if (!triggerBox || !listBox) throw new Error('Not visible');
  expect(distance(triggerBox, listBox)).toBeLessThan(20);
  await expect(trigger).toBeFocused();
});
