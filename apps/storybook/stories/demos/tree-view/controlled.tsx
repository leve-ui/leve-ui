import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { TreeView } from '@leve-ui/tree-view';
import { LuChevronRight, LuFile, LuFolder } from '@qwikest/icons/lucide';
import styles from './controlled.css?inline';

export default component$(() => {
  useStyles$(styles);
  const selected = useSignal<string[]>(['src/index.ts']);
  const expanded = useSignal<string[]>(['src']);

  return (
    <div class="tree-view-controlled-wrapper">
      <div class="tree-view-controlled-actions">
        <button
          type="button"
          class="tree-view-controlled-button"
          onClick$={() => {
            expanded.value = ['src', 'docs'];
          }}
        >
          Expand all
        </button>
        <button
          type="button"
          class="tree-view-controlled-button"
          onClick$={() => {
            expanded.value = [];
          }}
        >
          Collapse all
        </button>
        <button
          type="button"
          class="tree-view-controlled-button"
          onClick$={() => {
            selected.value = [];
          }}
        >
          Clear selection
        </button>
      </div>

      <TreeView.Root
        bind:value={selected}
        bind:expandedValue={expanded}
        aria-label="Controlled files"
        class="tree-view-controlled"
      >
        <TreeView.Item value="src" branch class="tree-view-controlled-item">
          <TreeView.ItemTrigger class="tree-view-controlled-trigger">
            <TreeView.ItemIndicator class="tree-view-controlled-indicator">
              <LuChevronRight class="tree-view-controlled-chevron" aria-hidden="true" />
            </TreeView.ItemIndicator>
            <LuFolder class="tree-view-controlled-icon" aria-hidden="true" />
            <span>src</span>
          </TreeView.ItemTrigger>
          <TreeView.Group class="tree-view-controlled-group">
            <TreeView.Item value="src/index.ts" class="tree-view-controlled-item">
              <TreeView.ItemTrigger class="tree-view-controlled-trigger">
                <LuFile class="tree-view-controlled-icon" aria-hidden="true" />
                <span>index.ts</span>
              </TreeView.ItemTrigger>
            </TreeView.Item>
            <TreeView.Item value="src/app.tsx" class="tree-view-controlled-item">
              <TreeView.ItemTrigger class="tree-view-controlled-trigger">
                <LuFile class="tree-view-controlled-icon" aria-hidden="true" />
                <span>app.tsx</span>
              </TreeView.ItemTrigger>
            </TreeView.Item>
          </TreeView.Group>
        </TreeView.Item>

        <TreeView.Item value="docs" branch class="tree-view-controlled-item">
          <TreeView.ItemTrigger class="tree-view-controlled-trigger">
            <TreeView.ItemIndicator class="tree-view-controlled-indicator">
              <LuChevronRight class="tree-view-controlled-chevron" aria-hidden="true" />
            </TreeView.ItemIndicator>
            <LuFolder class="tree-view-controlled-icon" aria-hidden="true" />
            <span>docs</span>
          </TreeView.ItemTrigger>
          <TreeView.Group class="tree-view-controlled-group">
            <TreeView.Item value="docs/intro.md" class="tree-view-controlled-item">
              <TreeView.ItemTrigger class="tree-view-controlled-trigger">
                <LuFile class="tree-view-controlled-icon" aria-hidden="true" />
                <span>intro.md</span>
              </TreeView.ItemTrigger>
            </TreeView.Item>
          </TreeView.Group>
        </TreeView.Item>
      </TreeView.Root>

      <div class="tree-view-controlled-status">
        <p class="tree-view-controlled-status-line">
          Selected: {selected.value.length > 0 ? selected.value.join(', ') : 'none'}
        </p>
        <p class="tree-view-controlled-status-line">
          Expanded: {expanded.value.length > 0 ? expanded.value.join(', ') : 'none'}
        </p>
      </div>
    </div>
  );
});
