import { expect, type Page, test } from '@playwright/test';
import { pressTab } from './keyboard';
import { distance, gotoDocs, gotoStory } from './story';

const open = async (page: Page, story = 'default', triggerName = 'Dimensions') => {
  await gotoStory(page, `components-popover--${story}`, { focusGuards: true });
  const trigger = page.getByRole('button', { name: triggerName });
  await expect(trigger).toBeVisible({ timeout: 15_000 });
  await trigger.click();
  const popover = page.locator('[data-leve-popover-content]');
  await expect(popover).toBeVisible();
  return { trigger, popover };
};

test.describe('Popover', () => {
  test('Trigger で開き、最初のフォーカス可能な要素にフォーカスする', async ({ page }) => {
    const { trigger, popover } = await open(page);

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('dialog', { name: 'Dimensions' })).toBeVisible();
    await expect(popover).toHaveAccessibleDescription('Set the size of the layer.');
    await expect(popover.getByRole('textbox', { name: 'Width' })).toBeFocused();
  });

  test('Trigger の下に置かれ、反転後の data-side が付く', async ({ page }) => {
    const { trigger, popover } = await open(page);

    const triggerBox = await trigger.boundingBox();
    const popoverBox = await popover.boundingBox();
    if (!triggerBox || !popoverBox) throw new Error('Not rendered');
    expect(popoverBox.y).toBeGreaterThan(triggerBox.y + triggerBox.height - 1);
    await expect(popover).toHaveAttribute('data-side', 'bottom');
    await expect(popover.locator('[data-leve-popover-arrow]')).toHaveAttribute(
      'data-side',
      'bottom',
    );
  });

  test('Escape で閉じ、Trigger にフォーカスが戻る', async ({ page }) => {
    const { trigger, popover } = await open(page);
    await expect(popover.getByRole('textbox', { name: 'Width' })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(popover).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('Close で閉じ、Trigger にフォーカスが戻る', async ({ page }) => {
    const { trigger, popover } = await open(page);

    await popover.getByRole('button', { name: 'Close' }).click();
    await expect(popover).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('外側のクリックで閉じる', async ({ page }) => {
    const { popover } = await open(page);

    await page.mouse.click(5, 5);
    await expect(popover).toBeHidden();
  });

  test('Tab でフォーカスが外に出ると閉じる', async ({ page, browserName }) => {
    const { popover } = await open(page);
    const close = popover.getByRole('button', { name: 'Close' });

    await close.focus();
    await pressTab(page);
    await expect(popover).toBeHidden();
    // Chromium moves focus to the element after the Trigger; WebKit moves it to the body
    if (browserName === 'chromium') {
      await expect(page.getByRole('button', { name: 'After' })).toBeFocused();
    }
  });

  test('開いているときに Trigger を押すと閉じる', async ({ page }) => {
    const { trigger, popover } = await open(page);

    await trigger.click();
    await expect(popover).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('Anchor を指定すると、その幅と位置に合わせて置かれる', async ({ page }) => {
    const { popover } = await open(page, 'anchor', 'Filters');
    const anchor = page.locator('[data-leve-popover-anchor]');

    const anchorBox = await anchor.boundingBox();
    const popoverBox = await popover.boundingBox();
    if (!anchorBox || !popoverBox) throw new Error('Not rendered');
    expect(Math.round(popoverBox.x)).toBe(Math.round(anchorBox.x));
    expect(Math.round(popoverBox.width)).toBe(Math.round(anchorBox.width));
  });
});

test('複数の Qwik コンテナがあるページでも、押した Trigger の隣に開く（#167）', async ({
  page,
}) => {
  await gotoDocs(page, 'popover');
  // The Docs page renders each story in its own container, so the ids are the same in each
  const trigger = page.getByRole('button', { name: 'Dimensions' }).last();
  await expect(trigger).toBeVisible({ timeout: 15_000 });
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const popover = page.locator('[data-leve-popover-content]').filter({ visible: true });
  await expect(popover).toHaveCount(1);
  const [triggerBox, popoverBox] = await Promise.all([
    trigger.boundingBox(),
    popover.boundingBox(),
  ]);
  if (!triggerBox || !popoverBox) throw new Error('Not visible');
  expect(distance(triggerBox, popoverBox)).toBeLessThan(20);
});
