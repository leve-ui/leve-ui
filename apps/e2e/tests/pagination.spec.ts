import { expect, test } from '@playwright/test';
import { pressTab } from './keyboard';
import { gotoStory } from './story';

test.describe('Pagination', () => {
  test('renders nav landmark and navigates pages by clicking items and triggers', async ({
    page,
  }) => {
    await gotoStory(page, 'components-pagination--default');

    const nav = page.getByRole('navigation', { name: 'Pagination' });
    await expect(nav).toBeVisible();

    const prev = nav.getByRole('button', { name: 'Previous page' });
    const next = nav.getByRole('button', { name: 'Next page' });
    const page1 = nav.getByRole('button', { name: '1', exact: true });
    const page2 = nav.getByRole('button', { name: '2', exact: true });

    await expect(prev).toBeDisabled();
    await expect(page1).toHaveAttribute('aria-current', 'page');
    await expect(next).toBeEnabled();

    await next.click();
    await expect(page2).toHaveAttribute('aria-current', 'page');
    await expect(prev).toBeEnabled();

    await nav.getByRole('button', { name: '10', exact: true }).click();
    await expect(nav.getByRole('button', { name: '10', exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(next).toBeDisabled();

    await prev.click();
    await expect(nav.getByRole('button', { name: '9', exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(next).toBeEnabled();
  });

  test('supports keyboard Tab navigation and Enter/Space activation', async ({ page }) => {
    await gotoStory(page, 'components-pagination--default', { focusGuards: true });

    const before = page.getByRole('button', { name: 'Before' });
    const nav = page.getByRole('navigation', { name: 'Pagination' });
    const page1 = nav.getByRole('button', { name: '1', exact: true });
    const page2 = nav.getByRole('button', { name: '2', exact: true });

    await before.focus();
    // PrevTrigger is disabled on page 1, so Tab skips it and focuses page 1
    await pressTab(page);
    await expect(page1).toBeFocused();

    await pressTab(page);
    await expect(page2).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page2).toHaveAttribute('aria-current', 'page');
  });

  test('updates external status in controlled mode', async ({ page }) => {
    await gotoStory(page, 'components-pagination--controlled');

    await expect(page.getByText('Page 3 of 8')).toBeVisible();
    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(page.getByText('Page 4 of 8')).toBeVisible();
  });

  test('renders links in link mode and disables navigation on page 1', async ({ page }) => {
    await gotoStory(page, 'components-pagination--link-mode');

    const nav = page.getByRole('navigation', { name: 'Pagination' });
    const page1 = nav.locator('[data-leve-pagination-item]', { hasText: '1' });
    const page2 = nav.locator('[data-leve-pagination-item]', { hasText: '2' });
    const prev = nav.locator('[data-leve-pagination-prev-trigger]');

    await expect(page2).toHaveAttribute('aria-current', 'page');
    await expect(page1).toHaveAttribute('href', '#page-1');
    await expect(prev).toHaveAttribute('href', '#page-1');

    await page1.click();
    await expect(page1).toHaveAttribute('aria-current', 'page');
    await expect(prev).toHaveAttribute('aria-disabled', 'true');
    await expect(prev).not.toHaveAttribute('href', /.+/);
  });

  test('disables all controls when Root is disabled', async ({ page }) => {
    await gotoStory(page, 'components-pagination--disabled');

    const nav = page.getByRole('navigation', { name: 'Pagination' });
    await expect(nav).toHaveAttribute('data-disabled', '');
    await expect(nav.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await expect(nav.getByRole('button', { name: 'Next page' })).toBeDisabled();
    await expect(nav.getByRole('button', { name: '1', exact: true })).toBeDisabled();
  });
});
