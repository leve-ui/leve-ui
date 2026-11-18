import { expect, type Locator, type Page, test } from '@playwright/test';
import { distance, gotoDocs, gotoStory } from './story';

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

test.describe('Menu（サブメニュー）', () => {
  const setup = async (page: Page) => {
    await gotoStory(page, 'components-menu--submenu');
    const trigger = page.getByRole('button', { name: 'File' });
    await expect(trigger).toBeVisible({ timeout: 15_000 });
    const share = page.getByRole('menuitem', { name: 'Share' });
    const sub = page.getByRole('menu', { name: 'Share' });
    const item = (name: string) => page.getByRole('menuitem', { name });
    await trigger.click();
    await expect(item('New file')).toBeFocused();
    return { trigger, share, sub, item };
  };

  test('→ で開いて最初の項目に、← で閉じて SubTrigger に戻る', async ({ page }) => {
    const { share, sub, item } = await setup(page);

    await page.keyboard.press('ArrowDown');
    await expect(share).toBeFocused();
    await expect(share).toHaveAttribute('aria-haspopup', 'menu');
    await page.keyboard.press('ArrowRight');
    await expect(sub).toBeVisible();
    await expect(share).toHaveAttribute('aria-expanded', 'true');
    await expect(item('Copy link')).toBeFocused();

    await page.keyboard.press('ArrowLeft');
    await expect(sub).toBeHidden();
    await expect(share).toBeFocused();
  });

  test('サブメニューの中で ↓ で移動し、Enter で選ぶとメニュー全体が閉じる', async ({ page }) => {
    const { trigger, share, sub, item } = await setup(page);

    await page.keyboard.press('ArrowDown');
    await expect(share).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(item('Copy link')).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(item('Email')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(sub).toBeHidden();
    await expect(page.getByRole('menu', { name: 'File' })).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(page.getByText('Last action: Email')).toBeVisible();
  });

  test('Escape はサブメニューだけを閉じる', async ({ page }) => {
    const { share, sub, item } = await setup(page);

    await page.keyboard.press('ArrowDown');
    await expect(share).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(item('Copy link')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(sub).toBeHidden();
    await expect(page.getByRole('menu', { name: 'File' })).toBeVisible();
    await expect(share).toBeFocused();
  });

  test('ポインタを載せると開き、別の項目に移ると閉じる', async ({ page }) => {
    const { share, sub, item } = await setup(page);

    await share.hover();
    await expect(sub).toBeVisible();
    await expect(share).toBeFocused();
    await item('Print').hover();
    await expect(sub).toBeHidden();
  });

  test('両方のメニューの外を押すと、メニュー全体が閉じる', async ({ page }) => {
    const { share, sub } = await setup(page);

    await share.hover();
    await expect(sub).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(sub).toBeHidden();
    await expect(page.getByRole('menu', { name: 'File' })).toBeHidden();
  });
});

test.describe('Menu（コンテキストメニュー）', () => {
  const setup = async (page: Page) => {
    await gotoStory(page, 'components-menu--context');
    const area = page.locator('[data-leve-menu-context-trigger]');
    await expect(area).toBeVisible({ timeout: 15_000 });
    const menu = page.getByRole('menu', { name: 'Page' });
    const item = (name: string) => page.getByRole('menuitem', { name });
    const button = page.getByRole('button', { name: 'Or focus me and press Shift+F10' });
    return { area, menu, item, button };
  };

  /** Right-clicks the area at (x, y) relative to its top-left corner and returns the page point */
  const rightClick = async (page: Page, area: Locator, x: number, y: number) => {
    const box = await area.boundingBox();
    if (!box) throw new Error('The area is not visible');
    const point = { x: box.x + x, y: box.y + y };
    await page.mouse.click(point.x, point.y, { button: 'right' });
    return point;
  };

  const expectAt = async (menu: Locator, point: { x: number; y: number }) => {
    await expect(async () => {
      const box = await menu.boundingBox();
      expect(Math.abs((box?.x ?? 0) - point.x)).toBeLessThanOrEqual(2);
      expect(Math.abs((box?.y ?? 0) - point.y)).toBeLessThanOrEqual(2);
    }).toPass();
  };

  test('右クリックでポインタの位置に開き、最初の項目にフォーカスする', async ({ page }) => {
    const { area, menu, item } = await setup(page);

    const point = await rightClick(page, area, 20, 20);
    await expect(menu).toBeVisible();
    await expect(area).toHaveAttribute('data-state', 'open');
    await expect(item('Back')).toBeFocused();
    await expectAt(menu, point);
  });

  test('Escape で閉じる', async ({ page }) => {
    const { area, menu, item } = await setup(page);

    await rightClick(page, area, 20, 20);
    await expect(item('Back')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(area).toHaveAttribute('data-state', 'closed');
  });

  test('領域の中のもう一度の右クリックで、その位置に開き直す', async ({ page }) => {
    const { area, menu, item } = await setup(page);

    await rightClick(page, area, 20, 20);
    await expect(item('Back')).toBeFocused();
    // Outside the open menu, which covers the area from (20, 20)
    const point = await rightClick(page, area, 280, 120);
    await expect(menu).toBeVisible();
    await expectAt(menu, point);
    await expect(item('Back')).toBeFocused();
  });

  test('外側のクリックで閉じる', async ({ page }) => {
    const { area, menu } = await setup(page);

    await rightClick(page, area, 20, 20);
    await expect(menu).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(menu).toBeHidden();
  });

  test('Shift+F10 で、フォーカスしている要素の下に開き、Escape でその要素に戻る', async ({
    page,
  }) => {
    const { menu, item, button } = await setup(page);

    await button.focus();
    await page.keyboard.press('Shift+F10');
    await expect(menu).toBeVisible();
    await expect(item('Back')).toBeFocused();
    const box = await button.boundingBox();
    if (!box) throw new Error('The button is not visible');
    await expectAt(menu, { x: box.x, y: box.y + box.height });

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(button).toBeFocused();
  });

  test('↓ で無効な項目を飛ばし、Enter で選ぶと閉じる', async ({ page }) => {
    const { area, menu, item } = await setup(page);

    await rightClick(page, area, 20, 20);
    await expect(item('Back')).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(item('Reload')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(menu).toBeHidden();
    await expect(page.getByText('Last action: Reload')).toBeVisible();
  });

  test('サブメニューを → で開き、項目を選べる', async ({ page }) => {
    const { area, menu, item } = await setup(page);

    await rightClick(page, area, 20, 20);
    await expect(item('Back')).toBeFocused();
    await page.keyboard.press('End');
    await expect(item('More tools')).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('menu', { name: 'More tools' })).toBeVisible();
    await expect(item('Save page as…')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(menu).toBeHidden();
    await expect(page.getByText('Last action: Save page as')).toBeVisible();
  });

  test('タッチの長押しで、その位置に開く。動かすと取り消す', async ({ page }) => {
    const { area, menu, item } = await setup(page);
    const box = await area.boundingBox();
    if (!box) throw new Error('The area is not visible');
    const point = { x: box.x + 40, y: box.y + 30 };
    const touch = { pointerType: 'touch', isPrimary: true, clientX: point.x, clientY: point.y };

    // Moving more than 10px cancels the long press
    await area.dispatchEvent('pointerdown', touch);
    await area.dispatchEvent('pointermove', { ...touch, clientX: point.x + 20 });
    await page.waitForTimeout(1000);
    await expect(menu).toBeHidden();
    await area.dispatchEvent('pointerup', touch);

    await area.dispatchEvent('pointerdown', touch);
    await expect(menu).toBeVisible();
    await expect(item('Back')).toBeFocused();
    await expectAt(menu, point);
    await area.dispatchEvent('pointerup', touch);
  });
});

test('複数の Qwik コンテナがあるページでも、押した Trigger の隣に開く（#167）', async ({
  page,
}) => {
  await gotoDocs(page, 'menu');
  // The Docs page renders each story in its own container, so the ids are the same in each
  const trigger = page.getByRole('button', { name: 'File' });
  await expect(trigger).toBeVisible({ timeout: 15_000 });
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  // Not by name: aria-labelledby points to the duplicate id, which the browser resolves in the
  // first container
  const menu = page.locator('[data-leve-menu-content]').filter({ visible: true });
  await expect(menu).toHaveCount(1);
  const [triggerBox, menuBox] = await Promise.all([trigger.boundingBox(), menu.boundingBox()]);
  if (!triggerBox || !menuBox) throw new Error('Not visible');
  expect(distance(triggerBox, menuBox)).toBeLessThan(20);
});
