import { expect, type Page, test } from '@playwright/test';
import { pressTab } from './keyboard';
import { gotoStory } from './story';

const setupDefault = async (page: Page) => {
  await gotoStory(page, 'components-listbox--default', { focusGuards: true });
  const listbox = page.getByRole('listbox', { name: 'Fruit' });
  await expect(listbox).toBeVisible({ timeout: 15_000 });
  const option = (name: string) => page.getByRole('option', { name, exact: true });
  const expectHighlighted = async (name: string) => {
    const id = await option(name).getAttribute('id');
    await expect(listbox).toHaveAttribute('aria-activedescendant', id ?? '');
    await expect(option(name)).toHaveAttribute('data-highlighted', '');
  };
  return { listbox, option, expectHighlighted };
};

test.describe('Listbox (Default)', () => {
  test('Tab でフォーカスが入り先頭項目をハイライトし、選択後は再フォーカスで選択項目をハイライトする', async ({
    page,
  }) => {
    const { listbox, option, expectHighlighted } = await setupDefault(page);
    const before = page.getByRole('button', { name: 'Before' });
    const after = page.getByRole('button', { name: 'After' });

    await before.focus();
    await pressTab(page);
    await expect(listbox).toBeFocused();
    await expectHighlighted('Apple');

    await page.keyboard.press('ArrowDown');
    await expectHighlighted('Apricot');
    await page.keyboard.press('Space');
    await expect(option('Apricot')).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByText('Selected: apricot')).toBeVisible();

    // Tabbing out clears the highlight
    await pressTab(page);
    await expect(after).toBeFocused();
    await expect(listbox).not.toHaveAttribute('aria-activedescendant', /.+/);
    await expect(option('Apricot')).not.toHaveAttribute('data-highlighted', '');

    // Tabbing back in highlights the selected option
    await pressTab(page, { shift: true });
    await expect(listbox).toBeFocused();
    await expectHighlighted('Apricot');
  });

  test('ArrowDown / ArrowUp / Home / End でハイライトが移動し、無効な項目をスキップする', async ({
    page,
  }) => {
    const { listbox, option, expectHighlighted } = await setupDefault(page);

    await listbox.focus();
    await expectHighlighted('Apple');

    await page.keyboard.press('ArrowDown');
    await expectHighlighted('Apricot');
    await page.keyboard.press('ArrowDown');
    await expectHighlighted('Banana');

    // Blueberry is disabled, so ArrowDown skips directly to Blackberry
    await expect(option('Blueberry')).toHaveAttribute('aria-disabled', 'true');
    await page.keyboard.press('ArrowDown');
    await expectHighlighted('Blackberry');

    await page.keyboard.press('ArrowUp');
    await expectHighlighted('Banana');

    // End jumps to last enabled option (Peach) and does not wrap when loop is false
    await page.keyboard.press('End');
    await expectHighlighted('Peach');
    await page.keyboard.press('ArrowDown');
    await expectHighlighted('Peach');

    // Home jumps back to first enabled option (Apple)
    await page.keyboard.press('Home');
    await expectHighlighted('Apple');
    await page.keyboard.press('ArrowUp');
    await expectHighlighted('Apple');
  });

  test('Space と Enter で項目を選択でき、無効項目はクリックでも選択できない', async ({ page }) => {
    const { listbox, option, expectHighlighted } = await setupDefault(page);

    await listbox.focus();
    await expectHighlighted('Apple');
    await page.keyboard.press('ArrowDown');
    await expectHighlighted('Apricot');
    await page.keyboard.press('Enter');
    await expect(option('Apricot')).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByText('Selected: apricot')).toBeVisible();

    await page.keyboard.press('End');
    await expectHighlighted('Peach');
    await page.keyboard.press('Space');
    await expect(option('Peach')).toHaveAttribute('aria-selected', 'true');
    await expect(option('Apricot')).toHaveAttribute('aria-selected', 'false');
    await expect(page.getByText('Selected: peach')).toBeVisible();

    // Playwright waits for aria-disabled elements to be enabled; force the click
    await option('Blueberry').click({ force: true });
    await expect(option('Blueberry')).toHaveAttribute('aria-selected', 'false');
    await expect(option('Peach')).toHaveAttribute('aria-selected', 'true');
    await expectHighlighted('Peach');
  });

  test('タイプアヘッドで一致する有効項目へハイライトが移動し、無効項目はスキップされる', async ({
    page,
  }) => {
    const { listbox, expectHighlighted } = await setupDefault(page);

    await listbox.focus();
    await expectHighlighted('Apple');

    // Repeated 'a' cycles between Apple and Apricot
    await page.keyboard.type('a');
    await expectHighlighted('Apricot');
    await page.keyboard.type('a');
    await expectHighlighted('Apple');

    // Wait for the 500ms typeahead buffer to reset before typing 'b'
    await page.waitForTimeout(550);

    // Typing 'b' highlights Banana; typing 'b' again skips disabled Blueberry to Blackberry
    await page.keyboard.type('b');
    await expectHighlighted('Banana');
    await page.keyboard.type('b');
    await expectHighlighted('Blackberry');
  });
});

