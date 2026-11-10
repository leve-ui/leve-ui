/**
 * boolean を data-* 属性用の値に変換します。
 * false / undefined の場合は属性自体を出力しません。
 *
 * @example <div data-disabled={dataAttr(disabled)} />
 */
export const dataAttr = (condition: boolean | undefined): '' | undefined =>
  condition ? '' : undefined;
