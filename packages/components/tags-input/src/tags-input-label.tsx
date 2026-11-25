import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { tagsInputContextId } from './tags-input-context';

export type TagsInputLabelProps = PropsOf<'label'>;

/**
 * Accessible `<label>` associated with `TagsInput.Input`.
 */
export const TagsInputLabel = component$<TagsInputLabelProps>((props) => {
  const context = useContext(tagsInputContextId);
  const state = context.tags.value.length > 0 ? 'has-tags' : 'empty';

  return (
    <label
      {...props}
      id={props.id ?? context.ids.label}
      for={props.for ?? context.ids.input}
      data-leve-tags-input-label=""
      data-state={state}
      data-disabled={dataAttr(context.disabled.value)}
      data-readonly={dataAttr(context.readOnly.value)}
      data-invalid={dataAttr(context.invalid.value)}
    >
      <Slot />
    </label>
  );
});
