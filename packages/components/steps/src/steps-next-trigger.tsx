import { $, component$, type PropsOf, Slot, useComputed$, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { stepsContextId } from './steps-context';

export type StepsNextTriggerProps = PropsOf<'button'>;

/**
 * Button that navigates to the next step.
 *
 * Automatically disabled when on the last step (`step >= count - 1`).
 */
export const StepsNextTrigger = component$<StepsNextTriggerProps>((allProps) => {
  const { onClick$, disabled: _disabled, ...restProps } = allProps;
  const rootContext = useContext(stepsContextId);

  const isDisabled = useComputed$(
    () => rootContext.step.value >= rootContext.count.value - 1 || Boolean(allProps.disabled),
  );
  const disabledAttr = useComputed$(() => dataAttr(isDisabled.value));

  const handleClick$ = $(async () => {
    if (isDisabled.value) return;
    await rootContext.setStep$(rootContext.step.value + 1);
  });

  return (
    <button
      {...restProps}
      type="button"
      disabled={isDisabled.value}
      onClick$={[handleClick$, onClick$]}
      data-leve-steps-next-trigger=""
      data-disabled={disabledAttr.value}
    >
      <Slot />
    </button>
  );
});
