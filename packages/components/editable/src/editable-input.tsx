import {
  $,
  component$,
  type PropsOf,
  type Signal,
  sync$,
  useContext,
  useSignal,
} from '@builder.io/qwik';
import { dataAttr, useFormReset } from '@leve-ui/utils';
import { editableContextId } from './editable-context';

export type EditableInputProps = Omit<PropsOf<'input'>, 'children'> &
  Pick<PropsOf<'textarea'>, 'rows' | 'cols' | 'wrap'>;

/**
 * Native `<input>` (or `<textarea>` when `multiline` is true) shown in edit mode.
 */
export const EditableInput = component$<EditableInputProps>((props) => {
  const context = useContext(editableContextId);
  const inputRef = useSignal<HTMLInputElement | HTMLTextAreaElement>();

  useFormReset(inputRef as unknown as Signal<HTMLInputElement | undefined>, context.resetForm$);

  const handleInput$ = $((_event: Event, el: HTMLInputElement | HTMLTextAreaElement) => {
    context.draftValue.value = el.value;
  });

  const preventEnterSync$ = sync$((event: KeyboardEvent, el: HTMLElement) => {
    if (event.key === 'Enter' && el.tagName === 'INPUT') {
      event.preventDefault();
    }
  });

  const handleKeyDown$ = $(async (event: KeyboardEvent) => {
    if (context.disabled.value || context.readOnly.value) return;

    if (event.key === 'Escape') {
      await context.cancel$(true);
      return;
    }

    const submitMode = context.submitMode.value;
    const canSubmitOnEnter = submitMode === 'enter' || submitMode === 'both';
    if (event.key === 'Enter' && canSubmitOnEnter) {
      if (context.multiline.value) {
        if (event.ctrlKey || event.metaKey) {
          await context.commit$(true);
        }
      } else {
        await context.commit$(true);
      }
    }
  });

  const handleBlur$ = $(async (event: FocusEvent, el: HTMLInputElement | HTMLTextAreaElement) => {
    if (!context.isEditing.value) return;
    if (context.disabled.value || context.readOnly.value) return;
    const submitMode = context.submitMode.value;
    if (submitMode !== 'blur' && submitMode !== 'both') return;

    const related = event.relatedTarget as HTMLElement | null;
    const rootEl = el.closest('[data-leve-editable]');
    if (related && rootEl) {
      const actionTrigger = related.closest(
        '[data-leve-editable-submit-trigger], [data-leve-editable-cancel-trigger]',
      );
      if (actionTrigger && actionTrigger.closest('[data-leve-editable]') === rootEl) {
        return;
      }
    }

    await context.commit$(false);
  });

  const describedByParts = [context.describedBy.value, props['aria-describedby']]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part));
  const describedBy = describedByParts.length > 0 ? describedByParts.join(' ') : undefined;

  const Element = (context.multiline.value ? 'textarea' : 'input') as 'input';

  return (
    <Element
      {...(props as PropsOf<'input'>)}
      ref={inputRef as Signal<HTMLInputElement | undefined>}
      hidden={!context.isEditing.value}
      id={context.ids.input}
      value={context.draftValue.value}
      placeholder={context.placeholder.value ?? props.placeholder}
      disabled={context.disabled.value}
      readOnly={context.readOnly.value}
      required={context.required.value}
      aria-describedby={describedBy}
      aria-invalid={context.invalid.value ? 'true' : undefined}
      onInput$={[handleInput$, props.onInput$]}
      onKeyDown$={[preventEnterSync$, handleKeyDown$, props.onKeyDown$]}
      onBlur$={[handleBlur$, props.onBlur$]}
      data-leve-editable-input=""
      data-state={context.isEditing.value ? 'edit' : 'preview'}
      data-disabled={dataAttr(context.disabled.value)}
      data-readonly={dataAttr(context.readOnly.value)}
      data-invalid={dataAttr(context.invalid.value)}
    />
  );
});
