import { $, component$, type PropsOf, sync$, useContext, useSignal } from '@builder.io/qwik';
import { dataAttr, useFieldControl, useFormReset } from '@leve-ui/utils';
import { numberInputContextId } from './number-input-context';

export type NumberInputInputProps = PropsOf<'input'>;

const preventNavigationKeysSync$ = sync$((event: KeyboardEvent, el: HTMLInputElement) => {
  if (el.disabled || el.readOnly) return;
  if (
    event.key === 'ArrowUp' ||
    event.key === 'ArrowDown' ||
    event.key === 'PageUp' ||
    event.key === 'PageDown'
  ) {
    event.preventDefault();
    return;
  }
  if (event.key === 'Home' && el.hasAttribute('aria-valuemin')) {
    event.preventDefault();
    return;
  }
  if (event.key === 'End' && el.hasAttribute('aria-valuemax')) {
    event.preventDefault();
  }
});

/**
 * Spinbutton text `<input>` for entering and stepping numeric values.
 *
 * Implements the WAI-ARIA `spinbutton` role (`aria-valuenow`, `aria-valuemin`,
 * `aria-valuemax`, `aria-valuetext`), keyboard stepping (`ArrowUp`, `ArrowDown`,
 * `PageUp`, `PageDown`, `Home`, `End`, `Enter`), and form reset integration.
 */
export const NumberInputInput = component$<NumberInputInputProps>((props) => {
  const context = useContext(numberInputContextId);
  const control = useFieldControl(props);
  const inputRef = useSignal<HTMLInputElement>();

  useFormReset(
    inputRef,
    $(async () => {
      await context.reset$();
      if (inputRef.value) {
        inputRef.value.value = context.inputText.value;
      }
    }),
  );

  const isDisabled = context.disabled.value || control.value.disabled;
  const isReadOnly = context.readOnly.value || control.value.readOnly;
  const isRequired = context.required.value || control.value.required;
  const isInvalid = context.invalid.value || control.value.invalid;

  const handleInput$ = $((event: Event, element: HTMLInputElement) => {
    const target = element ?? (event.target as HTMLInputElement | null);
    if (target) {
      context.inputText.value = target.value;
    }
  });

  const handleBlur$ = $(async () => {
    await context.commit$();
  });

  const handleKeyDown$ = $(async (event: KeyboardEvent) => {
    if (isDisabled || isReadOnly) return;

    switch (event.key) {
      case 'ArrowUp':
        await context.increment$();
        break;
      case 'ArrowDown':
        await context.decrement$();
        break;
      case 'PageUp':
        await context.increment$(context.largeStep.value);
        break;
      case 'PageDown':
        await context.decrement$(context.largeStep.value);
        break;
      case 'Home':
        await context.setToMin$();
        break;
      case 'End':
        await context.setToMax$();
        break;
      case 'Enter':
        await context.commit$();
        break;
      default:
        break;
    }
  });

  const val = context.value.value;
  const formatted = context.formattedValue.value;
  const ariaValueText = val !== null && formatted !== String(val) ? formatted : undefined;

  const resolvedId =
    context.isInField || context.hasPropInputId
      ? context.ids.input
      : (props.id ?? context.ids.input);

  return (
    <input
      {...props}
      ref={inputRef}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      spellcheck={false}
      id={resolvedId}
      role="spinbutton"
      value={context.inputText.value}
      disabled={isDisabled}
      readOnly={isReadOnly}
      required={isRequired}
      aria-valuenow={val !== null ? val : undefined}
      aria-valuetext={ariaValueText}
      aria-valuemin={context.min.value}
      aria-valuemax={context.max.value}
      aria-readonly={isReadOnly ? 'true' : undefined}
      aria-disabled={isDisabled ? 'true' : undefined}
      aria-invalid={isInvalid ? 'true' : undefined}
      aria-required={isRequired ? 'true' : undefined}
      aria-describedby={control.value.describedBy}
      onInput$={[handleInput$, props.onInput$]}
      onBlur$={[handleBlur$, props.onBlur$]}
      onKeyDown$={[preventNavigationKeysSync$, handleKeyDown$, props.onKeyDown$]}
      data-leve-number-input-input=""
      data-state={val === null ? 'empty' : 'filled'}
      data-disabled={dataAttr(isDisabled)}
      data-readonly={dataAttr(isReadOnly)}
      data-invalid={dataAttr(isInvalid)}
    />
  );
});
