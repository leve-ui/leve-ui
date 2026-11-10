import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('Alert', () => {
  test('role="alert" として表示される', async ({ page }) => {
    await gotoStory(page, 'components-alert--default');

    const alert = page.getByRole('alert');
    await expect(alert).toContainText('Payment failed');
    await expect(alert).toContainText('Check your card details and try again.');
  });

  test('表示してもフォーカスを移動しない', async ({ page }) => {
    await gotoStory(page, 'components-alert--on-submit');

    const submit = page.getByRole('button', { name: 'Submit' });
    await submit.click();
    await expect(page.getByRole('alert')).toContainText('Submission failed');
    await expect(submit).toBeFocused();
  });
});
