import { $, component$, type PropsOf, type Signal, useContext, useSignal } from '@builder.io/qwik';
import { dataAttr, useFormReset } from '@leve-ui/utils';
import { tagsInputContextId } from './tags-input-context';

export type TagsInputHiddenInputProps = PropsOf<'input'> & {
  /** The `id` of the form element to associate the input with. */
  form?: string;
};

/**
 * Visually hidden native `<input>` for submitting the comma-joined tags in a `<form>`.
 *
 * Participates in `FormData`, native `required` validation, and `<form>` reset
 * per ADR 0026.
 */
export const TagsInputHiddenInput = component$<TagsInputHiddenInputProps>((props) => {
  const context = useContext(tagsInputContextId);
  const internalRef = useSignal<HTMLInputElement>();
  const inputRef = (props.ref as Signal<HTMLInputElement | undefined> | undefined) ?? internalRef;

  useFormReset(
    inputRef,
    $(async () => {
      await context.reset$();
      if (inputRef.value) {
        inputRef.value.value = context.tags.value.join(',');
      }
    }),
  );

  const state = context.tags.value.length > 0 ? 'has-tags' : 'empty';

  return (
    <input
      {...props}
      ref={inputRef}
      type="text"
      value={context.tags.value.join(',')}
      required={context.required.value}
      disabled={context.disabled.value}
      aria-hidden="true"
      tabIndex={-1}
      // functional inline style per adr/0026, keeps native required validation working, unlike hidden
      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', margin: 0 }}
      data-leve-tags-input-hidden-input=""
      data-state={state}
      data-disabled={dataAttr(context.disabled.value)}
      data-readonly={dataAttr(context.readOnly.value)}
      data-invalid={dataAttr(context.invalid.value)}
    />
  );
});
