import { component$, type PropsOf, useContext } from '@builder.io/qwik';
import { withCssVars } from '@leve-ui/utils';
import { progressContextId } from './progress-context';

export type ProgressIndicatorProps = PropsOf<'div'>;

/**
 * 現在の値を表す要素です。
 *
 * Root の `value` から計算した割合を、CSS 変数 `--leve-progress-percent`（例: `40%`）として出力します
 * （不確定のときは出力しません）。`width` などに直接は当てないため、
 * `width: var(--leve-progress-percent)` や `transform` など、表現方法は利用者が選べます。
 */
export const ProgressIndicator = component$<ProgressIndicatorProps>((props) => {
  const context = useContext(progressContextId);
  const percent = context.percent.value;

  return (
    <div
      {...props}
      // 見た目は指定せず、値の割合だけを CSS 変数で渡す（スタイリングに必要な最小限の出力）
      style={withCssVars(props.style, {
        '--leve-progress-percent': percent === null ? undefined : `${percent}%`,
      })}
      data-leve-progress-indicator=""
      data-state={context.state.value}
      data-value={context.value.value ?? undefined}
      data-min={context.min.value}
      data-max={context.max.value}
    />
  );
});
