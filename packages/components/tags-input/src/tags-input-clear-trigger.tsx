import { $, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { tagsInputContextId } from './tags-input-context';

export type TagsInputClearTriggerProps = PropsOf<'button'>;

/**
 * Button that clears all tags and restores focus to `TagsInput.Input`.
 */
export const TagsInputClearTrigger = component$<TagsInputClearTriggerProps>((props) => {
  const context = useContext(tagsInputContextId);
  const isDisabled =
    context.disabled.value ||
    context.readOnly.value ||
    context.tags.value.length === 0 ||
    Boolean(props.disabled);
  const state = context.tags.value.length > 0 ? 'has-tags' : 'empty';

  const handleClick$ = $(async () => {
    if (isDisabled) return;
    await context.clearTags$();
  });

  return (
    <button
      {...props}
      type="button"
      disabled={isDisabled}
      onClick$={[handleClick$, props.onClick$]}
      data-leve-tags-input-clear-trigger=""
      data-state={state}
      data-disabled={dataAttr(isDisabled)}
    >
      <Slot />
    </button>
  );
});
