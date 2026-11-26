import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { TagsInput } from '@leve-ui/tags-input';
import { LuX } from '@qwikest/icons/lucide';
import styles from './editable.css?inline';

export default component$(() => {
  useStyles$(styles);
  const tags = useSignal<string[]>(['alpha', 'beta', 'gamma']);

  return (
    <TagsInput.Root bind:value={tags} editable class="tags-input-editable">
      <TagsInput.Label class="tags-input-editable-label">
        Editable tags (double-click or press Enter/F2 on a highlighted tag)
      </TagsInput.Label>
      <TagsInput.Control class="tags-input-editable-control">
        {tags.value.map((tag, index) => (
          <TagsInput.Item
            key={`${tag}-${index}`}
            index={index}
            value={tag}
            class="tags-input-editable-item"
          >
            <TagsInput.ItemPreview class="tags-input-editable-item-preview">
              <TagsInput.ItemText>{tag}</TagsInput.ItemText>
              <TagsInput.ItemDeleteTrigger class="tags-input-editable-item-delete">
                <LuX aria-hidden="true" />
              </TagsInput.ItemDeleteTrigger>
            </TagsInput.ItemPreview>
            <TagsInput.ItemInput class="tags-input-editable-item-input" />
          </TagsInput.Item>
        ))}
        <TagsInput.Input placeholder="Add tag..." class="tags-input-editable-input" />
      </TagsInput.Control>
    </TagsInput.Root>
  );
});
