import { expect, type Page, test } from '@playwright/test';
import { gotoStory } from './story';

const setup = async (page: Page) => {
  await gotoStory(page, 'components-combobox--default', { focusGuards: true });
  const input = page.getByRole('combobox', { name: 'Fruit' });
  await expect(input).toBeVisible({ timeout: 15_000 });
  const listbox = page.getByRole('listbox', { name: 'Fruit' });
  const option = (name: string) => page.getByRole('option', { name, exact: true });
  /** Checks that the input points to the option with aria-activedescendant */
  const expectHighlighted = async (name: string) => {
    const id = await option(name).getAttribute('id');
    await expect(input).toHaveAttribute('aria-activedescendant', id ?? '');
    await expect(option(name)).toHaveAttribute('data-highlighted', '');
  };
  return { input, listbox, option, expectHighlighted };
};

test.describe('Combobox', () => {
  test('入力すると開き、候補が絞り込まれる', async ({ page }) => {
    const { input, listbox, option } = await setup(page);

    await input.focus();
    await page.keyboard.type('an');
    await expect(listbox).toBeVisible();
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await expect(option('Banana')).toBeVisible();
    await expect(option('Orange')).toBeVisible();
    await expect(page.getByRole('option')).toHaveCount(2);
    await expect(input).toBeFocused();
  });

  test('↓ で開いて最初の項目を強調し、フォーカスは Input に残る', async ({ page }) => {
    const { input, listbox, expectHighlighted } = await setup(page);

    await input.focus();
    await page.keyboard.press('ArrowDown');
    await expect(listbox).toBeVisible();
    await expectHighlighted('Apple');
    await expect(input).toBeFocused();
  });

  test('↑ で開いて最後の項目を強調する', async ({ page }) => {
    const { input, expectHighlighted } = await setup(page);

    await input.focus();
    await page.keyboard.press('ArrowUp');
    await expectHighlighted('Peach');
  });

  test('↓ / ↑ で強調を移し、無効な項目を飛ばす', async ({ page }) => {
    const { input, expectHighlighted } = await setup(page);

    await input.focus();
    await page.keyboard.press('ArrowUp');
    await expectHighlighted('Peach');
    await page.keyboard.press('ArrowUp');
    await expectHighlighted('Orange');
    // Lemon is disabled
    await page.keyboard.press('ArrowUp');
    await expectHighlighted('Grape');
    await page.keyboard.press('ArrowDown');
    await expectHighlighted('Orange');
  });

  test('Enter で強調中の項目を選び、文字列を入れて閉じる', async ({ page }) => {
    const { input, listbox, option, expectHighlighted } = await setup(page);

    await input.focus();
    await page.keyboard.type('che');
    await expect(page.getByRole('option')).toHaveCount(1);
    await page.keyboard.press('ArrowDown');
    await expectHighlighted('Cherry');
    await page.keyboard.press('Enter');
    await expect(listbox).toBeHidden();
    await expect(input).toHaveValue('Cherry');
    await expect(input).not.toHaveAttribute('aria-activedescendant', /.+/);
    await expect(page.getByText('Selected: cherry')).toBeVisible();

    // The selected option is marked when it opens again
    await page.keyboard.press('Alt+ArrowDown');
    await expect(option('Cherry')).toHaveAttribute('aria-selected', 'true');
  });

  test('Escape で閉じ、閉じているときの Escape で入力と選択を消す', async ({ page }) => {
    const { input, listbox, expectHighlighted } = await setup(page);

    await input.focus();
    await page.keyboard.type('gr');
    await expect(page.getByRole('option')).toHaveCount(1);
    await page.keyboard.press('ArrowDown');
    await expectHighlighted('Grape');
    await page.keyboard.press('Enter');
    await expect(page.getByText('Selected: grape')).toBeVisible();

    await page.keyboard.press('ArrowDown');
    await expect(listbox).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(listbox).toBeHidden();
    await expect(input).toHaveValue('Grape');
    await page.keyboard.press('Escape');
    await expect(input).toHaveValue('');
    await expect(page.getByText('Selected: none')).toBeVisible();
  });

  test('Alt+↓ は強調せずに開き、Alt+↑ で閉じる', async ({ page }) => {
    const { input, listbox } = await setup(page);

    await input.focus();
    await page.keyboard.press('Alt+ArrowDown');
    await expect(listbox).toBeVisible();
    await expect(input).not.toHaveAttribute('aria-activedescendant', /.+/);
    await page.keyboard.press('Alt+ArrowUp');
    await expect(listbox).toBeHidden();
  });

  test('ポインタで強調し、クリックで選ぶ。フォーカスは Input に残る', async ({ page }) => {
    const { input, listbox, option, expectHighlighted } = await setup(page);

    await input.focus();
    await page.keyboard.press('Alt+ArrowDown');
    await option('Blueberry').hover();
    await expectHighlighted('Blueberry');
    await option('Blueberry').click();
    await expect(listbox).toBeHidden();
    await expect(input).toHaveValue('Blueberry');
    await expect(input).toBeFocused();
  });

  test('Trigger で開閉し、Input にフォーカスする', async ({ page }) => {
    const { input, listbox } = await setup(page);
    const trigger = page.getByRole('button', { name: 'Show fruits' });

    await trigger.click();
    await expect(listbox).toBeVisible();
    await expect(input).toBeFocused();
    await trigger.click();
    await expect(listbox).toBeHidden();
  });

  test('フォーカスが外れると閉じ、Input を選択中の文字列に戻す', async ({ page }) => {
    const { input, listbox, expectHighlighted } = await setup(page);

    await input.focus();
    await page.keyboard.type('pea');
    await expect(page.getByRole('option')).toHaveCount(1);
    await page.keyboard.press('ArrowDown');
    await expectHighlighted('Peach');
    await page.keyboard.press('Enter');
    await expect(input).toHaveValue('Peach');

    await page.keyboard.type('xyz');
    await expect(input).toHaveValue('Peachxyz');
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Tab');
    await expect(listbox).toBeHidden();
    await expect(input).toHaveValue('Peach');
    await expect(page.getByText('Selected: peach')).toBeVisible();
  });

  test('候補がないときは Empty が表示される', async ({ page }) => {
    const { input } = await setup(page);

    await input.focus();
    await page.keyboard.type('xyz');
    await expect(page.getByText('No fruits found')).toBeVisible();
    await expect(page.getByRole('option')).toHaveCount(0);
    await expect(input).not.toHaveAttribute('aria-activedescendant', /.+/);
  });

  test('外側のクリックで閉じる', async ({ page }) => {
    const { input, listbox } = await setup(page);

    await input.focus();
    await page.keyboard.press('ArrowDown');
    await expect(listbox).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(listbox).toBeHidden();
  });
});

