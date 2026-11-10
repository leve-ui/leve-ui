import { createContextId, type Signal } from '@builder.io/qwik';

/** `indeterminate`: 値が未定 / `loading`: 進行中 / `complete`: 最大値に到達 */
export type ProgressState = 'indeterminate' | 'loading' | 'complete';

export interface ProgressContext {
  /** 範囲内に丸めた値。不確定のときは `null` */
  value: Signal<number | null>;
  min: Signal<number>;
  max: Signal<number>;
  /** 値の割合（0〜100）。不確定のときは `null` */
  percent: Signal<number | null>;
  state: Signal<ProgressState>;
  /** ValueText に表示し、`aria-valuetext` にも使う文字列 */
  valueText: Signal<string>;
  labelId: string;
}

export const progressContextId = createContextId<ProgressContext>('leve-ui.progress');
