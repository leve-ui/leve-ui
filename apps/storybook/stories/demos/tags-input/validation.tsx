import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { TagsInput } from '@leve-ui/tags-input';
import { LuX } from '@qwikest/icons/lucide';
import styles from './validation.css?inline';

export default component$(() => {
  useStyles$(styles);
  const tags = useSignal<string[]>(['one', 'two']);

  return (
    <TagsInput.Root
      bind:value={tags}
      max={4}
      allowDuplicates={false}
      addOnPaste
      class="tags-input-validation"
    >
      <TagsInput.Label class="tags-input-validation-label">
        Keywords (max 4, no duplicates, paste supported)
      </TagsInput.Label>
      <TagsInput.Control class="tags-input-validation-control">
        {tags.value.map((tag, index) => (
          <TagsInput.Item
            key={`${tag}-${index}`}
            index={index}
            value={tag}
            class="tags-input-validation-item"
          >
            <TagsInput.ItemPreview class="tags-input-validation-item-preview">
              <TagsInput.ItemText>{tag}</TagsInput.ItemText>
              <TagsInput.ItemDeleteTrigger class="tags-input-validation-item-delete">
                <LuX aria-hidden="true" />
              </TagsInput.ItemDeleteTrigger>
            </TagsInput.ItemPreview>
          </TagsInput.Item>
        ))}
        <TagsInput.Input
          placeholder={tags.value.length >= 4 ? 'Max reached' : 'Add or paste tags...'}
          class="tags-input-validation-input"
        />
      </TagsInput.Control>
    </TagsInput.Root>
  );
});
