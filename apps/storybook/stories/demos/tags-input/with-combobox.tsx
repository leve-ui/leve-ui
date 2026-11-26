import { $, component$, useComputed$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Combobox } from '@leve-ui/combobox';
import { TagsInput } from '@leve-ui/tags-input';
import { LuChevronDown, LuX } from '@qwikest/icons/lucide';
import styles from './with-combobox.css?inline';

const FRAMEWORKS = ['Qwik', 'TypeScript', 'Playwright', 'Vitest', 'Vite', 'Biome', 'Solid'];

export default component$(() => {
  useStyles$(styles);
  const tags = useSignal<string[]>(['Qwik']);
  const inputValue = useSignal('');

  const available = useComputed$(() => {
    const query = inputValue.value.trim().toLowerCase();
    return FRAMEWORKS.filter(
      (item) => !tags.value.includes(item) && item.toLowerCase().includes(query),
    );
  });

  // Add the chosen suggestion to the tags array while Combobox clears the filter text
  const handleSelect$ = $((value: string | null) => {
    if (!value) return;
    if (!tags.value.includes(value)) {
      tags.value = [...tags.value, value];
    }
  });

  return (
    <TagsInput.Root bind:value={tags} bind:inputValue={inputValue} class="tags-input-with-combobox">
      <Combobox.Root
        bind:inputValue={inputValue}
        selectionBehavior="clear"
        openOnClick
        onValueChange$={handleSelect$}
      >
        <TagsInput.Label class="tags-input-with-combobox-label">Frameworks</TagsInput.Label>
        <TagsInput.Control as={Combobox.Control} class="tags-input-with-combobox-control">
          {tags.value.map((tag, index) => (
            <TagsInput.Item
              key={`${tag}-${index}`}
              index={index}
              value={tag}
              class="tags-input-with-combobox-item"
            >
              <TagsInput.ItemPreview class="tags-input-with-combobox-item-preview">
                <TagsInput.ItemText class="tags-input-with-combobox-item-text">
                  {tag}
                </TagsInput.ItemText>
                <TagsInput.ItemDeleteTrigger class="tags-input-with-combobox-item-delete">
                  <LuX aria-hidden="true" />
                </TagsInput.ItemDeleteTrigger>
              </TagsInput.ItemPreview>
              <TagsInput.ItemInput class="tags-input-with-combobox-item-input" />
            </TagsInput.Item>
          ))}
          <TagsInput.Input
            as={Combobox.Input}
            placeholder="Type or select a framework..."
            class="tags-input-with-combobox-input"
          />
          <Combobox.Trigger
            class="tags-input-with-combobox-trigger"
            aria-label="Toggle suggestions"
          >
            <LuChevronDown class="tags-input-with-combobox-trigger-icon" aria-hidden="true" />
          </Combobox.Trigger>
        </TagsInput.Control>
        <Combobox.Content class="tags-input-with-combobox-content">
          <Combobox.List aria-label="Framework suggestions">
            {available.value.map((item) => (
              <Combobox.Item key={item} value={item} class="tags-input-with-combobox-option">
                <Combobox.ItemText>{item}</Combobox.ItemText>
              </Combobox.Item>
            ))}
            <Combobox.Empty class="tags-input-with-combobox-empty">
              Press Enter to add custom tag
            </Combobox.Empty>
          </Combobox.List>
        </Combobox.Content>
      </Combobox.Root>
    </TagsInput.Root>
  );
});
