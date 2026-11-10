import { component$, type PropsOf, useContext } from '@builder.io/qwik';
import { meterContextId } from './meter-context';

export type MeterIndicatorProps = PropsOf<'div'>;

/** 現在の値を表す要素です。幅などの見た目は `data-value` や利用者側の値で指定してください */
export const MeterIndicator = component$<MeterIndicatorProps>((props) => {
  const context = useContext(meterContextId);

  return (
    <div
      {...props}
      data-leve-meter-indicator=""
      data-value={context.value.value}
      data-min={context.min.value}
      data-max={context.max.value}
    />
  );
});
