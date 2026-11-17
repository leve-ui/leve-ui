import { expect, type Page, test } from '@playwright/test';
import { gotoStory } from './story';

const setup = async (page: Page, story = 'default') => {
  await gotoStory(page, `components-toast--${story}`);
  const region = page.getByRole('region', { name: 'Notifications (F8)' });
  const toasts = page.locator('[data-leve-toast]');
  return { region, toasts };
};

const show = async (page: Page, times = 1) => {
  const button = page.getByRole('button', { name: 'Show toast' });
  await expect(button).toBeVisible({ timeout: 15_000 });
  for (let i = 0; i < times; i++) await button.click();
};

test.describe('Toast', () => {
  test('ボタンで通知が追加され、読み上げられる', async ({ page }) => {
    const { toasts } = await setup(page);
    await show(page);

    await expect(toasts).toHaveCount(1);
    await expect(toasts.first()).toHaveAttribute('data-state', 'open');
    await expect(toasts.first()).toContainText('Saved');
    await expect(page.locator('[data-leve-announcer-region="assertive"]')).toContainText(
      'Saved. Your changes were saved.',
    );
  });

  test('duration が過ぎると閉じる', async ({ page }) => {
    await page.clock.install();
    const { toasts } = await setup(page);
    await show(page);
    await expect(toasts).toHaveCount(1);

    await page.clock.runFor(4000);
    await expect(toasts.first()).toHaveAttribute('data-state', 'open');
    await page.clock.runFor(1500);
    await expect(toasts.first()).toHaveAttribute('data-state', 'closed');
  });

  test('ポインタが載っている間は閉じず、離れると残りの時間で閉じる', async ({ page }) => {
    await page.clock.install();
    const { region, toasts } = await setup(page);
    await show(page);
    await expect(toasts).toHaveCount(1);

    await toasts.first().hover();
    await expect(region).toHaveAttribute('data-expanded', '');
    await page.clock.runFor(8000);
    await expect(toasts.first()).toHaveAttribute('data-state', 'open');

    await page.mouse.move(5, 5);
    await expect(region).not.toHaveAttribute('data-expanded', '');
    await page.clock.runFor(5500);
    await expect(toasts.first()).toHaveAttribute('data-state', 'closed');
  });

  test('Close で閉じ、一覧から消える', async ({ page }) => {
    const { toasts } = await setup(page);
    await show(page);

    await page.getByRole('button', { name: 'Close' }).click();
    await expect(toasts).toHaveCount(0);
  });

  test('F8 で Region にフォーカスし、Tab で通知に移り、Escape で閉じる', async ({ page }) => {
    const { region, toasts } = await setup(page);
    await show(page, 2);
    await expect(toasts).toHaveCount(2);

    await page.keyboard.press('F8');
    await expect(region).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(toasts.first()).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(toasts).toHaveCount(1);
    // Focus moves on to the next toast
    await expect(toasts.first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(toasts).toHaveCount(0);
    await expect(region).toBeFocused();
  });

  test('新しい通知が手前に重なり、ホバーで広がる', async ({ page }) => {
    const { region, toasts } = await setup(page);
    await show(page, 3);
    await expect(toasts).toHaveCount(3);

    const newest = toasts.nth(2);
    await expect(newest).toHaveAttribute('data-front', '');
    await expect(toasts.nth(0)).not.toHaveAttribute('data-front', '');
    const indexes = await toasts.evaluateAll((items) =>
      items.map((item) => (item as HTMLElement).style.getPropertyValue('--leve-toast-index')),
    );
    expect(indexes).toEqual(['2', '1', '0']);

    // Stacked: the toasts overlap (measured after the enter animations)
    await page.waitForFunction(() =>
      document.getAnimations().every((animation) => animation.playState !== 'running'),
    );
    const boxes = async () =>
      Promise.all([0, 1, 2].map(async (i) => (await toasts.nth(i).boundingBox()) ?? null));
    const stacked = await boxes();
    for (const box of stacked.slice(0, 2)) {
      expect((box?.y ?? 0) + (box?.height ?? 0)).toBeGreaterThan(stacked[2]?.y ?? 0);
    }

    // Expanded: older toasts move above the newer ones without overlapping
    await newest.hover();
    await expect(region).toHaveAttribute('data-expanded', '');
    await expect(toasts.nth(0)).toHaveAttribute('data-expanded', '');
    await expect(async () => {
      const spread = await boxes();
      for (let i = 0; i < 2; i++) {
        expect((spread[i]?.y ?? 0) + (spread[i]?.height ?? 0)).toBeLessThanOrEqual(
          (spread[i + 1]?.y ?? 0) + 1,
        );
      }
    }).toPass();
  });

  test('右へスワイプすると閉じ、足りなければ戻る', async ({ page }) => {
    const { toasts } = await setup(page);
    await show(page);
    const toast = toasts.first();
    await expect(toast).toHaveAttribute('data-state', 'open');
    // Measure after the enter animation
    await toast.evaluate((element) =>
      Promise.all(element.getAnimations().map((animation) => animation.finished)),
    );
    const box = await toast.boundingBox();
    if (!box) throw new Error('The toast is not visible');
    const x = box.x + 40;
    const y = box.y + box.height / 2;

    // Not far enough: back in place
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 20, y, { steps: 5 });
    await expect(toast).toHaveAttribute('data-swipe', 'move');
    await page.mouse.up();
    await expect(toast).toHaveAttribute('data-swipe', 'cancel');
    await expect(toast).toHaveAttribute('data-state', 'open');

    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 120, y, { steps: 8 });
    await page.mouse.up();
    await expect(toasts).toHaveCount(0);
  });
});

test.describe('Toast（Action）', () => {
  test('Action のある通知は自動で閉じず、Undo で元に戻して閉じる', async ({ page }) => {
    await page.clock.install();
    const { toasts } = await setup(page, 'action');
    const remove = page.getByRole('button', { name: 'Delete' }).first();
    await expect(remove).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText('report.pdf')).toBeVisible();

    await remove.click();
    await expect(toasts).toHaveCount(1);
    await expect(page.getByRole('listitem').filter({ hasText: 'report.pdf' })).toHaveCount(1);
    await page.clock.runFor(20_000);
    await expect(toasts.first()).toHaveAttribute('data-state', 'open');

    await page.getByRole('button', { name: 'Undo' }).click();
    await expect(toasts.first()).toHaveAttribute('data-state', 'closed');
    await expect(page.locator('.toast-action-file').filter({ hasText: 'report.pdf' })).toHaveCount(
      1,
    );
  });
});
