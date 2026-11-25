import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { passwordInputContextId } from './password-input-context';

export type PasswordInputVisibilityTriggerProps = PropsOf<'button'>;

/**
 * Toggle button that switches the password visibility between hidden and visible.
 *
 * Outputs `type="button"`, `aria-controls` pointing to the input, and `aria-pressed`
 * reflecting the current visibility state.
 */
export const PasswordInputVisibilityTrigger = component$<PasswordInputVisibilityTriggerProps>(
  ({ onClick$, disabled: propDisabled, ...restProps }) => {
    const context = useContext(passwordInputContextId);
    const isDisabled = context.disabled.value || !!propDisabled;

    return (
      <button
        {...restProps}
        type="button"
        aria-controls={context.ids.input}
        aria-pressed={context.visible.value ? 'true' : 'false'}
        disabled={isDisabled}
        onClick$={[context.toggle$, onClick$]}
        data-leve-password-input-visibility-trigger=""
        data-state={context.visible.value ? 'visible' : 'hidden'}
        data-disabled={dataAttr(isDisabled)}
      >
        <Slot />
      </button>
    );
  },
);
