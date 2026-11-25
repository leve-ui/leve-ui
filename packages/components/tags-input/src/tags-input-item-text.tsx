import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { tagsInputItemContextId } from './tags-input-context';

export type TagsInputItemTextProps = PropsOf<'span'>;

/**
 * Renders the text label of a tag item.
 */
export const TagsInputItemText = component$<TagsInputItemTextProps>((props) => {
  const item = useContext(tagsInputItemContextId);

  return (
    <span
      {...props}
      data-leve-tags-input-item-text=""
      data-state={item.state.value}
      data-highlighted={dataAttr(item.isHighlighted.value)}
      data-disabled={dataAttr(item.isDisabled.value)}
    >
      <Slot />
    </span>
  );
});
