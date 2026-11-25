import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { TagsInput } from '@leve-ui/tags-input';
import { LuX } from '@qwikest/icons/lucide';
import styles from './default.css?inline';

export default component$(() => {
  useStyles$(styles);
  const tags = useSignal<string[]>(['Qwik', 'TypeScript']);

  return (
    <TagsInput.Root bind:value={tags} class="tags-input-default">
      <TagsInput.Label class="tags-input-default-label">Frameworks</TagsInput.Label>
      <TagsInput.Control class="tags-input-default-control">
        {tags.value.map((tag, index) => (
          <TagsInput.Item
            key={`${tag}-${index}`}
            index={index}
            value={tag}
            class="tags-input-default-item"
          >
            <TagsInput.ItemPreview class="tags-input-default-item-preview">
              <TagsInput.ItemText class="tags-input-default-item-text">{tag}</TagsInput.ItemText>
              <TagsInput.ItemDeleteTrigger class="tags-input-default-item-delete">
                <LuX aria-hidden="true" />
              </TagsInput.ItemDeleteTrigger>
            </TagsInput.ItemPreview>
            <TagsInput.ItemInput class="tags-input-default-item-input" />
          </TagsInput.Item>
        ))}
        <TagsInput.Input placeholder="Add framework..." class="tags-input-default-input" />
        <TagsInput.ClearTrigger class="tags-input-default-clear" aria-label="Clear all tags">
          <LuX aria-hidden="true" />
        </TagsInput.ClearTrigger>
      </TagsInput.Control>
    </TagsInput.Root>
  );
});
