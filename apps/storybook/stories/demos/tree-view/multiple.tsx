import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { TreeView } from '@leve-ui/tree-view';
import { LuCheck, LuChevronRight, LuFile, LuFolder } from '@qwikest/icons/lucide';
import styles from './multiple.css?inline';

export default component$(() => {
  useStyles$(styles);
  const selected = useSignal<string[]>(['apple', 'carrot']);

  return (
    <div class="tree-view-multiple-wrapper">
      <TreeView.Root
        multiple
        bind:value={selected}
        defaultExpandedValue={['fruits', 'vegetables']}
        aria-label="Produce"
        class="tree-view-multiple"
      >
        <TreeView.Item value="fruits" branch class="tree-view-multiple-item">
          <TreeView.ItemTrigger class="tree-view-multiple-trigger">
            <TreeView.ItemIndicator class="tree-view-multiple-indicator">
              <LuChevronRight class="tree-view-multiple-chevron" aria-hidden="true" />
            </TreeView.ItemIndicator>
            <LuFolder class="tree-view-multiple-icon" aria-hidden="true" />
            <span>Fruits</span>
          </TreeView.ItemTrigger>
          <TreeView.Group class="tree-view-multiple-group">
            <TreeView.Item value="apple" class="tree-view-multiple-item">
              <TreeView.ItemTrigger class="tree-view-multiple-trigger">
                <LuFile class="tree-view-multiple-icon" aria-hidden="true" />
                <span class="tree-view-multiple-label">Apple</span>
                <TreeView.ItemIndicator class="tree-view-multiple-check">
                  <LuCheck class="tree-view-multiple-icon" aria-hidden="true" />
                </TreeView.ItemIndicator>
              </TreeView.ItemTrigger>
            </TreeView.Item>
            <TreeView.Item value="banana" class="tree-view-multiple-item">
              <TreeView.ItemTrigger class="tree-view-multiple-trigger">
                <LuFile class="tree-view-multiple-icon" aria-hidden="true" />
                <span class="tree-view-multiple-label">Banana</span>
                <TreeView.ItemIndicator class="tree-view-multiple-check">
                  <LuCheck class="tree-view-multiple-icon" aria-hidden="true" />
                </TreeView.ItemIndicator>
              </TreeView.ItemTrigger>
            </TreeView.Item>
          </TreeView.Group>
        </TreeView.Item>

        <TreeView.Item value="vegetables" branch class="tree-view-multiple-item">
          <TreeView.ItemTrigger class="tree-view-multiple-trigger">
            <TreeView.ItemIndicator class="tree-view-multiple-indicator">
              <LuChevronRight class="tree-view-multiple-chevron" aria-hidden="true" />
            </TreeView.ItemIndicator>
            <LuFolder class="tree-view-multiple-icon" aria-hidden="true" />
            <span>Vegetables</span>
          </TreeView.ItemTrigger>
          <TreeView.Group class="tree-view-multiple-group">
            <TreeView.Item value="carrot" class="tree-view-multiple-item">
              <TreeView.ItemTrigger class="tree-view-multiple-trigger">
                <LuFile class="tree-view-multiple-icon" aria-hidden="true" />
                <span class="tree-view-multiple-label">Carrot</span>
                <TreeView.ItemIndicator class="tree-view-multiple-check">
                  <LuCheck class="tree-view-multiple-icon" aria-hidden="true" />
                </TreeView.ItemIndicator>
              </TreeView.ItemTrigger>
            </TreeView.Item>
            <TreeView.Item value="spinach" class="tree-view-multiple-item">
              <TreeView.ItemTrigger class="tree-view-multiple-trigger">
                <LuFile class="tree-view-multiple-icon" aria-hidden="true" />
                <span class="tree-view-multiple-label">Spinach</span>
                <TreeView.ItemIndicator class="tree-view-multiple-check">
                  <LuCheck class="tree-view-multiple-icon" aria-hidden="true" />
                </TreeView.ItemIndicator>
              </TreeView.ItemTrigger>
            </TreeView.Item>
          </TreeView.Group>
        </TreeView.Item>
      </TreeView.Root>

      <p class="tree-view-multiple-status">
        Selected: {selected.value.length > 0 ? selected.value.join(', ') : 'none'}
      </p>
    </div>
  );
});
