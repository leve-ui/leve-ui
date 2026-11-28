import { component$, useSignal } from '@builder.io/qwik';
import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it, vi } from 'vitest';
import { TreeView } from './index';

function flush() {
  return new Promise((resolve) => setTimeout(resolve, 20));
}

describe('TreeView', () => {
  it('renders all parts with expected elements, roles, and data attributes', async () => {
    const { screen, render } = await createDOM();
    await render(
      <TreeView.Root aria-label="Files">
        <TreeView.Item value="src" branch>
          <TreeView.ItemTrigger>
            <TreeView.ItemIndicator>{'>'}</TreeView.ItemIndicator>
            src
          </TreeView.ItemTrigger>
          <TreeView.Group>
            <TreeView.Item value="src/index.ts">
              <TreeView.ItemTrigger>index.ts</TreeView.ItemTrigger>
            </TreeView.Item>
          </TreeView.Group>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const root = screen.querySelector('[data-leve-tree-view]');
    const items = screen.querySelectorAll('[data-leve-tree-view-item]');
    const triggers = screen.querySelectorAll('[data-leve-tree-view-item-trigger]');
    const indicator = screen.querySelector('[data-leve-tree-view-item-indicator]');
    const group = screen.querySelector('[data-leve-tree-view-group]');

    expect(root?.tagName).toBe('UL');
    expect(root?.getAttribute('role')).toBe('tree');
    expect(root?.hasAttribute('aria-multiselectable')).toBe(false);
    expect(root?.hasAttribute('aria-disabled')).toBe(false);

    expect(items.length).toBe(2);
    expect(items[0]?.tagName).toBe('LI');
    expect(items[0]?.getAttribute('role')).toBe('treeitem');
    expect(items[0]?.getAttribute('aria-expanded')).toBe('false');
    expect(items[0]?.getAttribute('aria-selected')).toBe('false');
    expect(items[0]?.getAttribute('aria-level')).toBe('1');
    expect(items[0]?.getAttribute('data-value')).toBe('src');
    expect(items[0]?.getAttribute('data-state')).toBe('closed');
    expect(items[0]?.getAttribute('data-depth')).toBe('0');
    expect(items[0]?.hasAttribute('data-branch')).toBe(true);
    expect(items[0]?.hasAttribute('data-selected')).toBe(false);

    expect(items[1]?.getAttribute('role')).toBe('treeitem');
    expect(items[1]?.hasAttribute('aria-expanded')).toBe(false);
    expect(items[1]?.getAttribute('aria-selected')).toBe('false');
    expect(items[1]?.getAttribute('aria-level')).toBe('2');
    expect(items[1]?.getAttribute('data-value')).toBe('src/index.ts');
    expect(items[1]?.getAttribute('data-state')).toBe('unchecked');
    expect(items[1]?.getAttribute('data-depth')).toBe('1');
    expect(items[1]?.hasAttribute('data-branch')).toBe(false);

    expect(triggers[0]?.tagName).toBe('DIV');
    expect(triggers[0]?.getAttribute('data-state')).toBe('closed');
    expect(triggers[0]?.getAttribute('data-depth')).toBe('0');
    expect(triggers[1]?.getAttribute('data-state')).toBe('unchecked');
    expect(triggers[1]?.getAttribute('data-depth')).toBe('1');

    expect(indicator?.tagName).toBe('SPAN');
    expect(indicator?.getAttribute('aria-hidden')).toBe('true');
    expect(indicator?.getAttribute('data-state')).toBe('closed');

    expect(group?.tagName).toBe('UL');
    expect(group?.getAttribute('role')).toBe('group');
    expect(group?.hasAttribute('hidden')).toBe(true);
    expect(group?.getAttribute('data-state')).toBe('closed');
    expect(group?.getAttribute('data-depth')).toBe('1');
  });

  it('outputs aria-level, data-depth, and optional level/setsize/posinset across nested depths', async () => {
    const { screen, render } = await createDOM();
    await render(
      <TreeView.Root defaultExpandedValue={['a', 'b']} aria-label="Nested">
        <TreeView.Item value="a" branch setsize={1} posinset={1}>
          <TreeView.ItemTrigger>A</TreeView.ItemTrigger>
          <TreeView.Group>
            <TreeView.Item value="b" branch level={4}>
              <TreeView.ItemTrigger>B</TreeView.ItemTrigger>
              <TreeView.Group>
                <TreeView.Item value="c">
                  <TreeView.ItemTrigger>C</TreeView.ItemTrigger>
                </TreeView.Item>
              </TreeView.Group>
            </TreeView.Item>
          </TreeView.Group>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const a = screen.querySelector('[data-value="a"]');
    const b = screen.querySelector('[data-value="b"]');
    const c = screen.querySelector('[data-value="c"]');

    expect(a?.getAttribute('aria-level')).toBe('1');
    expect(a?.getAttribute('aria-setsize')).toBe('1');
    expect(a?.getAttribute('aria-posinset')).toBe('1');
    expect(a?.getAttribute('data-depth')).toBe('0');

    expect(b?.getAttribute('aria-level')).toBe('4');
    expect(b?.getAttribute('data-depth')).toBe('1');

    expect(c?.getAttribute('aria-level')).toBe('3');
    expect(c?.getAttribute('data-depth')).toBe('2');
  });

  it('sets roving tabIndex on the first visible enabled item, or the selected item when provided', async () => {
    const { screen, render } = await createDOM();
    await render(
      <div>
        <TreeView.Root id="t1" defaultExpandedValue={[]} aria-label="Default tab stop">
          <TreeView.Item value="disabled-first" disabled>
            <TreeView.ItemTrigger>Disabled</TreeView.ItemTrigger>
          </TreeView.Item>
          <TreeView.Item value="folder" branch>
            <TreeView.ItemTrigger>Folder</TreeView.ItemTrigger>
            <TreeView.Group>
              <TreeView.Item value="child">
                <TreeView.ItemTrigger>Child</TreeView.ItemTrigger>
              </TreeView.Item>
            </TreeView.Group>
          </TreeView.Item>
          <TreeView.Item value="leaf">
            <TreeView.ItemTrigger>Leaf</TreeView.ItemTrigger>
          </TreeView.Item>
        </TreeView.Root>

        <TreeView.Root id="t2" defaultValue={['second']} aria-label="Selected tab stop">
          <TreeView.Item value="first">
            <TreeView.ItemTrigger>First</TreeView.ItemTrigger>
          </TreeView.Item>
          <TreeView.Item value="second">
            <TreeView.ItemTrigger>Second</TreeView.ItemTrigger>
          </TreeView.Item>
        </TreeView.Root>
      </div>,
    );

    expect(
      screen.querySelector('#t1 [data-value="disabled-first"]')?.getAttribute('tabindex'),
    ).toBe('-1');
    expect(screen.querySelector('#t1 [data-value="folder"]')?.getAttribute('tabindex')).toBe('0');
    expect(screen.querySelector('#t1 [data-value="child"]')?.getAttribute('tabindex')).toBe('-1');
    expect(screen.querySelector('#t1 [data-value="leaf"]')?.getAttribute('tabindex')).toBe('-1');

    expect(screen.querySelector('#t2 [data-value="first"]')?.getAttribute('tabindex')).toBe('-1');
    expect(screen.querySelector('#t2 [data-value="second"]')?.getAttribute('tabindex')).toBe('0');
  });

  it('selects single item and toggles branch expansion on ItemTrigger click', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <TreeView.Root aria-label="Files">
        <TreeView.Item value="src" branch>
          <TreeView.ItemTrigger class="src-trigger">
            <TreeView.ItemIndicator>{'>'}</TreeView.ItemIndicator>
            src
          </TreeView.ItemTrigger>
          <TreeView.Group>
            <TreeView.Item value="src/index.ts">
              <TreeView.ItemTrigger class="index-trigger">index.ts</TreeView.ItemTrigger>
            </TreeView.Item>
          </TreeView.Group>
        </TreeView.Item>
        <TreeView.Item value="readme">
          <TreeView.ItemTrigger class="readme-trigger">README.md</TreeView.ItemTrigger>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const src = screen.querySelector('[data-value="src"]');
    const srcTrigger = screen.querySelector('.src-trigger');
    const indicator = screen.querySelector('[data-leve-tree-view-item-indicator]');
    const group = screen.querySelector('[data-leve-tree-view-group]');
    const indexItem = screen.querySelector('[data-value="src/index.ts"]');
    const readme = screen.querySelector('[data-value="readme"]');

    await userEvent('.src-trigger', 'click');
    await flush();
    expect(src?.getAttribute('aria-selected')).toBe('true');
    expect(src?.getAttribute('aria-expanded')).toBe('true');
    expect(src?.getAttribute('data-state')).toBe('open');
    expect(src?.hasAttribute('data-selected')).toBe(true);
    expect(srcTrigger?.getAttribute('data-state')).toBe('open');
    expect(srcTrigger?.hasAttribute('data-selected')).toBe(true);
    expect(indicator?.getAttribute('data-state')).toBe('open');
    expect(indicator?.hasAttribute('data-selected')).toBe(true);
    expect(group?.hasAttribute('hidden')).toBe(false);
    expect(group?.getAttribute('data-state')).toBe('open');

    await userEvent('.index-trigger', 'click');
    expect(src?.getAttribute('aria-selected')).toBe('false');
    expect(src?.hasAttribute('data-selected')).toBe(false);
    expect(indexItem?.getAttribute('aria-selected')).toBe('true');
    expect(indexItem?.getAttribute('data-state')).toBe('checked');
    expect(indexItem?.hasAttribute('data-selected')).toBe(true);

    await userEvent('.readme-trigger', 'click');
    expect(indexItem?.getAttribute('aria-selected')).toBe('false');
    expect(readme?.getAttribute('aria-selected')).toBe('true');
    expect(readme?.getAttribute('data-state')).toBe('checked');

    // Clicking the branch trigger again collapses it while selecting it
    await userEvent('.src-trigger', 'click');
    expect(src?.getAttribute('aria-expanded')).toBe('false');
    expect(src?.getAttribute('aria-selected')).toBe('true');
    expect(group?.hasAttribute('hidden')).toBe(true);
  });

  it('supports multiple selection with aria-multiselectable="true"', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <TreeView.Root multiple defaultValue={['apple']} aria-label="Fruits">
        <TreeView.Item value="apple">
          <TreeView.ItemTrigger class="apple-trigger">Apple</TreeView.ItemTrigger>
        </TreeView.Item>
        <TreeView.Item value="banana">
          <TreeView.ItemTrigger class="banana-trigger">Banana</TreeView.ItemTrigger>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const root = screen.querySelector('[data-leve-tree-view]');
    const apple = screen.querySelector('[data-value="apple"]');
    const banana = screen.querySelector('[data-value="banana"]');

    expect(root?.getAttribute('aria-multiselectable')).toBe('true');
    expect(apple?.getAttribute('aria-selected')).toBe('true');
    expect(banana?.getAttribute('aria-selected')).toBe('false');

    await userEvent('.banana-trigger', 'click');
    expect(apple?.getAttribute('aria-selected')).toBe('true');
    expect(banana?.getAttribute('aria-selected')).toBe('true');

    await userEvent('.apple-trigger', 'click');
    expect(apple?.getAttribute('aria-selected')).toBe('false');
    expect(banana?.getAttribute('aria-selected')).toBe('true');
  });

  it('supports controlled bind:value, bind:expandedValue, and change callbacks', async () => {
    const ControlledTree = component$(() => {
      const value = useSignal<string[]>(['src']);
      const expanded = useSignal<string[]>([]);
      const valueLog = useSignal<string[]>([]);
      const expandedLog = useSignal<string[]>([]);

      return (
        <div>
          <button
            type="button"
            id="set-external"
            onClick$={() => {
              value.value = ['src/app.tsx'];
              expanded.value = ['src'];
            }}
          >
            Update
          </button>
          <TreeView.Root
            bind:value={value}
            bind:expandedValue={expanded}
            onValueChange$={(next) => {
              valueLog.value = [...valueLog.value, next.join(',')];
            }}
            onExpandedValueChange$={(next) => {
              expandedLog.value = [...expandedLog.value, next.join(',')];
            }}
            aria-label="Controlled files"
          >
            <TreeView.Item value="src" branch>
              <TreeView.ItemTrigger class="src-trigger">src</TreeView.ItemTrigger>
              <TreeView.Group>
                <TreeView.Item value="src/app.tsx">
                  <TreeView.ItemTrigger class="app-trigger">app.tsx</TreeView.ItemTrigger>
                </TreeView.Item>
              </TreeView.Group>
            </TreeView.Item>
            <TreeView.Item value="readme">
              <TreeView.ItemTrigger class="readme-trigger">README.md</TreeView.ItemTrigger>
            </TreeView.Item>
          </TreeView.Root>
          <output id="val-log">{valueLog.value.join(';')}</output>
          <output id="exp-log">{expandedLog.value.join(';')}</output>
        </div>
      );
    });

    const { screen, render, userEvent } = await createDOM();
    await render(<ControlledTree />);

    const src = screen.querySelector('[data-value="src"]');
    const app = screen.querySelector('[data-value="src/app.tsx"]');
    const readme = screen.querySelector('[data-value="readme"]');

    expect(src?.getAttribute('aria-selected')).toBe('true');
    expect(src?.getAttribute('aria-expanded')).toBe('false');

    await userEvent('.readme-trigger', 'click');
    expect(readme?.getAttribute('aria-selected')).toBe('true');
    expect(screen.querySelector('#val-log')?.textContent).toBe('readme');

    // Clicking an already-selected single item does not emit duplicate onValueChange$
    await userEvent('.readme-trigger', 'click');
    expect(screen.querySelector('#val-log')?.textContent).toBe('readme');

    await userEvent('.src-trigger', 'click');
    expect(src?.getAttribute('aria-expanded')).toBe('true');
    expect(screen.querySelector('#val-log')?.textContent).toBe('readme;src');
    expect(screen.querySelector('#exp-log')?.textContent).toBe('src');

    // External signal update reflects immediately without triggering onChange$
    await userEvent('#set-external', 'click');
    expect(app?.getAttribute('aria-selected')).toBe('true');
    expect(src?.getAttribute('aria-expanded')).toBe('true');
    expect(screen.querySelector('#val-log')?.textContent).toBe('readme;src');
  });

  it('propagates disabled from Root and branch Item and ignores clicks', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <div>
        <TreeView.Root id="disabled-root" disabled aria-label="Disabled root">
          <TreeView.Item value="a" branch>
            <TreeView.ItemTrigger class="root-disabled-trigger">
              <TreeView.ItemIndicator>{'>'}</TreeView.ItemIndicator>A
            </TreeView.ItemTrigger>
            <TreeView.Group>
              <TreeView.Item value="b">
                <TreeView.ItemTrigger>B</TreeView.ItemTrigger>
              </TreeView.Item>
            </TreeView.Group>
          </TreeView.Item>
        </TreeView.Root>

        <TreeView.Root id="disabled-item-tree" defaultExpandedValue={['x']} aria-label="Mixed">
          <TreeView.Item value="x" branch disabled>
            <TreeView.ItemTrigger class="disabled-branch-trigger">X</TreeView.ItemTrigger>
            <TreeView.Group>
              <TreeView.Item value="y">
                <TreeView.ItemTrigger class="inherited-disabled-trigger">Y</TreeView.ItemTrigger>
              </TreeView.Item>
            </TreeView.Group>
          </TreeView.Item>
        </TreeView.Root>
      </div>,
    );

    const disabledRoot = screen.querySelector('#disabled-root');
    const rootItemA = screen.querySelector('#disabled-root [data-value="a"]');
    const rootTriggerA = screen.querySelector('.root-disabled-trigger');
    expect(disabledRoot?.getAttribute('aria-disabled')).toBe('true');
    expect(disabledRoot?.hasAttribute('data-disabled')).toBe(true);
    expect(rootItemA?.getAttribute('aria-disabled')).toBe('true');
    expect(rootItemA?.getAttribute('tabindex')).toBe('-1');
    expect(rootTriggerA?.hasAttribute('data-disabled')).toBe(true);

    await userEvent('.root-disabled-trigger', 'click');
    expect(rootItemA?.getAttribute('aria-selected')).toBe('false');
    expect(rootItemA?.getAttribute('aria-expanded')).toBe('false');

    const itemX = screen.querySelector('#disabled-item-tree [data-value="x"]');
    const groupX = screen.querySelector('#disabled-item-tree [data-leve-tree-view-group]');
    const itemY = screen.querySelector('#disabled-item-tree [data-value="y"]');

    expect(itemX?.getAttribute('aria-disabled')).toBe('true');
    expect(itemX?.getAttribute('tabindex')).toBe('-1');
    expect(groupX?.hasAttribute('data-disabled')).toBe(true);
    expect(itemY?.getAttribute('aria-disabled')).toBe('true');
    expect(itemY?.getAttribute('tabindex')).toBe('-1');

    await userEvent('.disabled-branch-trigger', 'click');
    await userEvent('.inherited-disabled-trigger', 'click');
    expect(itemX?.getAttribute('aria-selected')).toBe('false');
    expect(itemY?.getAttribute('aria-selected')).toBe('false');
  });

  it('handles keyboard actions for Enter, Space, ArrowRight, ArrowLeft, and *', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <TreeView.Root aria-label="Keyboard tree">
        <TreeView.Item value="docs" branch>
          <TreeView.ItemTrigger>docs</TreeView.ItemTrigger>
          <TreeView.Group>
            <TreeView.Item value="docs/nested" branch>
              <TreeView.ItemTrigger>nested</TreeView.ItemTrigger>
            </TreeView.Item>
          </TreeView.Group>
        </TreeView.Item>
        <TreeView.Item value="src" branch>
          <TreeView.ItemTrigger>
            <TreeView.ItemIndicator>+</TreeView.ItemIndicator>
            src
          </TreeView.ItemTrigger>
          <TreeView.Group>
            <TreeView.Item value="src/index.ts">
              <TreeView.ItemTrigger>index.ts</TreeView.ItemTrigger>
            </TreeView.Item>
          </TreeView.Group>
        </TreeView.Item>
        <TreeView.Item value="readme" textValue="Readme">
          <TreeView.ItemTrigger>01 - Readme</TreeView.ItemTrigger>
        </TreeView.Item>
        <TreeView.Item value="disabled-branch" branch disabled>
          <TreeView.ItemTrigger>disabled</TreeView.ItemTrigger>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const docs = screen.querySelector('[data-value="docs"]');
    const nested = screen.querySelector('[data-value="docs/nested"]');
    const src = screen.querySelector('[data-value="src"]');
    const readme = screen.querySelector('[data-value="readme"]');
    const disabledBranch = screen.querySelector('[data-value="disabled-branch"]');

    await userEvent(docs, 'keydown', { key: 'ArrowRight', target: docs });
    await flush();
    expect(docs?.getAttribute('aria-expanded')).toBe('true');

    // ArrowRight on open branch updates roving tabIndex to first enabled child
    await userEvent(docs, 'keydown', { key: 'ArrowRight', target: docs });
    await flush();
    expect(nested?.getAttribute('tabindex')).toBe('0');
    expect(docs?.getAttribute('tabindex')).toBe('-1');

    // ArrowLeft on closed child moves roving tabIndex back to parent
    await userEvent(nested, 'keydown', { key: 'ArrowLeft', target: nested });
    await flush();
    expect(docs?.getAttribute('tabindex')).toBe('0');

    await userEvent(docs, 'keydown', { key: 'ArrowLeft', target: docs });
    await flush();
    expect(docs?.getAttribute('aria-expanded')).toBe('false');

    await userEvent(docs, 'keydown', { key: 'Enter', target: docs });
    await flush();
    expect(docs?.getAttribute('aria-selected')).toBe('true');

    await userEvent(src, 'keydown', { key: ' ', target: src });
    await flush();
    expect(src?.getAttribute('aria-selected')).toBe('true');
    expect(docs?.getAttribute('aria-selected')).toBe('false');

    // * expands all closed enabled sibling branches at the same level, skipping nested & disabled branches
    await userEvent(docs, 'keydown', { key: '*', target: docs });
    await flush();
    expect(docs?.getAttribute('aria-expanded')).toBe('true');
    expect(src?.getAttribute('aria-expanded')).toBe('true');
    expect(nested?.getAttribute('aria-expanded')).toBe('false');
    expect(disabledBranch?.getAttribute('aria-expanded')).toBe('false');

    // Typeahead ignores ItemIndicator text and matches visible label / textValue
    await userEvent(docs, 'keydown', { key: 's', target: docs });
    await flush();
    expect(src?.getAttribute('tabindex')).toBe('0');

    // Navigation key resets the typeahead buffer, then typing 'r' matches textValue="Readme"
    await userEvent(src, 'keydown', { key: 'ArrowDown', target: src });
    await flush();
    await userEvent(src, 'keydown', { key: 'r', target: src });
    await flush();
    expect(readme?.getAttribute('tabindex')).toBe('0');
  });

  it('navigates ArrowDown, ArrowUp, and Typeahead across nested items without parent-containment confusion', async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(
      <TreeView.Root defaultExpandedValue={['src']} aria-label="Nested navigation">
        <TreeView.Item value="src" branch>
          <TreeView.ItemTrigger>src</TreeView.ItemTrigger>
          <TreeView.Group>
            <TreeView.Item value="src/components" branch>
              <TreeView.ItemTrigger>components</TreeView.ItemTrigger>
              <TreeView.Group>
                <TreeView.Item value="src/components/button.tsx">
                  <TreeView.ItemTrigger>button.tsx</TreeView.ItemTrigger>
                </TreeView.Item>
              </TreeView.Group>
            </TreeView.Item>
            <TreeView.Item value="src/index.ts">
              <TreeView.ItemTrigger>index.ts</TreeView.ItemTrigger>
            </TreeView.Item>
            <TreeView.Item value="src/utils.ts">
              <TreeView.ItemTrigger>utils.ts</TreeView.ItemTrigger>
            </TreeView.Item>
          </TreeView.Group>
        </TreeView.Item>
        <TreeView.Item value="package.json">
          <TreeView.ItemTrigger>package.json</TreeView.ItemTrigger>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const src = screen.querySelector('[data-value="src"]');
    const components = screen.querySelector('[data-value="src/components"]');
    const indexTs = screen.querySelector('[data-value="src/index.ts"]');
    const utilsTs = screen.querySelector('[data-value="src/utils.ts"]');
    const pkg = screen.querySelector('[data-value="package.json"]');

    // ArrowDown from depth-0 'src' -> depth-1 'src/components'
    await userEvent(src, 'keydown', { key: 'ArrowDown', target: src });
    await flush();
    expect(components?.getAttribute('tabindex')).toBe('0');

    // ArrowDown from depth-1 collapsed branch 'src/components' skips 'button.tsx' -> 'src/index.ts'
    await userEvent(components, 'keydown', { key: 'ArrowDown', target: components });
    await flush();
    expect(indexTs?.getAttribute('tabindex')).toBe('0');

    // ArrowDown from depth-1 'src/index.ts' -> depth-1 'src/utils.ts'
    await userEvent(indexTs, 'keydown', { key: 'ArrowDown', target: indexTs });
    await flush();
    expect(utilsTs?.getAttribute('tabindex')).toBe('0');

    // ArrowDown from last child 'src/utils.ts' -> depth-0 'package.json'
    await userEvent(utilsTs, 'keydown', { key: 'ArrowDown', target: utilsTs });
    await flush();
    expect(pkg?.getAttribute('tabindex')).toBe('0');

    // ArrowUp from depth-0 'package.json' -> depth-1 'src/utils.ts'
    await userEvent(pkg, 'keydown', { key: 'ArrowUp', target: pkg });
    await flush();
    expect(utilsTs?.getAttribute('tabindex')).toBe('0');

    // Typeahead from nested 'src/components' skips parent 'src' and finds next match 'src/index.ts'
    await userEvent(components, 'keydown', { key: 'i', target: components });
    await flush();
    expect(indexTs?.getAttribute('tabindex')).toBe('0');

    // Boundary ArrowUp on first item does not invoke focus() or move tabIndex
    const srcFocusSpy = vi.spyOn(src as HTMLElement, 'focus');
    await userEvent(src, 'keydown', { key: 'ArrowUp', target: src });
    await flush();
    expect(srcFocusSpy).not.toHaveBeenCalled();
  });

  it('forwards arbitrary props and does not leak library-specific props as HTML attributes', async () => {
    const { screen, render } = await createDOM();
    await render(
      <TreeView.Root
        multiple
        defaultValue={['item-1']}
        defaultExpandedValue={['item-1']}
        class="custom-root"
        aria-label="Custom tree"
      >
        <TreeView.Item
          value="item-1"
          branch
          textValue="First item"
          level={1}
          setsize={1}
          posinset={1}
          class="custom-item"
          data-custom="item"
        >
          <TreeView.ItemTrigger class="custom-trigger">
            <TreeView.ItemIndicator class="custom-indicator">+</TreeView.ItemIndicator>
            Item 1
          </TreeView.ItemTrigger>
          <TreeView.Group class="custom-group">
            <TreeView.Item value="child-1">
              <TreeView.ItemTrigger>Child 1</TreeView.ItemTrigger>
            </TreeView.Item>
          </TreeView.Group>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const root = screen.querySelector('[data-leve-tree-view]');
    const item = screen.querySelector('[data-value="item-1"]');
    const trigger = screen.querySelector('[data-leve-tree-view-item-trigger]');
    const indicator = screen.querySelector('[data-leve-tree-view-item-indicator]');
    const group = screen.querySelector('[data-leve-tree-view-group]');

    expect(root?.classList.contains('custom-root')).toBe(true);
    expect(root?.getAttribute('aria-label')).toBe('Custom tree');
    expect(root?.hasAttribute('multiple')).toBe(false);
    expect(root?.hasAttribute('defaultvalue')).toBe(false);
    expect(root?.hasAttribute('defaultexpandedvalue')).toBe(false);

    expect(item?.classList.contains('custom-item')).toBe(true);
    expect(item?.getAttribute('data-custom')).toBe('item');
    expect(item?.getAttribute('data-text-value')).toBe('First item');
    expect(item?.hasAttribute('value')).toBe(false);
    expect(item?.hasAttribute('branch')).toBe(false);
    expect(item?.hasAttribute('textvalue')).toBe(false);
    expect(item?.hasAttribute('level')).toBe(false);
    expect(item?.hasAttribute('setsize')).toBe(false);
    expect(item?.hasAttribute('posinset')).toBe(false);

    expect(trigger?.classList.contains('custom-trigger')).toBe(true);
    expect(indicator?.classList.contains('custom-indicator')).toBe(true);
    expect(group?.classList.contains('custom-group')).toBe(true);
  });
});
