import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('Meter', () => {
  test('Label をアクセシブルネームに持つ meter になる', async ({ page }) => {
    await gotoStory(page, 'components-meter--default');

    const meter = page.getByRole('meter', { name: 'Storage' });
    await expect(meter).toHaveAttribute('aria-valuenow', '25');
    await expect(meter).toHaveAttribute('aria-valuemin', '0');
    await expect(meter).toHaveAttribute('aria-valuemax', '100');
    await expect(page.locator('[data-leve-meter-value-text]')).toHaveText('25%');
  });

  test('valueText が aria-valuetext として読み上げに使われる', async ({ page }) => {
    await gotoStory(page, 'components-meter--with-value-text');

    await expect(page.getByRole('meter')).toHaveAttribute('aria-valuetext', '50 GB of 200 GB');
  });

  test('値の増減に追従する', async ({ page }) => {
    await gotoStory(page, 'components-meter--controlled');

    const meter = page.getByRole('meter', { name: 'Storage' });
    await page.getByRole('button', { name: 'Increase' }).click();
    await expect(meter).toHaveAttribute('aria-valuenow', '60');
    await page.getByRole('button', { name: 'Decrease' }).click();
    await page.getByRole('button', { name: 'Decrease' }).click();
    await expect(meter).toHaveAttribute('aria-valuenow', '40');
    await expect(page.locator('[data-leve-meter-value-text]')).toHaveText('40%');
  });

  test('Indicator の幅が Root の value の割合に追従する', async ({ page }) => {
    await gotoStory(page, 'components-meter--controlled');

    const track = page.locator('[data-leve-meter-track]');
    const indicator = page.locator('[data-leve-meter-indicator]');
    const ratio = async () => {
      const [t, i] = await Promise.all([track.boundingBox(), indicator.boundingBox()]);
      return Math.round(((i?.width ?? 0) / (t?.width ?? 1)) * 100);
    };

    await expect.poll(ratio).toBe(50);
    await page.getByRole('button', { name: 'Increase' }).click();
    await expect.poll(ratio).toBe(60);
  });
});
