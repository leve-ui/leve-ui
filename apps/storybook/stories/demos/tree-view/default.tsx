import { component$, useStyles$ } from '@builder.io/qwik';
import { TreeView } from '@leve-ui/tree-view';
import { LuChevronRight, LuFile, LuFolder } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <TreeView.Root
      aria-label="Project files"
      defaultExpandedValue={['src']}
      defaultValue={['src/index.ts']}
      class="tree-view-default"
    >
      <TreeView.Item value="src" branch class="tree-view-default-item">
        <TreeView.ItemTrigger class="tree-view-default-trigger">
          <TreeView.ItemIndicator class="tree-view-default-indicator">
            <LuChevronRight class="tree-view-default-chevron" aria-hidden="true" />
          </TreeView.ItemIndicator>
          <LuFolder class="tree-view-default-icon" aria-hidden="true" />
          <span>src</span>
        </TreeView.ItemTrigger>
        <TreeView.Group class="tree-view-default-group">
          <TreeView.Item value="src/components" branch class="tree-view-default-item">
            <TreeView.ItemTrigger class="tree-view-default-trigger">
              <TreeView.ItemIndicator class="tree-view-default-indicator">
                <LuChevronRight class="tree-view-default-chevron" aria-hidden="true" />
              </TreeView.ItemIndicator>
              <LuFolder class="tree-view-default-icon" aria-hidden="true" />
              <span>components</span>
            </TreeView.ItemTrigger>
            <TreeView.Group class="tree-view-default-group">
              <TreeView.Item value="src/components/button.tsx" class="tree-view-default-item">
                <TreeView.ItemTrigger class="tree-view-default-trigger">
                  <LuFile class="tree-view-default-icon" aria-hidden="true" />
                  <span>button.tsx</span>
                </TreeView.ItemTrigger>
              </TreeView.Item>
              <TreeView.Item value="src/components/dialog.tsx" class="tree-view-default-item">
                <TreeView.ItemTrigger class="tree-view-default-trigger">
                  <LuFile class="tree-view-default-icon" aria-hidden="true" />
                  <span>dialog.tsx</span>
                </TreeView.ItemTrigger>
              </TreeView.Item>
            </TreeView.Group>
          </TreeView.Item>
          <TreeView.Item value="src/index.ts" class="tree-view-default-item">
            <TreeView.ItemTrigger class="tree-view-default-trigger">
              <LuFile class="tree-view-default-icon" aria-hidden="true" />
              <span>index.ts</span>
            </TreeView.ItemTrigger>
          </TreeView.Item>
          <TreeView.Item value="src/utils.ts" class="tree-view-default-item">
            <TreeView.ItemTrigger class="tree-view-default-trigger">
              <LuFile class="tree-view-default-icon" aria-hidden="true" />
              <span>utils.ts</span>
            </TreeView.ItemTrigger>
          </TreeView.Item>
        </TreeView.Group>
      </TreeView.Item>

      <TreeView.Item value="docs" branch class="tree-view-default-item">
        <TreeView.ItemTrigger class="tree-view-default-trigger">
          <TreeView.ItemIndicator class="tree-view-default-indicator">
            <LuChevronRight class="tree-view-default-chevron" aria-hidden="true" />
          </TreeView.ItemIndicator>
          <LuFolder class="tree-view-default-icon" aria-hidden="true" />
          <span>docs</span>
        </TreeView.ItemTrigger>
        <TreeView.Group class="tree-view-default-group">
          <TreeView.Item value="docs/getting-started.md" class="tree-view-default-item">
            <TreeView.ItemTrigger class="tree-view-default-trigger">
              <LuFile class="tree-view-default-icon" aria-hidden="true" />
              <span>getting-started.md</span>
            </TreeView.ItemTrigger>
          </TreeView.Item>
          <TreeView.Item value="docs/guide.md" class="tree-view-default-item">
            <TreeView.ItemTrigger class="tree-view-default-trigger">
              <LuFile class="tree-view-default-icon" aria-hidden="true" />
              <span>guide.md</span>
            </TreeView.ItemTrigger>
          </TreeView.Item>
        </TreeView.Group>
      </TreeView.Item>

      <TreeView.Item value="tests" branch class="tree-view-default-item">
        <TreeView.ItemTrigger class="tree-view-default-trigger">
          <TreeView.ItemIndicator class="tree-view-default-indicator">
            <LuChevronRight class="tree-view-default-chevron" aria-hidden="true" />
          </TreeView.ItemIndicator>
          <LuFolder class="tree-view-default-icon" aria-hidden="true" />
          <span>tests</span>
        </TreeView.ItemTrigger>
        <TreeView.Group class="tree-view-default-group">
          <TreeView.Item value="tests/app.test.ts" class="tree-view-default-item">
            <TreeView.ItemTrigger class="tree-view-default-trigger">
              <LuFile class="tree-view-default-icon" aria-hidden="true" />
              <span>app.test.ts</span>
            </TreeView.ItemTrigger>
          </TreeView.Item>
        </TreeView.Group>
      </TreeView.Item>

      <TreeView.Item value="package.json" class="tree-view-default-item">
        <TreeView.ItemTrigger class="tree-view-default-trigger">
          <LuFile class="tree-view-default-icon" aria-hidden="true" />
          <span>package.json</span>
        </TreeView.ItemTrigger>
      </TreeView.Item>
      <TreeView.Item value="README.md" class="tree-view-default-item">
        <TreeView.ItemTrigger class="tree-view-default-trigger">
          <LuFile class="tree-view-default-icon" aria-hidden="true" />
          <span>README.md</span>
        </TreeView.ItemTrigger>
      </TreeView.Item>
    </TreeView.Root>
  );
});
