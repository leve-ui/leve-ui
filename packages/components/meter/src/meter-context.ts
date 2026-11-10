import { createContextId, type Signal } from '@builder.io/qwik';

export interface MeterContext {
  /** 範囲内に丸めた値 */
  value: Signal<number>;
  min: Signal<number>;
  max: Signal<number>;
  /** 値の割合（0〜100） */
  percent: Signal<number>;
  /** ValueText に表示し、`aria-valuetext` にも使う文字列 */
  valueText: Signal<string>;
  labelId: string;
}

export const meterContextId = createContextId<MeterContext>('leve-ui.meter');
