import { $, component$, type PropsOf, type Signal, useContext, useSignal } from '@builder.io/qwik';
import { dataAttr, useFormReset } from '@leve-ui/utils';
import { pinInputContextId } from './pin-input-context';

export type PinInputHiddenInputProps = PropsOf<'input'> & {
  /** The `id` of the form element to associate the input with. */
  form?: string;
};

/**
 * Visually hidden native `<input>` for submitting the joined PIN value in a `<form>`.
 *
 * Participates in `FormData`, native `required` validation, and `<form>` reset
 * per ADR 0026.
 */
export const PinInputHiddenInput = component$<PinInputHiddenInputProps>((props) => {
  const context = useContext(pinInputContextId);
  const internalRef = useSignal<HTMLInputElement>();
  const inputRef = (props.ref as Signal<HTMLInputElement | undefined> | undefined) ?? internalRef;

  useFormReset(
    inputRef,
    $(async () => {
      await context.reset$();
      const joined = context.values.value.join('');
      if (inputRef.value) {
        inputRef.value.value = joined;
      }
      const root = context.rootRef.value;
      if (root) {
        const inputs = Array.from(
          root.querySelectorAll<HTMLInputElement>('[data-leve-pin-input-input]'),
        ).filter((el) => el.closest('[data-leve-pin-input]') === root);
        for (let i = 0; i < inputs.length; i++) {
          inputs[i].value = context.values.value[i] ?? '';
        }
      }
    }),
  );

  const state = context.isComplete.value ? 'complete' : 'incomplete';

  return (
    <input
      {...props}
      ref={inputRef}
      type="text"
      value={context.values.value.join('')}
      required={context.required.value}
      disabled={context.disabled.value}
      aria-hidden="true"
      tabIndex={-1}
      // functional inline style per adr/0026, keeps native required validation working, unlike hidden
      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', margin: 0 }}
      data-leve-pin-input-hidden-input=""
      data-state={state}
      data-disabled={dataAttr(context.disabled.value)}
      data-readonly={dataAttr(context.readOnly.value)}
      data-invalid={dataAttr(context.invalid.value)}
    />
  );
});
