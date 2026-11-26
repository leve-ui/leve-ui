import { $, component$, useComputed$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Combobox } from '@leve-ui/combobox';
import { TagsInput } from '@leve-ui/tags-input';
import { LuChevronDown, LuX } from '@qwikest/icons/lucide';
import styles from './suggestions-only.css?inline';

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

  // Only suggested items can be added because allowCustomValue is false on TagsInput.Root
  const handleSelect$ = $((value: string | null) => {
    if (!value) return;
    if (!tags.value.includes(value)) {
      tags.value = [...tags.value, value];
    }
  });

  return (
    <TagsInput.Root
      bind:value={tags}
      bind:inputValue={inputValue}
      allowCustomValue={false}
      class="tags-input-suggestions-only"
    >
      <Combobox.Root
        bind:inputValue={inputValue}
        selectionBehavior="clear"
        openOnClick
        autoHighlight
        onValueChange$={handleSelect$}
      >
        <TagsInput.Label class="tags-input-suggestions-only-label">Frameworks</TagsInput.Label>
        <TagsInput.Control as={Combobox.Control} class="tags-input-suggestions-only-control">
          {tags.value.map((tag, index) => (
            <TagsInput.Item
              key={`${tag}-${index}`}
              index={index}
              value={tag}
              class="tags-input-suggestions-only-item"
            >
              <TagsInput.ItemPreview class="tags-input-suggestions-only-item-preview">
                <TagsInput.ItemText class="tags-input-suggestions-only-item-text">
                  {tag}
                </TagsInput.ItemText>
                <TagsInput.ItemDeleteTrigger class="tags-input-suggestions-only-item-delete">
                  <LuX aria-hidden="true" />
                </TagsInput.ItemDeleteTrigger>
              </TagsInput.ItemPreview>
              <TagsInput.ItemInput class="tags-input-suggestions-only-item-input" />
            </TagsInput.Item>
          ))}
          <TagsInput.Input
            as={Combobox.Input}
            placeholder="Select a framework..."
            class="tags-input-suggestions-only-input"
          />
          <Combobox.Trigger
            class="tags-input-suggestions-only-trigger"
            aria-label="Toggle suggestions"
          >
            <LuChevronDown class="tags-input-suggestions-only-trigger-icon" aria-hidden="true" />
          </Combobox.Trigger>
        </TagsInput.Control>
        <Combobox.Content class="tags-input-suggestions-only-content">
          <Combobox.List aria-label="Framework suggestions">
            {available.value.map((item) => (
              <Combobox.Item key={item} value={item} class="tags-input-suggestions-only-option">
                <Combobox.ItemText>{item}</Combobox.ItemText>
              </Combobox.Item>
            ))}
            <Combobox.Empty class="tags-input-suggestions-only-empty">
              No matching frameworks
            </Combobox.Empty>
          </Combobox.List>
        </Combobox.Content>
      </Combobox.Root>
    </TagsInput.Root>
  );
});
