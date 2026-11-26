import { $, component$, type PropsOf, Slot, sync$, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { editableContextId, skipNextPreviewFocusElements } from './editable-context';

export type EditablePreviewProps = PropsOf<'span'>;

/**
 * Displays the committed value (or placeholder) when not editing, and activates
 * edit mode according to `activationMode` or keyboard activation (`Enter` / `Space`).
 */
export const EditablePreview = component$<EditablePreviewProps>((props) => {
  const context = useContext(editableContextId);
  const isEmpty = context.value.value.length === 0;
  const isPlaceholderShown = isEmpty && Boolean(context.placeholder.value);
  const isInteractive = !context.disabled.value && !context.readOnly.value;
  const isFocusable = isInteractive && context.activationMode.value === 'focus';

  const handleFocus$ = $(async (_event: FocusEvent, el: HTMLElement) => {
    if (skipNextPreviewFocusElements.has(el)) {
      skipNextPreviewFocusElements.delete(el);
      return;
    }
    if (!isInteractive || context.activationMode.value !== 'focus') return;
    await context.startEdit$();
  });

  const handleClick$ = $(async () => {
    if (!isInteractive) return;
    const mode = context.activationMode.value;
    if (mode === 'click' || mode === 'focus') {
      await context.startEdit$();
    }
  });

  const handleDblClick$ = $(async () => {
    if (!isInteractive || context.activationMode.value !== 'dblclick') return;
    await context.startEdit$();
  });

  const preventKeyScrollSync$ = sync$((event: KeyboardEvent, el: HTMLElement) => {
    if (
      (event.key === ' ' || event.key === 'Enter') &&
      el.getAttribute('data-disabled') === null &&
      el.getAttribute('data-readonly') === null &&
      el.tabIndex >= 0
    ) {
      event.preventDefault();
    }
  });

  const handleKeyDown$ = $(async (event: KeyboardEvent) => {
    if (!isInteractive || context.activationMode.value === 'none') return;
    if (event.key === 'Enter' || event.key === ' ') {
      await context.startEdit$();
    }
  });

  return (
    <span
      {...props}
      id={props.id ?? context.ids.preview}
      hidden={context.isEditing.value}
      tabIndex={isFocusable ? (props.tabIndex ?? 0) : props.tabIndex}
      onFocus$={[handleFocus$, props.onFocus$]}
      onClick$={[handleClick$, props.onClick$]}
      onDblClick$={[handleDblClick$, props.onDblClick$]}
      onKeyDown$={[preventKeyScrollSync$, handleKeyDown$, props.onKeyDown$]}
      data-leve-editable-preview=""
      data-state={context.isEditing.value ? 'edit' : 'preview'}
      data-empty={dataAttr(isEmpty)}
      data-placeholder-shown={dataAttr(isPlaceholderShown)}
      data-disabled={dataAttr(context.disabled.value)}
      data-readonly={dataAttr(context.readOnly.value)}
      data-invalid={dataAttr(context.invalid.value)}
    >
      {context.value.value || context.placeholder.value || ''}
      <Slot />
    </span>
  );
});
