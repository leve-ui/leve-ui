import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { TagsInput } from '@leve-ui/tags-input';
import { LuX } from '@qwikest/icons/lucide';
import styles from './with-form.css?inline';

export default component$(() => {
  useStyles$(styles);
  const tags = useSignal<string[]>(['qwik', 'ui']);
  const submitted = useSignal<string | null>(null);

  const handleSubmit$ = $((_event: SubmitEvent, form: HTMLFormElement) => {
    const data = new FormData(form);
    submitted.value = String(data.get('tags') ?? '');
  });

  return (
    <div class="tags-input-with-form-wrap">
      <form preventdefault:submit onSubmit$={handleSubmit$} class="tags-input-with-form">
        <TagsInput.Root
          defaultValue={['qwik', 'ui']}
          onValueChange$={(next) => {
            tags.value = next;
          }}
          required
          class="tags-input-with-form-root"
        >
          <TagsInput.Label class="tags-input-with-form-label">Tags</TagsInput.Label>
          <TagsInput.Control class="tags-input-with-form-control">
            {tags.value.map((tag, index) => (
              <TagsInput.Item
                key={`${tag}-${index}`}
                index={index}
                value={tag}
                class="tags-input-with-form-item"
              >
                <TagsInput.ItemPreview class="tags-input-with-form-item-preview">
                  <TagsInput.ItemText>{tag}</TagsInput.ItemText>
                  <TagsInput.ItemDeleteTrigger class="tags-input-with-form-item-delete">
                    <LuX aria-hidden="true" />
                  </TagsInput.ItemDeleteTrigger>
                </TagsInput.ItemPreview>
              </TagsInput.Item>
            ))}
            <TagsInput.Input placeholder="Add tag..." class="tags-input-with-form-input" />
          </TagsInput.Control>
          <TagsInput.HiddenInput name="tags" />
        </TagsInput.Root>

        <div class="tags-input-with-form-actions">
          <button type="submit" class="tags-input-with-form-submit">
            Submit
          </button>
          <button type="reset" class="tags-input-with-form-reset">
            Reset
          </button>
        </div>
      </form>
      <output class="tags-input-with-form-output">
        {submitted.value !== null ? `Submitted: ${submitted.value}` : 'Not submitted yet'}
      </output>
    </div>
  );
});
