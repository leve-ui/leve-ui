import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('Accordion', () => {
  test('Enter で開き、もう一度 Enter で閉じる', async ({ page }) => {
    await gotoStory(page, 'components-accordion--collapsible');

    const trigger1 = page.getByRole('button', { name: 'What is leve-ui?' });
    const content1 = page.getByText('leve-ui is a headless UI component library');

    await expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    await expect(content1).toBeVisible();

    await trigger1.focus();
    await page.keyboard.press('Enter');
    await expect(trigger1).toHaveAttribute('aria-expanded', 'false');
    await expect(content1).toBeHidden();

    await page.keyboard.press('Enter');
    await expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    await expect(content1).toBeVisible();
  });

  test('Space で閉じ、もう一度 Space で開く', async ({ page }) => {
    await gotoStory(page, 'components-accordion--collapsible');

    const trigger1 = page.getByRole('button', { name: 'What is leve-ui?' });
    const content1 = page.getByText('leve-ui is a headless UI component library');

    await trigger1.focus();
    await page.keyboard.press('Space');
    await expect(trigger1).toHaveAttribute('aria-expanded', 'false');
    await expect(content1).toBeHidden();

    await page.keyboard.press('Space');
    await expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    await expect(content1).toBeVisible();
  });

  test('Tab で各 Trigger と開いている Content 内の要素に順にフォーカスが移動する', async ({
    page,
  }) => {
    await gotoStory(page, 'components-accordion--collapsible');

    const trigger1 = page.getByRole('button', { name: 'What is leve-ui?' });
    const contentLink = page.getByRole('link', { name: 'Learn more about leve-ui' });
    const trigger2 = page.getByRole('button', { name: 'Is it accessible?' });
    const trigger3 = page.getByRole('button', { name: 'Can I customize the styles?' });

    await trigger1.focus();
    await expect(trigger1).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(contentLink).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(trigger2).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(trigger3).toBeFocused();
  });

  test('ArrowDown / ArrowUp で Trigger 間を移動し、端でループする', async ({ page }) => {
    await gotoStory(page, 'components-accordion--default');

    const trigger1 = page.getByRole('button', { name: 'What is leve-ui?' });
    const trigger2 = page.getByRole('button', { name: 'Is it accessible?' });
    const trigger3 = page.getByRole('button', { name: 'Can I customize the styles?' });

    await trigger1.focus();
    await expect(trigger1).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(trigger2).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(trigger3).toBeFocused();

    // ループして最初のトリガーへ移動
    await page.keyboard.press('ArrowDown');
    await expect(trigger1).toBeFocused();

    // ArrowUp で末尾へ逆ループ
    await page.keyboard.press('ArrowUp');
    await expect(trigger3).toBeFocused();

    await page.keyboard.press('ArrowUp');
    await expect(trigger2).toBeFocused();
  });

  test('Home / End で最初と最後の Trigger に移動する', async ({ page }) => {
    await gotoStory(page, 'components-accordion--default');

    const trigger1 = page.getByRole('button', { name: 'What is leve-ui?' });
    const trigger2 = page.getByRole('button', { name: 'Is it accessible?' });
    const trigger3 = page.getByRole('button', { name: 'Can I customize the styles?' });

    await trigger2.focus();
    await expect(trigger2).toBeFocused();

    await page.keyboard.press('Home');
    await expect(trigger1).toBeFocused();

    await page.keyboard.press('End');
    await expect(trigger3).toBeFocused();
  });

  test('disabled な Trigger は矢印キーでスキップされる', async ({ page }) => {
    await gotoStory(page, 'components-accordion--disabled');

    const trigger1 = page.getByRole('button', { name: 'What is leve-ui?' });
    const trigger2 = page.getByRole('button', { name: 'Is it accessible? (Disabled)' });
    const trigger3 = page.getByRole('button', { name: 'Can I customize the styles?' });

    await expect(trigger2).toBeDisabled();

    await trigger1.focus();
    await expect(trigger1).toBeFocused();

    // ArrowDown で disabled な trigger2 をスキップして trigger3 へ
    await page.keyboard.press('ArrowDown');
    await expect(trigger3).toBeFocused();

    // ArrowUp で disabled な trigger2 をスキップして trigger1 へ
    await page.keyboard.press('ArrowUp');
    await expect(trigger1).toBeFocused();
  });

  test('single 非 collapsible モード: 開いている Trigger は aria-disabled="true" となり、Enter を押しても開いたままになる', async ({
    page,
  }) => {
    await gotoStory(page, 'components-accordion--default');

    const trigger1 = page.getByRole('button', { name: 'What is leve-ui?' });
    const content1 = page.getByText('leve-ui is a headless UI component library');

    await expect(trigger1).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger1).not.toHaveAttribute('aria-disabled', 'true');

    await trigger1.click();
    await expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    await expect(trigger1).toHaveAttribute('aria-disabled', 'true');
    await expect(content1).toBeVisible();

    // 開いた状態で Enter を押しても閉じない
    await trigger1.focus();
    await page.keyboard.press('Enter');
    await expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    await expect(trigger1).toHaveAttribute('aria-disabled', 'true');
    await expect(content1).toBeVisible();
  });
});
