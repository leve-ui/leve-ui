import {
  $,
  component$,
  type PropsOf,
  type Signal,
  sync$,
  useContext,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { tagsInputContextId, tagsInputItemContextId } from './tags-input-context';

export type TagsInputItemInputProps = PropsOf<'input'>;

const syncKeyDown$ = sync$((event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === 'Escape') {
    event.preventDefault();
  }
});

/**
 * Inline text `<input>` for editing an existing tag item.
 */
export const TagsInputItemInput = component$<TagsInputItemInputProps>((props) => {
  const context = useContext(tagsInputContextId);
  const item = useContext(tagsInputItemContextId);
  const internalRef = useSignal<HTMLInputElement>();
  const inputRef = (props.ref as Signal<HTMLInputElement | undefined> | undefined) ?? internalRef;

  const isDisabled = item.isDisabled.value || Boolean(props.disabled);
  const isReadOnly = context.readOnly.value || Boolean(props.readOnly);

  // biome-ignore lint/correctness/noQwikUseVisibleTask: Must focus and select the inline input when entering edit mode
  useVisibleTask$(
    ({ track }) => {
      const editing = track(() => item.isEditing.value);
      if (editing && inputRef.value) {
        inputRef.value.value = context.editText.value;
        inputRef.value.focus();
        inputRef.value.select();
      }
    },
    { strategy: 'document-ready' },
  );

  const handleInput$ = $((_event: InputEvent, target: HTMLInputElement) => {
    context.editText.value = target.value;
  });

  const handleKeyDown$ = $(async (event: KeyboardEvent, target: HTMLInputElement) => {
    if (event.key === 'Enter') {
      await context.commitEdit$(item.index.value, target.value);
      await context.focusInput$();
    } else if (event.key === 'Escape') {
      await context.cancelEdit$();
      await context.focusInput$();
    }
  });

  const handleBlur$ = $(async (_event: FocusEvent, target: HTMLInputElement) => {
    if (!item.isEditing.value) return;
    await context.commitEdit$(item.index.value, target.value);
  });

  return (
    <input
      {...props}
      ref={inputRef}
      type="text"
      hidden={!item.isEditing.value}
      value={context.editText.value}
      disabled={isDisabled}
      readOnly={isReadOnly}
      aria-label={props['aria-label'] ?? `Edit tag ${item.value.value}`}
      onInput$={[handleInput$, props.onInput$]}
      onKeyDown$={[syncKeyDown$, handleKeyDown$, props.onKeyDown$]}
      onBlur$={[handleBlur$, props.onBlur$]}
      data-leve-tags-input-item-input=""
      data-state={item.state.value}
      data-disabled={dataAttr(isDisabled)}
      data-readonly={dataAttr(isReadOnly)}
    />
  );
});
