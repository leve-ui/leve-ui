import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { tagsInputItemContextId } from './tags-input-context';

export type TagsInputItemPreviewProps = PropsOf<'div'>;

/**
 * Displays the tag content when not in inline edit mode.
 */
export const TagsInputItemPreview = component$<TagsInputItemPreviewProps>((props) => {
  const item = useContext(tagsInputItemContextId);

  return (
    <div
      {...props}
      hidden={item.isEditing.value}
      data-leve-tags-input-item-preview=""
      data-state={item.state.value}
      data-highlighted={dataAttr(item.isHighlighted.value)}
      data-disabled={dataAttr(item.isDisabled.value)}
    >
      <Slot />
    </div>
  );
});
