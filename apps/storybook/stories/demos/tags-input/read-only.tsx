import { component$, useStyles$ } from '@builder.io/qwik';
import { TagsInput } from '@leve-ui/tags-input';
import { LuX } from '@qwikest/icons/lucide';
import styles from './read-only.css?inline';

export default component$(() => {
  useStyles$(styles);
  const tags = ['Qwik', 'TypeScript'];

  return (
    <TagsInput.Root defaultValue={tags} readOnly class="tags-input-read-only">
      <TagsInput.Label class="tags-input-read-only-label">Tags (read-only)</TagsInput.Label>
      <TagsInput.Control class="tags-input-read-only-control">
        {tags.map((tag, index) => (
          <TagsInput.Item
            key={`${tag}-${index}`}
            index={index}
            value={tag}
            class="tags-input-read-only-item"
          >
            <TagsInput.ItemPreview class="tags-input-read-only-item-preview">
              <TagsInput.ItemText>{tag}</TagsInput.ItemText>
              <TagsInput.ItemDeleteTrigger class="tags-input-read-only-item-delete">
                <LuX aria-hidden="true" />
              </TagsInput.ItemDeleteTrigger>
            </TagsInput.ItemPreview>
          </TagsInput.Item>
        ))}
        <TagsInput.Input placeholder="Read-only" class="tags-input-read-only-input" />
      </TagsInput.Control>
    </TagsInput.Root>
  );
});
