import {
  $,
  component$,
  type PropsOf,
  Slot,
  useComputed$,
  useContext,
  useContextProvider,
} from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import {
  type TagsInputItemState,
  tagsInputContextId,
  tagsInputItemContextId,
} from './tags-input-context';

export type TagsInputItemProps = PropsOf<'div'> & {
  /** Zero-based index of this tag item. */
  index: number;
  /** Value of this tag item. */
  value: string;
  /**
   * Disables this individual tag item.
   * @default false
   */
  disabled?: boolean;
};

/**
 * Container for a single tag item.
 *
 * Double-clicking enters inline edit mode when `editable` is enabled.
 */
export const TagsInputItem = component$<TagsInputItemProps>((props) => {
  const { index: _index, value: _value, disabled: _disabled, ...restProps } = props;
  const context = useContext(tagsInputContextId);

  const indexSignal = useComputed$(() => props.index);
  const valueSignal = useComputed$(() => props.value);
  const isDisabledSignal = useComputed$(() => context.disabled.value || Boolean(props.disabled));
  const isHighlightedSignal = useComputed$(() => context.highlightedIndex.value === props.index);
  const isEditingSignal = useComputed$(() => context.editingIndex.value === props.index);
  const stateSignal = useComputed$<TagsInputItemState>(() => {
    if (isEditingSignal.value) return 'editing';
    if (isHighlightedSignal.value) return 'active';
    return 'idle';
  });

  useContextProvider(tagsInputItemContextId, {
    index: indexSignal,
    value: valueSignal,
    isDisabled: isDisabledSignal,
    isHighlighted: isHighlightedSignal,
    isEditing: isEditingSignal,
    state: stateSignal,
  });

  const handleDblClick$ = $(async () => {
    if (!context.editable.value || isDisabledSignal.value || context.readOnly.value) return;
    await context.startEdit$(props.index);
  });

  return (
    <div
      {...restProps}
      onDblClick$={[handleDblClick$, props.onDblClick$]}
      data-leve-tags-input-item=""
      data-index={props.index}
      data-state={stateSignal.value}
      data-highlighted={dataAttr(isHighlightedSignal.value)}
      data-disabled={dataAttr(isDisabledSignal.value)}
    >
      <Slot />
    </div>
  );
});
