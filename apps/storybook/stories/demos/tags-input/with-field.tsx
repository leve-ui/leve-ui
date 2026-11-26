import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Field } from '@leve-ui/field';
import { TagsInput } from '@leve-ui/tags-input';
import { LuX } from '@qwikest/icons/lucide';
import styles from './with-field.css?inline';

export default component$(() => {
  useStyles$(styles);
  const tags = useSignal<string[]>(['accessibility']);

  return (
    <Field.Root
      invalid={tags.value.length === 0}
      required
      hasDescription
      class="tags-input-with-field"
    >
      <Field.Label class="tags-input-with-field-label">Skills</Field.Label>
      <TagsInput.Root bind:value={tags}>
        <TagsInput.Control class="tags-input-with-field-control">
          {tags.value.map((tag, index) => (
            <TagsInput.Item
              key={`${tag}-${index}`}
              index={index}
              value={tag}
              class="tags-input-with-field-item"
            >
              <TagsInput.ItemPreview class="tags-input-with-field-item-preview">
                <TagsInput.ItemText>{tag}</TagsInput.ItemText>
                <TagsInput.ItemDeleteTrigger class="tags-input-with-field-item-delete">
                  <LuX aria-hidden="true" />
                </TagsInput.ItemDeleteTrigger>
              </TagsInput.ItemPreview>
            </TagsInput.Item>
          ))}
          <TagsInput.Input placeholder="Add skill..." class="tags-input-with-field-input" />
        </TagsInput.Control>
      </TagsInput.Root>
      <Field.Description class="tags-input-with-field-description">
        Press Enter or comma to add a skill.
      </Field.Description>
      <Field.ErrorMessage class="tags-input-with-field-error">
        Please enter at least one skill.
      </Field.ErrorMessage>
    </Field.Root>
  );
});
