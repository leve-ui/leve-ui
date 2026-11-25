import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { passwordInputContextId } from './password-input-context';

export type PasswordInputIndicatorProps = PropsOf<'span'>;

/**
 * Decorative indicator inside `VisibilityTrigger` for showing visibility state icons.
 * Hidden from assistive technologies with `aria-hidden="true"`.
 */
export const PasswordInputIndicator = component$<PasswordInputIndicatorProps>((props) => {
  const context = useContext(passwordInputContextId);

  return (
    <span
      {...props}
      aria-hidden="true"
      data-leve-password-input-indicator=""
      data-state={context.visible.value ? 'visible' : 'hidden'}
      data-disabled={dataAttr(context.disabled.value)}
    >
      <Slot />
    </span>
  );
});
