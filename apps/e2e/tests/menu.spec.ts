import { expect, type Page, test } from '@playwright/test';
import { gotoStory } from './story';

const setup = async (page: Page) => {
  await gotoStory(page, 'components-menu--default', { focusGuards: true });
  const trigger = page.getByRole('button', { name: 'Actions' });
  await expect(trigger).toBeVisible({ timeout: 15_000 });
  const menu = page.getByRole('menu', { name: 'Actions' });
  const item = (name: string) => page.getByRole('menuitem', { name });
  return { trigger, menu, item };
};

test.describe('Menu', () => {
  test('クリックで開き、最初の項目にフォーカスする', async ({ page }) => {
    const { trigger, menu, item } = await setup(page);

    await trigger.click();
    await expect(menu).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(item('New file ⌘N')).toBeFocused();
  });

  test('Enter / Space / ↓ で開き、最初の項目にフォーカスする', async ({ page }) => {
    const { trigger, menu, item } = await setup(page);

    for (const key of ['Enter', 'Space', 'ArrowDown']) {
      await trigger.focus();
      await page.keyboard.press(key);
      await expect(menu).toBeVisible();
      await expect(item('New file ⌘N')).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(menu).toBeHidden();
    }
  });

  test('↑ で開き、最後の項目にフォーカスする', async ({ page }) => {
    const { trigger, item } = await setup(page);

    await trigger.focus();
    await page.keyboard.press('ArrowUp');
    await expect(item('Email')).toBeFocused();
  });

  test('↓ / ↑ で移動し、無効な項目を飛ばす', async ({ page }) => {
    const { trigger, item } = await setup(page);

    await trigger.click();
    await expect(item('New file ⌘N')).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(item('Duplicate ⌘D')).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(item('Copy link')).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(item('Duplicate ⌘D')).toBeFocused();
  });

  test('Home / End で最初と最後の項目へ移動する', async ({ page }) => {
    const { trigger, item } = await setup(page);

    await trigger.click();
    await expect(item('New file ⌘N')).toBeFocused();
    await page.keyboard.press('End');
    await expect(item('Email')).toBeFocused();
    await page.keyboard.press('Home');
    await expect(item('New file ⌘N')).toBeFocused();
  });

  test('文字キーでその文字で始まる項目へ移動する（タイプアヘッド）', async ({ page }) => {
    const { trigger, item } = await setup(page);

    await trigger.click();
    await expect(item('New file ⌘N')).toBeFocused();
    await page.keyboard.press('e');
    await expect(item('Email')).toBeFocused();
  });

  test('Enter で選ぶと閉じ、Trigger にフォーカスが戻る', async ({ page }) => {
    const { trigger, menu, item } = await setup(page);

    await trigger.click();
    await expect(item('New file ⌘N')).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(item('Duplicate ⌘D')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(page.getByText('Last action: Duplicate')).toBeVisible();
  });

  test('クリックで選ぶ。無効な項目は選べない', async ({ page }) => {
    const { trigger, menu, item } = await setup(page);

    await trigger.click();
    // Playwright waits for aria-disabled elements to be enabled; force the click
    await item('Paste ⌘V').click({ force: true });
    await expect(menu).toBeVisible();
    await item('Copy link').click();
    await expect(menu).toBeHidden();
    await expect(page.getByText('Last action: Copy link')).toBeVisible();
  });

  test('Escape で閉じ、Trigger にフォーカスが戻る', async ({ page }) => {
    const { trigger, menu, item } = await setup(page);

    await trigger.click();
    await expect(item('New file ⌘N')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('外側のクリックで閉じる', async ({ page }) => {
    const { trigger, menu } = await setup(page);

    await trigger.click();
    await expect(menu).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(menu).toBeHidden();
  });

  test('グループは GroupLabel で名前が付く', async ({ page }) => {
    const { trigger } = await setup(page);

    await trigger.click();
    await expect(page.getByRole('group', { name: 'Share' })).toBeVisible();
  });
});

test.describe('Menu（チェックとラジオ）', () => {
  const setup = async (page: Page) => {
    await gotoStory(page, 'components-menu--checkable');
    const trigger = page.getByRole('button', { name: 'View' });
    await expect(trigger).toBeVisible({ timeout: 15_000 });
    return { trigger, menu: page.getByRole('menu', { name: 'View' }) };
  };

  test('Space で切り替え、メニューは閉じない', async ({ page }) => {
    const { trigger, menu } = await setup(page);
    const grid = page.getByRole('menuitemcheckbox', { name: 'Show grid' });

    await trigger.click();
    await expect(grid).toBeFocused();
    await expect(grid).toHaveAttribute('aria-checked', 'true');
    await page.keyboard.press('Space');
    await expect(grid).toHaveAttribute('aria-checked', 'false');
    await expect(menu).toBeVisible();
    await expect(page.getByText('Grid: off, zoom: 100%')).toBeVisible();
  });

  test('Enter で切り替え、メニューを閉じる', async ({ page }) => {
    const { trigger, menu } = await setup(page);
    const rulers = page.getByRole('menuitemcheckbox', { name: 'Show rulers' });

    await trigger.click();
    await expect(page.getByRole('menuitemcheckbox', { name: 'Show grid' })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(rulers).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await expect(rulers).toHaveAttribute('aria-checked', 'true');
  });

  test('ラジオの項目は 1 つだけ選ばれる', async ({ page }) => {
    const { trigger } = await setup(page);
    const radio = (name: string) => page.getByRole('menuitemradio', { name });

    await trigger.click();
    await expect(radio('100%')).toHaveAttribute('aria-checked', 'true');
    await radio('200%').focus();
    await page.keyboard.press('Space');
    await expect(radio('200%')).toHaveAttribute('aria-checked', 'true');
    await expect(radio('100%')).toHaveAttribute('aria-checked', 'false');
    await expect(page.getByText('Grid: on, zoom: 200%')).toBeVisible();
  });

  test('項目の間を ↓ で移動でき、グループの名前が付く', async ({ page }) => {
    const { trigger } = await setup(page);

    await trigger.click();
    await expect(page.getByRole('menuitemcheckbox', { name: 'Show grid' })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitemcheckbox', { name: 'Show rulers' })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitemradio', { name: '50%' })).toBeFocused();
    await expect(page.getByRole('group', { name: 'Zoom' })).toBeVisible();
  });
});
