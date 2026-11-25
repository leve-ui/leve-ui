import { component$, type PropsOf, type Signal, useContext } from '@builder.io/qwik';
import { dataAttr, useFieldControl } from '@leve-ui/utils';
import { passwordInputContextId } from './password-input-context';

export type PasswordInputInputProps = PropsOf<'input'> & {
  /** A signal bound to the input value. */
  'bind:value'?: Signal<string>;
};

/**
 * Native `<input>` element whose `type` switches between `"password"` and `"text"`
 * based on the visibility state.
 */
export const PasswordInputInput = component$<PasswordInputInputProps>(
  ({ 'bind:value': bindValue, ...elementProps }) => {
    const context = useContext(passwordInputContextId);
    const control = useFieldControl(elementProps);

    const isDisabled = context.disabled.value || control.value.disabled;
    const isReadOnly = context.readOnly.value || control.value.readOnly;
    const isRequired = context.required.value || control.value.required;
    const isInvalid = context.invalid.value || control.value.invalid;

    return (
      <input
        {...elementProps}
        bind:value={bindValue}
        type={context.visible.value ? 'text' : 'password'}
        id={context.ids.input}
        aria-describedby={control.value.describedBy}
        aria-invalid={isInvalid ? 'true' : undefined}
        disabled={isDisabled}
        readOnly={isReadOnly}
        required={isRequired}
        data-leve-password-input-input=""
        data-state={context.visible.value ? 'visible' : 'hidden'}
        data-disabled={dataAttr(isDisabled)}
        data-readonly={dataAttr(isReadOnly)}
        data-invalid={dataAttr(isInvalid)}
      />
    );
  },
);
