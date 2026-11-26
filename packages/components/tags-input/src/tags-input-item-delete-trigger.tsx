import { $, component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { tagsInputContextId, tagsInputItemContextId } from './tags-input-context';

export type TagsInputItemDeleteTriggerProps = PropsOf<'button'>;

/**
 * Button that removes the parent tag item and restores focus to `TagsInput.Input`.
 */
export const TagsInputItemDeleteTrigger = component$<TagsInputItemDeleteTriggerProps>((props) => {
  const context = useContext(tagsInputContextId);
  const item = useContext(tagsInputItemContextId);
  const isDisabled = item.isDisabled.value || context.readOnly.value || Boolean(props.disabled);

  const handleClick$ = $(async () => {
    if (isDisabled) return;
    await context.removeTagAt$(item.index.value);
    await context.focusInput$();
  });

  return (
    <button
      {...props}
      type="button"
      tabIndex={-1}
      disabled={isDisabled}
      aria-label={props['aria-label'] ?? `Delete tag ${item.value.value}`}
      onClick$={[handleClick$, props.onClick$]}
      data-leve-tags-input-item-delete-trigger=""
      data-state={item.state.value}
      data-disabled={dataAttr(isDisabled)}
    >
      <Slot />
    </button>
  );
});
