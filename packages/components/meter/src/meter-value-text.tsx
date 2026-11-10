import { component$, type PropsOf, useContext } from '@builder.io/qwik';
import { meterContextId } from './meter-context';

export type MeterValueTextProps = PropsOf<'span'>;

/** 現在の値を表示します。Root の `valueText`、省略時は割合（例: `"30%"`）を表示します */
export const MeterValueText = component$<MeterValueTextProps>((props) => {
  const context = useContext(meterContextId);

  return (
    <span
      {...props}
      data-leve-meter-value-text=""
      data-value={context.value.value}
      data-min={context.min.value}
      data-max={context.max.value}
    >
      {context.valueText.value}
    </span>
  );
});
