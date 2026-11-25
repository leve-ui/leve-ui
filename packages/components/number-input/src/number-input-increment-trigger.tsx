import { $, component$, type PropsOf, Slot, sync$, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { numberInputContextId } from './number-input-context';

export type NumberInputIncrementTriggerProps = PropsOf<'button'>;

const preventMouseDownSync$ = sync$((event: MouseEvent) => {
  event.preventDefault();
});

/**
 * Button that increments the NumberInput value by `step`.
 *
 * Excluded from the tab order (`tabIndex={-1}`) and prevents mousedown default
 * so clicking keeps focus on `NumberInput.Input`.
 */
export const NumberInputIncrementTrigger = component$<NumberInputIncrementTriggerProps>((props) => {
  const context = useContext(numberInputContextId);
  const isDisabled =
    Boolean(props.disabled) ||
    context.disabled.value ||
    context.readOnly.value ||
    context.atMax.value;

  const handleClick$ = $(async () => {
    if (isDisabled) return;
    await context.increment$();
  });

  return (
    <button
      {...props}
      type="button"
      tabIndex={-1}
      disabled={isDisabled}
      aria-label={props['aria-label'] ?? 'Increment'}
      onMouseDown$={[preventMouseDownSync$, props.onMouseDown$]}
      onClick$={[handleClick$, props.onClick$]}
      data-leve-number-input-increment-trigger=""
      data-disabled={dataAttr(isDisabled)}
    >
      <Slot />
    </button>
  );
});
