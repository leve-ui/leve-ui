import {
  component$,
  type PropsOf,
  Slot,
  useComputed$,
  useContextProvider,
  useId,
} from '@builder.io/qwik';
import { clamp, valueToPercent } from '@leve-ui/utils';
import { type ProgressState, progressContextId } from './progress-context';

export type ProgressRootProps = PropsOf<'div'> & {
  /** 現在の値。`null` のときは不確定（indeterminate）になります。既定値は `null` */
  value?: number | null;
  /** 最小値。既定値は `0` */
  min?: number;
  /** 最大値。既定値は `100` */
  max?: number;
  /**
   * 値を人が読める形にした文字列（例: `"3 / 10 files"`）。
   * `aria-valuetext` と ValueText の表示に使います。省略時は割合（例: `"30%"`）を表示します。
   */
  valueText?: string;
};

/**
 * タスクの進み具合を示します。
 *
 * 該当する APG パターンはないため、`role="progressbar"` と `aria-valuenow` / `aria-valuemin` /
 * `aria-valuemax` を出力します。不確定のときは `aria-valuenow` を出力しません。
 * アクセシブルネームは Label パーツと関連付けます（`aria-label` / `aria-labelledby` を渡した場合はそちらを使います）。
 * 増減する計測値（ディスク使用量など）には Meter を使ってください。
 */
export const ProgressRoot = component$<ProgressRootProps>(
  ({ value = null, min = 0, max = 100, valueText, ...props }) => {
    const labelId = useId();

    const clampedValue = useComputed$(() => (value === null ? null : clamp(value, min, max)));
    const minSignal = useComputed$(() => min);
    const maxSignal = useComputed$(() => max);
    const state = useComputed$<ProgressState>(() => {
      if (clampedValue.value === null) return 'indeterminate';
      return clampedValue.value >= max ? 'complete' : 'loading';
    });
    const percent = useComputed$(() =>
      clampedValue.value === null ? null : valueToPercent(clampedValue.value, min, max),
    );
    const text = useComputed$(() => {
      if (valueText !== undefined) return valueText;
      if (percent.value === null) return '';
      return `${Math.round(percent.value)}%`;
    });

    useContextProvider(progressContextId, {
      value: clampedValue,
      min: minSignal,
      max: maxSignal,
      percent,
      state,
      valueText: text,
      labelId,
    });

    return (
      <div
        {...props}
        role="progressbar"
        aria-labelledby={props['aria-labelledby'] ?? (props['aria-label'] ? undefined : labelId)}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={clampedValue.value ?? undefined}
        aria-valuetext={valueText}
        data-leve-progress=""
        data-state={state.value}
        data-value={clampedValue.value ?? undefined}
        data-min={min}
        data-max={max}
      >
        <Slot />
      </div>
    );
  },
);
