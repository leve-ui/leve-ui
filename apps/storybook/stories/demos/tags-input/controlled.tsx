import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { TagsInput } from '@leve-ui/tags-input';
import { LuX } from '@qwikest/icons/lucide';
import styles from './controlled.css?inline';

export default component$(() => {
  useStyles$(styles);
  const tags = useSignal<string[]>(['design', 'a11y']);

  const addPreset$ = $((tag: string) => {
    if (!tags.value.includes(tag)) {
      tags.value = [...tags.value, tag];
    }
  });

  return (
    <div class="tags-input-controlled-wrap">
      <TagsInput.Root bind:value={tags} class="tags-input-controlled">
        <TagsInput.Label class="tags-input-controlled-label">Topics</TagsInput.Label>
        <TagsInput.Control class="tags-input-controlled-control">
          {tags.value.map((tag, index) => (
            <TagsInput.Item
              key={`${tag}-${index}`}
              index={index}
              value={tag}
              class="tags-input-controlled-item"
            >
              <TagsInput.ItemPreview class="tags-input-controlled-item-preview">
                <TagsInput.ItemText>{tag}</TagsInput.ItemText>
                <TagsInput.ItemDeleteTrigger class="tags-input-controlled-item-delete">
                  <LuX aria-hidden="true" />
                </TagsInput.ItemDeleteTrigger>
              </TagsInput.ItemPreview>
              <TagsInput.ItemInput class="tags-input-controlled-item-input" />
            </TagsInput.Item>
          ))}
          <TagsInput.Input placeholder="Add topic..." class="tags-input-controlled-input" />
        </TagsInput.Control>
      </TagsInput.Root>

      <div class="tags-input-controlled-actions">
        <button type="button" class="tags-input-controlled-btn" onClick$={() => addPreset$('qwik')}>
          Add "qwik"
        </button>
        <button
          type="button"
          class="tags-input-controlled-btn"
          onClick$={() => {
            tags.value = [];
          }}
        >
          Reset
        </button>
      </div>
      <p class="tags-input-controlled-output">
        Value: {tags.value.length > 0 ? tags.value.join(', ') : '(empty)'}
      </p>
    </div>
  );
});
