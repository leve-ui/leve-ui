import { $, component$, type PropsOf, Slot, useComputed$, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { stepsContextId } from './steps-context';

export type StepsPrevTriggerProps = PropsOf<'button'>;

/**
 * Button that navigates to the previous step.
 *
 * Automatically disabled when on the first step (`step <= 0`).
 */
export const StepsPrevTrigger = component$<StepsPrevTriggerProps>((allProps) => {
  const { onClick$, disabled: _disabled, ...restProps } = allProps;
  const rootContext = useContext(stepsContextId);

  const isDisabled = useComputed$(() => rootContext.step.value <= 0 || Boolean(allProps.disabled));
  const disabledAttr = useComputed$(() => dataAttr(isDisabled.value));

  const handleClick$ = $(async () => {
    if (isDisabled.value) return;
    await rootContext.setStep$(rootContext.step.value - 1);
  });

  return (
    <button
      {...restProps}
      type="button"
      disabled={isDisabled.value}
      onClick$={[handleClick$, onClick$]}
      data-leve-steps-prev-trigger=""
      data-disabled={disabledAttr.value}
    >
      <Slot />
    </button>
  );
});
