import { component$, useStyles$ } from '@builder.io/qwik';
import { TreeView } from '@leve-ui/tree-view';
import { LuChevronRight, LuFile, LuFolder } from '@qwikest/icons/lucide';
import styles from './disabled.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <div class="tree-view-disabled-wrapper">
      <TreeView.Root
        aria-label="Workspace files"
        defaultExpandedValue={['src']}
        class="tree-view-disabled"
      >
        <TreeView.Item value="lockfile" disabled class="tree-view-disabled-item">
          <TreeView.ItemTrigger class="tree-view-disabled-trigger">
            <LuFile class="tree-view-disabled-icon" aria-hidden="true" />
            <span>pnpm-lock.yaml</span>
          </TreeView.ItemTrigger>
        </TreeView.Item>

        <TreeView.Item value="src" branch class="tree-view-disabled-item">
          <TreeView.ItemTrigger class="tree-view-disabled-trigger">
            <TreeView.ItemIndicator class="tree-view-disabled-indicator">
              <LuChevronRight class="tree-view-disabled-chevron" aria-hidden="true" />
            </TreeView.ItemIndicator>
            <LuFolder class="tree-view-disabled-icon" aria-hidden="true" />
            <span>src</span>
          </TreeView.ItemTrigger>
          <TreeView.Group class="tree-view-disabled-group">
            <TreeView.Item value="src/secret.ts" disabled class="tree-view-disabled-item">
              <TreeView.ItemTrigger class="tree-view-disabled-trigger">
                <LuFile class="tree-view-disabled-icon" aria-hidden="true" />
                <span>secret.ts</span>
              </TreeView.ItemTrigger>
            </TreeView.Item>
            <TreeView.Item value="src/main.ts" class="tree-view-disabled-item">
              <TreeView.ItemTrigger class="tree-view-disabled-trigger">
                <LuFile class="tree-view-disabled-icon" aria-hidden="true" />
                <span>main.ts</span>
              </TreeView.ItemTrigger>
            </TreeView.Item>
          </TreeView.Group>
        </TreeView.Item>

        <TreeView.Item value="node_modules" branch disabled class="tree-view-disabled-item">
          <TreeView.ItemTrigger class="tree-view-disabled-trigger">
            <TreeView.ItemIndicator class="tree-view-disabled-indicator">
              <LuChevronRight class="tree-view-disabled-chevron" aria-hidden="true" />
            </TreeView.ItemIndicator>
            <LuFolder class="tree-view-disabled-icon" aria-hidden="true" />
            <span>node_modules</span>
          </TreeView.ItemTrigger>
          <TreeView.Group class="tree-view-disabled-group">
            <TreeView.Item value="node_modules/pkg" class="tree-view-disabled-item">
              <TreeView.ItemTrigger class="tree-view-disabled-trigger">
                <LuFile class="tree-view-disabled-icon" aria-hidden="true" />
                <span>pkg</span>
              </TreeView.ItemTrigger>
            </TreeView.Item>
          </TreeView.Group>
        </TreeView.Item>

        <TreeView.Item value="README.md" class="tree-view-disabled-item">
          <TreeView.ItemTrigger class="tree-view-disabled-trigger">
            <LuFile class="tree-view-disabled-icon" aria-hidden="true" />
            <span>README.md</span>
          </TreeView.ItemTrigger>
        </TreeView.Item>

        <TreeView.Item value="archived" disabled class="tree-view-disabled-item">
          <TreeView.ItemTrigger class="tree-view-disabled-trigger">
            <LuFile class="tree-view-disabled-icon" aria-hidden="true" />
            <span>archived.txt</span>
          </TreeView.ItemTrigger>
        </TreeView.Item>
      </TreeView.Root>

      <TreeView.Root disabled aria-label="Disabled tree" class="tree-view-disabled">
        <TreeView.Item value="config" class="tree-view-disabled-item">
          <TreeView.ItemTrigger class="tree-view-disabled-trigger">
            <LuFile class="tree-view-disabled-icon" aria-hidden="true" />
            <span>config.json</span>
          </TreeView.ItemTrigger>
        </TreeView.Item>
      </TreeView.Root>
    </div>
  );
});
