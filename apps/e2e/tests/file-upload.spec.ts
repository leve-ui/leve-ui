import { expect, test } from '@playwright/test';
import { gotoStory } from './story';

test.describe('FileUpload', () => {
  test('selects a file via HiddenInput and displays name and size', async ({ page }) => {
    await gotoStory(page, 'components-fileupload--default');

    const input = page.locator('[data-leve-file-upload-hidden-input]');
    await input.setInputFiles({
      name: 'hello.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello world'),
    });

    const itemGroup = page.locator('[data-leve-file-upload-item-group]');
    await expect(itemGroup.getByText('hello.txt', { exact: true })).toBeVisible();
    await expect(itemGroup.getByText('11 B', { exact: true })).toBeVisible();
  });

  test('opens file chooser with Enter on Trigger', async ({ page }) => {
    await gotoStory(page, 'components-fileupload--default');

    const trigger = page.getByRole('button', { name: 'Choose file' });
    await trigger.focus();

    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.keyboard.press('Enter'),
    ]);

    await fileChooser.setFiles({
      name: 'enter-file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('enter'),
    });

    const itemGroup = page.locator('[data-leve-file-upload-item-group]');
    await expect(itemGroup.getByText('enter-file.txt', { exact: true })).toBeVisible();
  });

  test('opens file chooser with Space on Trigger', async ({ page }) => {
    await gotoStory(page, 'components-fileupload--default');

    const trigger = page.getByRole('button', { name: 'Choose file' });
    await trigger.focus();

    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.keyboard.press('Space'),
    ]);

    await fileChooser.setFiles({
      name: 'space-file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('space'),
    });

    const itemGroup = page.locator('[data-leve-file-upload-item-group]');
    await expect(itemGroup.getByText('space-file.txt', { exact: true })).toBeVisible();
  });

  test('deletes a selected file via ItemDeleteTrigger', async ({ page }) => {
    await gotoStory(page, 'components-fileupload--multiple');

    const input = page.locator('[data-leve-file-upload-hidden-input]');
    await input.setInputFiles([
      { name: 'first.txt', mimeType: 'text/plain', buffer: Buffer.from('first') },
      { name: 'second.txt', mimeType: 'text/plain', buffer: Buffer.from('second') },
    ]);

    const itemGroup = page.locator('[data-leve-file-upload-item-group]');
    await expect(itemGroup.getByText('first.txt', { exact: true })).toBeVisible();
    await expect(itemGroup.getByText('second.txt', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Remove first.txt' }).click();

    await expect(itemGroup.getByText('first.txt', { exact: true })).toBeHidden();
    await expect(itemGroup.getByText('second.txt', { exact: true })).toBeVisible();
  });

  test('reports validation rejections for invalid type, too large, and too many files', async ({
    page,
  }) => {
    await gotoStory(page, 'components-fileupload--validation');

    const input = page.locator('[data-leve-file-upload-hidden-input]');
    await input.setInputFiles([
      { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('text') },
      {
        name: 'huge.png',
        mimeType: 'image/png',
        buffer: Buffer.alloc(1024 * 1024 + 10, 1),
      },
      { name: 'one.png', mimeType: 'image/png', buffer: Buffer.from('1') },
      { name: 'two.png', mimeType: 'image/png', buffer: Buffer.from('2') },
      { name: 'three.png', mimeType: 'image/png', buffer: Buffer.from('3') },
    ]);

    const itemGroup = page.locator('[data-leve-file-upload-item-group]');
    await expect(itemGroup.getByText('one.png', { exact: true })).toBeVisible();
    await expect(itemGroup.getByText('two.png', { exact: true })).toBeVisible();
    await expect(itemGroup.getByText('three.png', { exact: true })).toBeHidden();

    const rejectedList = page.getByRole('list', { name: 'Rejected files' });
    await expect(rejectedList).toContainText('notes.txt: FILE_INVALID_TYPE');
    await expect(rejectedList).toContainText('huge.png: FILE_TOO_LARGE');
    await expect(rejectedList).toContainText('three.png: TOO_MANY_FILES');
  });

  test('submits accepted files with FormData and clears on form reset', async ({ page }) => {
    await gotoStory(page, 'components-fileupload--with-form');

    const input = page.locator('[data-leve-file-upload-hidden-input]');
    await input.setInputFiles([
      { name: 'a.txt', mimeType: 'text/plain', buffer: Buffer.from('a') },
      { name: 'b.txt', mimeType: 'text/plain', buffer: Buffer.from('b') },
    ]);

    await page.getByRole('button', { name: 'Submit' }).click();
    const output = page.locator('output');
    await expect(output).toHaveText('{"documents":["a.txt","b.txt"]}');

    await page.getByRole('button', { name: 'Reset' }).click();
    const itemGroup = page.locator('[data-leve-file-upload-item-group]');
    await expect(itemGroup).toBeHidden();

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(output).toHaveText('{"documents":[]}');
  });

  test('disables trigger and input when disabled', async ({ page }) => {
    await gotoStory(page, 'components-fileupload--disabled');

    const trigger = page.getByRole('button', { name: 'Choose file' });
    const input = page.locator('[data-leve-file-upload-hidden-input]');

    await expect(trigger).toBeDisabled();
    await expect(input).toBeDisabled();
  });
});
