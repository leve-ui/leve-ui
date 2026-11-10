import {
  component$,
  type PropsOf,
  Slot,
  useComputed$,
  useContextProvider,
  useId,
} from '@builder.io/qwik';
import { clamp, valueToPercent } from '@leve-ui/utils';
import { meterContextId } from './meter-context';

export type MeterRootProps = PropsOf<'div'> & {
  /** 現在の値。`min` 〜 `max` の範囲に丸められます */
  value: number;
  /** 最小値。既定値は `0` */
  min?: number;
  /** 最大値。既定値は `100` */
  max?: number;
  /**
   * 値を人が読める形にした文字列（例: `"50 GB / 200 GB"`）。
   * `aria-valuetext` と ValueText の表示に使います。省略時は割合（例: `"25%"`）を表示します。
   */
  valueText?: string;
};

/**
 * 決まった範囲の中で増減する計測値（ディスク使用量、バッテリー残量など）を示します。
 *
 * APG の Meter パターン（https://www.w3.org/WAI/ARIA/apg/patterns/meter/）に従い、
 * `role="meter"` と `aria-valuenow` / `aria-valuemin` / `aria-valuemax` を出力します。
 * アクセシブルネームは Label パーツと関連付けます（`aria-label` / `aria-labelledby` を渡した場合はそちらを使います）。
 * タスクの進み具合には Progress を使ってください。
 */
export const MeterRoot = component$<MeterRootProps>(
  ({ value, min = 0, max = 100, valueText, ...props }) => {
    const labelId = useId();

    const clampedValue = useComputed$(() => clamp(value, min, max));
    const minSignal = useComputed$(() => min);
    const maxSignal = useComputed$(() => max);
    const text = useComputed$(
      () => valueText ?? `${Math.round(valueToPercent(clampedValue.value, min, max))}%`,
    );

    useContextProvider(meterContextId, {
      value: clampedValue,
      min: minSignal,
      max: maxSignal,
      valueText: text,
      labelId,
    });

    return (
      // biome-ignore lint/a11y/useSemanticElements: ネイティブの <meter> は Label などの子要素を持てないため
      <div
        {...props}
        role="meter"
        aria-labelledby={props['aria-labelledby'] ?? (props['aria-label'] ? undefined : labelId)}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={clampedValue.value}
        aria-valuetext={valueText}
        data-leve-meter=""
        data-value={clampedValue.value}
        data-min={min}
        data-max={max}
      >
        <Slot />
      </div>
    );
  },
);
