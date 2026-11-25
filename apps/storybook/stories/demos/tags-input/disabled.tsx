import { component$, useStyles$ } from '@builder.io/qwik';
import { TagsInput } from '@leve-ui/tags-input';
import { LuX } from '@qwikest/icons/lucide';
import styles from './disabled.css?inline';

export default component$(() => {
  useStyles$(styles);
  const tags = ['Qwik', 'TypeScript'];

  return (
    <TagsInput.Root defaultValue={tags} disabled class="tags-input-disabled">
      <TagsInput.Label class="tags-input-disabled-label">Tags (disabled)</TagsInput.Label>
      <TagsInput.Control class="tags-input-disabled-control">
        {tags.map((tag, index) => (
          <TagsInput.Item
            key={`${tag}-${index}`}
            index={index}
            value={tag}
            class="tags-input-disabled-item"
          >
            <TagsInput.ItemPreview class="tags-input-disabled-item-preview">
              <TagsInput.ItemText>{tag}</TagsInput.ItemText>
              <TagsInput.ItemDeleteTrigger class="tags-input-disabled-item-delete">
                <LuX aria-hidden="true" />
              </TagsInput.ItemDeleteTrigger>
            </TagsInput.ItemPreview>
          </TagsInput.Item>
        ))}
        <TagsInput.Input placeholder="Add tag..." class="tags-input-disabled-input" />
      </TagsInput.Control>
    </TagsInput.Root>
  );
});