test.describe('Combobox（グループと autoHighlight）', () => {
  const setup = async (page: Page) => {
    await gotoStory(page, 'components-combobox--grouped');
    const input = page.getByRole('combobox', { name: 'Time zone' });
    await expect(input).toBeVisible({ timeout: 15_000 });
    const option = (name: string) => page.getByRole('option', { name, exact: true });
    return { input, option };
  };

  test('入力すると最初の候補を強調し、Enter で選べる', async ({ page }) => {
    const { input, option } = await setup(page);

    await input.focus();
    await page.keyboard.type('o');
    const id = await option('New York').getAttribute('id');
    await expect(input).toHaveAttribute('aria-activedescendant', id ?? '');
    await page.keyboard.type('k');
    const tokyo = await option('Tokyo').getAttribute('id');
    await expect(input).toHaveAttribute('aria-activedescendant', tokyo ?? '');
    await page.keyboard.press('Enter');
    await expect(input).toHaveValue('Tokyo');
  });

  test('グループに名前が付き、loop で端から反対側へ回る', async ({ page }) => {
    const { input, option } = await setup(page);

    await input.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('group', { name: 'Europe' })).toBeVisible();
    await page.keyboard.press('ArrowUp');
    const last = await option('Singapore').getAttribute('id');
    await expect(input).toHaveAttribute('aria-activedescendant', last ?? '');
  });
});