test.describe('Listbox (Multiple)', () => {
  const setupMultiple = async (page: Page) => {
    await gotoStory(page, 'components-listbox--multiple');
    const listbox = page.getByRole('listbox', { name: 'Toppings' });
    await expect(listbox).toBeVisible({ timeout: 15_000 });
    const option = (name: string) => page.getByRole('option', { name, exact: true });
    return { listbox, option };
  };

  test('Space でトグルし、Shift+矢印と Shift+Home/End で範囲選択を拡張できる', async ({ page }) => {
    const { listbox, option } = await setupMultiple(page);
    await expect(listbox).toHaveAttribute('aria-multiselectable', 'true');

    await listbox.focus();
    await expect(option('Avocado')).toHaveAttribute('data-highlighted', '');
    await page.keyboard.press('Space');
    await expect(option('Avocado')).toHaveAttribute('aria-selected', 'true');

    // Shift+ArrowDown extends selection from Avocado through Bacon and Cheese
    await page.keyboard.press('Shift+ArrowDown');
    await page.keyboard.press('Shift+ArrowDown');
    await expect(option('Avocado')).toHaveAttribute('aria-selected', 'true');
    await expect(option('Bacon')).toHaveAttribute('aria-selected', 'true');
    await expect(option('Cheese')).toHaveAttribute('aria-selected', 'true');

    // Reversing with Shift+ArrowUp shrinks the range back
    await page.keyboard.press('Shift+ArrowUp');
    await expect(option('Cheese')).toHaveAttribute('aria-selected', 'false');
    await expect(option('Bacon')).toHaveAttribute('aria-selected', 'true');

    // Shift+End selects through Tomato while skipping disabled Truffle
    await page.keyboard.press('Shift+End');
    await expect(option('Tomato')).toHaveAttribute('aria-selected', 'true');
    await expect(option('Truffle')).toHaveAttribute('aria-selected', 'false');

    // Space toggles off Tomato, then Shift+Home selects all enabled back to Avocado
    await page.keyboard.press('Space');
    await expect(option('Tomato')).toHaveAttribute('aria-selected', 'false');
    await page.keyboard.press('Shift+Home');
    await expect(option('Avocado')).toHaveAttribute('aria-selected', 'true');
  });

  test('Ctrl+A と Cmd+A で有効な全項目を選択できる', async ({ page }) => {
    const { listbox, option } = await setupMultiple(page);

    await listbox.focus();
    await expect(option('Avocado')).toHaveAttribute('data-highlighted', '');
    await page.keyboard.press('Control+a');

    for (const name of ['Avocado', 'Bacon', 'Cheese', 'Lettuce', 'Onion', 'Tomato']) {
      await expect(option(name)).toHaveAttribute('aria-selected', 'true');
    }
    await expect(option('Truffle')).toHaveAttribute('aria-selected', 'false');

    // Toggle one off, then verify Meta+a also selects all enabled items
    await option('Onion').click();
    await expect(option('Onion')).toHaveAttribute('aria-selected', 'false');
    await page.keyboard.press('Meta+a');
    await expect(option('Onion')).toHaveAttribute('aria-selected', 'true');
  });
});

test.describe('Listbox (Grouped & Disabled)', () => {
  test('グループラベルが関連付けられ、loop で端から反対側へ移動し、複数語タイプアヘッドが動く', async ({
    page,
  }) => {
    await gotoStory(page, 'components-listbox--grouped');
    const listbox = page.getByRole('listbox', { name: 'Time zone' });
    await expect(listbox).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('group', { name: 'Europe' })).toBeVisible();

    const option = (name: string) => page.getByRole('option', { name, exact: true });
    await listbox.focus();
    const newYorkId = await option('New York').getAttribute('id');
    await expect(listbox).toHaveAttribute('aria-activedescendant', newYorkId ?? '');

    // Wrap from first (New York) to last (Singapore) and back
    await page.keyboard.press('ArrowUp');
    const singaporeId = await option('Singapore').getAttribute('id');
    await expect(listbox).toHaveAttribute('aria-activedescendant', singaporeId ?? '');

    await page.keyboard.press('ArrowDown');
    await expect(listbox).toHaveAttribute('aria-activedescendant', newYorkId ?? '');

    // Multi-word typeahead with buffered space: "los a" -> Los Angeles (space must not select it)
    await page.keyboard.type('los a');
    const laId = await option('Los Angeles').getAttribute('id');
    await expect(listbox).toHaveAttribute('aria-activedescendant', laId ?? '');
    await expect(option('Los Angeles')).toHaveAttribute('data-highlighted', '');
    await expect(option('Los Angeles')).toHaveAttribute('aria-selected', 'false');
  });

  test('disabled の Listbox は Tab でスキップされ、クリックやキー操作でも変わらない', async ({
    page,
  }) => {
    await gotoStory(page, 'components-listbox--disabled', { focusGuards: true });
    const listbox = page.getByRole('listbox', { name: 'Fruit (disabled)' });
    await expect(listbox).toBeVisible({ timeout: 15_000 });
    await expect(listbox).toHaveAttribute('aria-disabled', 'true');

    await page.getByRole('button', { name: 'Before' }).focus();
    await pressTab(page);
    await expect(page.getByRole('button', { name: 'After' })).toBeFocused();

    await page.getByRole('option', { name: 'Banana', exact: true }).click({ force: true });
    await expect(page.getByRole('option', { name: 'Apple', exact: true })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.getByRole('option', { name: 'Banana', exact: true })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });
});
