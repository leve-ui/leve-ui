import { $, component$, type PropsOf, Slot, useComputed$, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { stepsContextId, stepsItemContextId } from './steps-context';

export type StepsTriggerProps = PropsOf<'button'>;

/**
 * Interactive `<button type="button">` that activates the parent step when clicked.
 *
 * Automatically disabled when the item is disabled or when `linear` mode is enabled
 * and the step is upcoming.
 */
export const StepsTrigger = component$<StepsTriggerProps>((allProps) => {
  const { onClick$, disabled: _disabled, ...restProps } = allProps;
  const rootContext = useContext(stepsContextId);
  const itemContext = useContext(stepsItemContextId);

  const isLinearBlocked = useComputed$(
    () => rootContext.linear.value && itemContext.state.value === 'upcoming',
  );
  const isDisabled = useComputed$(
    () => itemContext.disabled.value || Boolean(allProps.disabled) || isLinearBlocked.value,
  );
  const disabledAttr = useComputed$(() => dataAttr(isDisabled.value));

  const handleClick$ = $(async () => {
    if (isDisabled.value) return;
    await rootContext.setStep$(itemContext.index.value);
  });

  return (
    <button
      {...restProps}
      type="button"
      disabled={isDisabled.value}
      onClick$={[handleClick$, onClick$]}
      data-leve-steps-trigger=""
      data-state={itemContext.state.value}
      data-disabled={disabledAttr.value}
    >
      <Slot />
    </button>
  );
});
