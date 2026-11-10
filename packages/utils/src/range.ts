/** value を [min, max] の範囲に収めます */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * [min, max] の範囲での value の割合を 0〜100 で返します。
 * 範囲外の値は丸め、max <= min のときは 0 を返します。
 */
export const valueToPercent = (value: number, min: number, max: number): number => {
  if (max <= min) return 0;
  return ((clamp(value, min, max) - min) / (max - min)) * 100;
};
