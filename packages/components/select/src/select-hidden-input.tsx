import { $, component$, type PropsOf, type Signal, useContext, useSignal } from '@builder.io/qwik';
import { useFormReset } from '@leve-ui/utils';
import { selectContextId } from './select-context';

export type SelectHiddenInputProps = PropsOf<'input'> & {
  /** The `id` of the form element to associate the input with. */
  form?: string;
};

/**
 * Visually hidden native `<input>` for submitting the selected value in a `<form>` (`adr/0026`).
 *
 * Positioned absolutely so native `required` validation and `<form>` reset work; set
 * `position: relative` on `Select.Root` when using this part.
 */
export const SelectHiddenInput = component$<SelectHiddenInputProps>((props) => {
  const context = useContext(selectContextId);
  const internalRef = useSignal<HTMLInputElement>();
  const inputRef = (props.ref as Signal<HTMLInputElement | undefined> | undefined) ?? internalRef;

  useFormReset(
    inputRef,
    $(async () => {
      await context.reset$();
      if (inputRef.value) {
        inputRef.value.value = context.value.value ?? '';
      }
    }),
  );

  return (
    <input
      {...props}
      ref={inputRef}
      type="text"
      value={context.value.value ?? ''}
      required={context.required.value}
      disabled={context.disabled.value}
      aria-hidden="true"
      tabIndex={-1}
      // functional inline style per adr/0026, keeps native required validation working, unlike hidden
      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', margin: 0, width: 0 }}
      data-leve-select-hidden-input=""
    />
  );
});
