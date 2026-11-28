import { expect, type Page, test } from '@playwright/test';
import { pressTab } from './keyboard';
import { gotoStory } from './story';

const setupDefault = async (page: Page, focusGuards = false) => {
  await gotoStory(page, 'components-treeview--default', { focusGuards });
  const tree = page.getByRole('tree', { name: 'Project files' });
  await expect(tree).toBeVisible({ timeout: 15_000 });
  const item = (value: string) => tree.locator(`[role="treeitem"][data-value="${value}"]`);
  const trigger = (value: string) => item(value).locator('> [data-leve-tree-view-item-trigger]');
  return { tree, item, trigger };
};

test.describe('TreeView', () => {
  test('Tab moves focus into the initial tab stop and out of the tree, and Shift+Tab restores focus to the last focused item', async ({
    page,
  }) => {
    const { item } = await setupDefault(page, true);

    const before = page.getByRole('button', { name: 'Before' });
    const after = page.getByRole('button', { name: 'After' });

    await before.focus();
    await expect(before).toBeFocused();

    // defaultValue is ['src/index.ts'], which starts as the roving tab stop
    await pressTab(page);
    await expect(item('src/index.ts')).toBeFocused();

    await pressTab(page);
    await expect(after).toBeFocused();

    await pressTab(page, { shift: true });
    await expect(item('src/index.ts')).toBeFocused();

    // Move focus with ArrowDown, Tab out, then Shift+Tab back to the newly focused item
    await page.keyboard.press('ArrowDown');
    await expect(item('src/utils.ts')).toBeFocused();

    await pressTab(page);
    await expect(after).toBeFocused();

    await pressTab(page, { shift: true });
    await expect(item('src/utils.ts')).toBeFocused();
  });

  test('ArrowDown and ArrowUp move focus through visible items and stop at the boundaries', async ({
    page,
  }) => {
    const { item } = await setupDefault(page);

    await item('src').focus();
    await expect(item('src')).toBeFocused();

    // ArrowUp on the first item does not wrap
    await page.keyboard.press('ArrowUp');
    await expect(item('src')).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(item('src/components')).toBeFocused();

    // Skips collapsed children of src/components (button.tsx, dialog.tsx)
    await page.keyboard.press('ArrowDown');
    await expect(item('src/index.ts')).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(item('src/utils.ts')).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(item('docs')).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(item('tests')).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(item('package.json')).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(item('README.md')).toBeFocused();

    // ArrowDown on the last item does not wrap
    await page.keyboard.press('ArrowDown');
    await expect(item('README.md')).toBeFocused();

    await page.keyboard.press('ArrowUp');
    await expect(item('package.json')).toBeFocused();
  });

  test('ArrowRight expands a closed branch, moves to its first child when open, and does nothing on a leaf', async ({
    page,
  }) => {
    const { item } = await setupDefault(page);

    const components = item('src/components');
    const buttonFile = item('src/components/button.tsx');

    await expect(components).toHaveAttribute('aria-expanded', 'false');
    await expect(buttonFile).toBeHidden();

    // Closed branch: ArrowRight expands without moving focus
    await components.focus();
    await page.keyboard.press('ArrowRight');
    await expect(components).toHaveAttribute('aria-expanded', 'true');
    await expect(buttonFile).toBeVisible();
    await expect(components).toBeFocused();

    // Open branch: ArrowRight moves focus to the first enabled child
    await page.keyboard.press('ArrowRight');
    await expect(buttonFile).toBeFocused();

    // Leaf: ArrowRight is a no-op
    await page.keyboard.press('ArrowRight');
    await expect(buttonFile).toBeFocused();
  });

  test('ArrowLeft collapses an open branch and moves focus from a closed branch or leaf to its parent', async ({
    page,
  }) => {
    const { item } = await setupDefault(page);

    const src = item('src');
    const components = item('src/components');
    const buttonFile = item('src/components/button.tsx');

    await components.focus();
    await page.keyboard.press('ArrowRight');
    await expect(components).toHaveAttribute('aria-expanded', 'true');
    await expect(buttonFile).toBeVisible();
    await page.keyboard.press('ArrowRight');
    await expect(buttonFile).toBeFocused();

    // Leaf -> parent
    await page.keyboard.press('ArrowLeft');
    await expect(components).toBeFocused();
    await expect(components).toHaveAttribute('aria-expanded', 'true');

    // Open branch -> collapse, focus stays
    await page.keyboard.press('ArrowLeft');
    await expect(components).toHaveAttribute('aria-expanded', 'false');
    await expect(buttonFile).toBeHidden();
    await expect(components).toBeFocused();

    // Closed branch -> parent
    await page.keyboard.press('ArrowLeft');
    await expect(src).toBeFocused();

    // Open top-level branch -> collapse
    await page.keyboard.press('ArrowLeft');
    await expect(src).toHaveAttribute('aria-expanded', 'false');
    await expect(src).toBeFocused();

    // Closed top-level branch -> no-op
    await page.keyboard.press('ArrowLeft');
    await expect(src).toBeFocused();
  });

  test('Home and End move focus to the first and last visible items', async ({ page }) => {
    const { item } = await setupDefault(page);

    await item('src/index.ts').focus();
    await expect(item('src/index.ts')).toBeFocused();

    await page.keyboard.press('End');
    await expect(item('README.md')).toBeFocused();

    await page.keyboard.press('Home');
    await expect(item('src')).toBeFocused();
  });

  test('Enter and Space select items in single mode and toggle selection in multiple mode', async ({
    page,
  }) => {
    const { item } = await setupDefault(page);

    await item('package.json').focus();
    await page.keyboard.press('Enter');
    await expect(item('package.json')).toHaveAttribute('aria-selected', 'true');
    await expect(item('src/index.ts')).toHaveAttribute('aria-selected', 'false');

    await item('README.md').focus();
    await page.keyboard.press('Space');
    await expect(item('README.md')).toHaveAttribute('aria-selected', 'true');
    await expect(item('package.json')).toHaveAttribute('aria-selected', 'false');

    // Multiple selection mode
    await gotoStory(page, 'components-treeview--multiple');
    const multiTree = page.getByRole('tree', { name: 'Produce' });
    await expect(multiTree).toHaveAttribute('aria-multiselectable', 'true');

    const banana = multiTree.locator('[role="treeitem"][data-value="banana"]');
    const apple = multiTree.locator('[role="treeitem"][data-value="apple"]');

    await expect(apple).toHaveAttribute('aria-selected', 'true');
    await expect(banana).toHaveAttribute('aria-selected', 'false');

    await banana.focus();
    await page.keyboard.press('Space');
    await expect(banana).toHaveAttribute('aria-selected', 'true');
    await expect(apple).toHaveAttribute('aria-selected', 'true');

    await apple.focus();
    await page.keyboard.press('Enter');
    await expect(apple).toHaveAttribute('aria-selected', 'false');
    await expect(banana).toHaveAttribute('aria-selected', 'true');
  });

  test('* expands all closed sibling branches at the same level without moving focus', async ({
    page,
  }) => {
    const { item } = await setupDefault(page);

    const docs = item('docs');
    const tests = item('tests');
    const components = item('src/components');
    const pkg = item('package.json');

    await expect(docs).toHaveAttribute('aria-expanded', 'false');
    await expect(tests).toHaveAttribute('aria-expanded', 'false');
    await expect(components).toHaveAttribute('aria-expanded', 'false');

    await pkg.focus();
    await page.keyboard.press('*');

    await expect(docs).toHaveAttribute('aria-expanded', 'true');
    await expect(tests).toHaveAttribute('aria-expanded', 'true');
    // Branch at a different nesting level stays closed
    await expect(components).toHaveAttribute('aria-expanded', 'false');
    await expect(pkg).toBeFocused();
  });

  test('Typeahead moves focus to the next visible enabled item matching typed characters', async ({
    page,
  }) => {
    const { item } = await setupDefault(page);

    await item('src').focus();
    await expect(item('src')).toBeFocused();

    await page.keyboard.press('p');
    await expect(item('package.json')).toBeFocused();

    // Arrow key resets the typeahead buffer before starting a new prefix search
    await page.keyboard.press('ArrowDown');
    await expect(item('README.md')).toBeFocused();

    await page.keyboard.press('d');
    await expect(item('docs')).toBeFocused();

    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('r');
    await expect(item('README.md')).toBeFocused();
  });

  test('Disabled items are skipped by navigation, typeahead, Home/End, and ignore interaction', async ({
    page,
  }) => {
    await gotoStory(page, 'components-treeview--disabled', { focusGuards: true });
    const tree = page.getByRole('tree', { name: 'Workspace files' });
    await expect(tree).toBeVisible({ timeout: 15_000 });

    const item = (value: string) => tree.locator(`[role="treeitem"][data-value="${value}"]`);
    const trigger = (value: string) => item(value).locator('> [data-leve-tree-view-item-trigger]');

    const lockfile = item('lockfile');
    const src = item('src');
    const secret = item('src/secret.ts');
    const main = item('src/main.ts');
    const nodeModules = item('node_modules');
    const readme = item('README.md');
    const archived = item('archived');

    await expect(lockfile).toHaveAttribute('aria-disabled', 'true');
    await expect(secret).toHaveAttribute('aria-disabled', 'true');
    await expect(nodeModules).toHaveAttribute('aria-disabled', 'true');
    await expect(archived).toHaveAttribute('aria-disabled', 'true');

    // Tab enters on first enabled item (src), skipping disabled lockfile
    await page.getByRole('button', { name: 'Before' }).focus();
    await pressTab(page);
    await expect(src).toBeFocused();

    // ArrowRight on open src skips disabled first child secret.ts and focuses main.ts
    await page.keyboard.press('ArrowRight');
    await expect(main).toBeFocused();

    // ArrowDown skips disabled node_modules and focuses README.md
    await page.keyboard.press('ArrowDown');
    await expect(readme).toBeFocused();

    // ArrowUp skips disabled node_modules back to main.ts
    await page.keyboard.press('ArrowUp');
    await expect(main).toBeFocused();

    // End skips disabled archived.txt and focuses README.md
    await page.keyboard.press('End');
    await expect(readme).toBeFocused();

    // Home skips disabled lockfile and focuses src
    await page.keyboard.press('Home');
    await expect(src).toBeFocused();

    // Typeahead skips disabled node_modules
    await page.keyboard.press('n');
    await expect(src).toBeFocused();

    // Clicking disabled item does not select or expand it (force click since ancestor treeitem has aria-disabled)
    await trigger('node_modules').click({ force: true });
    await expect(nodeModules).toHaveAttribute('aria-selected', 'false');
    await expect(nodeModules).toHaveAttribute('aria-expanded', 'false');
  });

  test('Controlled tree updates from external signals and trigger clicks', async ({ page }) => {
    await gotoStory(page, 'components-treeview--controlled');
    const tree = page.getByRole('tree', { name: 'Controlled files' });
    await expect(tree).toBeVisible({ timeout: 15_000 });

    const item = (value: string) => tree.locator(`[role="treeitem"][data-value="${value}"]`);

    await page.getByRole('button', { name: 'Expand all' }).click();
    await expect(item('src')).toHaveAttribute('aria-expanded', 'true');
    await expect(item('docs')).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByText('Expanded: src, docs')).toBeVisible();

    await page.getByRole('button', { name: 'Clear selection' }).click();
    await expect(item('src/index.ts')).toHaveAttribute('aria-selected', 'false');
    await expect(page.getByText('Selected: none')).toBeVisible();

    await page.getByRole('button', { name: 'Collapse all' }).click();
    await expect(item('src')).toHaveAttribute('aria-expanded', 'false');
    await expect(item('docs')).toHaveAttribute('aria-expanded', 'false');
  });
});
