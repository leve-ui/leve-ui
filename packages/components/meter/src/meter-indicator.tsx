import { component$, type PropsOf, useContext } from '@builder.io/qwik';
import { withCssVars } from '@leve-ui/utils';
import { meterContextId } from './meter-context';

export type MeterIndicatorProps = PropsOf<'div'>;

/**
 * 現在の値を表す要素です。
 *
 * Root の `value` から計算した割合を、CSS 変数 `--leve-meter-percent`（例: `25%`）として出力します。
 * `width` などに直接は当てないため、`width: var(--leve-meter-percent)` や `transform` など、
 * 表現方法は利用者が選べます。
 */
export const MeterIndicator = component$<MeterIndicatorProps>((props) => {
  const context = useContext(meterContextId);

  return (
    <div
      {...props}
      // 見た目は指定せず、値の割合だけを CSS 変数で渡す（スタイリングに必要な最小限の出力）
      style={withCssVars(props.style, { '--leve-meter-percent': `${context.percent.value}%` })}
      data-leve-meter-indicator=""
      data-value={context.value.value}
      data-min={context.min.value}
      data-max={context.max.value}
    />
  );
});
