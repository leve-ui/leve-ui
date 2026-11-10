import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('Progress', () => {
  test('Label をアクセシブルネームに持つ progressbar になる', async ({ page }) => {
    await gotoStory(page, 'components-progress--default');

    const progress = page.getByRole('progressbar', { name: 'Uploading' });
    await expect(progress).toHaveAttribute('aria-valuenow', '40');
    await expect(progress).toHaveAttribute('aria-valuemin', '0');
    await expect(progress).toHaveAttribute('aria-valuemax', '100');
    await expect(page.locator('[data-leve-progress-value-text]')).toHaveText('40%');
  });

  test('不確定のときは aria-valuenow を持たない', async ({ page }) => {
    await gotoStory(page, 'components-progress--indeterminate');

    const progress = page.getByRole('progressbar', { name: 'Uploading' });
    await expect(progress).toHaveAttribute('data-state', 'indeterminate');
    await expect(progress).not.toHaveAttribute('aria-valuenow');
  });

  test('valueText が aria-valuetext として読み上げに使われる', async ({ page }) => {
    await gotoStory(page, 'components-progress--with-value-text');

    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '3 of 10 files');
  });

  test('値の変化に追従し、最大値で complete になる', async ({ page }) => {
    await gotoStory(page, 'components-progress--controlled');

    const progress = page.getByRole('progressbar', { name: 'Uploading' });
    const advance = page.getByRole('button', { name: 'Advance' });
    await advance.click();
    await expect(progress).toHaveAttribute('aria-valuenow', '25');
    await expect(progress).toHaveAttribute('data-state', 'loading');
    for (let i = 0; i < 3; i++) await advance.click();
    await expect(progress).toHaveAttribute('aria-valuenow', '100');
    await expect(progress).toHaveAttribute('data-state', 'complete');
  });

  test('Indicator の幅が Root の value の割合に追従する', async ({ page }) => {
    await gotoStory(page, 'components-progress--controlled');

    const track = page.locator('[data-leve-progress-track]');
    const indicator = page.locator('[data-leve-progress-indicator]');
    const ratio = async () => {
      const [t, i] = await Promise.all([track.boundingBox(), indicator.boundingBox()]);
      return Math.round(((i?.width ?? 0) / (t?.width ?? 1)) * 100);
    };

    await page.getByRole('button', { name: 'Advance' }).click();
    await page.getByRole('button', { name: 'Advance' }).click();
    await expect(indicator).toHaveAttribute('style', /--leve-progress-percent:\s*50%/);
    // transition の完了を待つ
    await expect.poll(ratio).toBe(50);

    await page.getByRole('button', { name: 'Reset' }).click();
    await expect.poll(ratio).toBe(0);
  });
});
