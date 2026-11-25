import { $, component$, type PropsOf, useContext, useSignal } from '@builder.io/qwik';
import { dataAttr, useFormReset } from '@leve-ui/utils';
import { ratingGroupContextId } from './rating-group-context';

export type RatingGroupHiddenInputProps = PropsOf<'input'> & {
  /** The `id` of the form element to associate the input with. */
  form?: string;
};

/**
 * Visually hidden input element for native `<form>` submission and validation.
 *
 * Positioned absolutely (`adr/0026`) so native `required` validation and `FormData`
 * work seamlessly. Give `RatingGroup.Root` `position: relative` when using this part.
 */
export const RatingGroupHiddenInput = component$<RatingGroupHiddenInputProps>((props) => {
  const context = useContext(ratingGroupContextId);
  const inputRef = useSignal<HTMLInputElement>();

  useFormReset(
    inputRef,
    $(async () => {
      await context.reset$();
      if (inputRef.value) {
        inputRef.value.value = context.value.value > 0 ? String(context.value.value) : '';
      }
    }),
  );

  const hasValue = context.value.value > 0;

  return (
    <input
      {...props}
      ref={inputRef}
      type="text"
      value={hasValue ? String(context.value.value) : ''}
      required={context.required.value}
      disabled={context.disabled.value}
      readOnly={context.readOnly.value}
      aria-hidden="true"
      tabIndex={-1}
      // functional inline style per adr/0026, keeps native required validation working, unlike hidden
      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', margin: 0 }}
      data-leve-rating-group-hidden-input=""
      data-state={hasValue ? 'checked' : 'unchecked'}
      data-disabled={dataAttr(context.disabled.value)}
    />
  );
});
