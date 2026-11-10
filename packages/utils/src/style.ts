import type { CSSProperties } from '@builder.io/qwik';

/**
 * 利用者が渡した `style`（文字列またはオブジェクト）に CSS カスタムプロパティを足します。
 * 値が `undefined` のプロパティは出力しません。ライブラリの値を優先するため、後ろに足します。
 *
 * @example <div style={withCssVars(props.style, { '--leve-progress-percent': '40%' })} />
 */
export const withCssVars = (
  style: CSSProperties | string | undefined,
  vars: Record<`--${string}`, string | undefined>,
): CSSProperties | string | undefined => {
  const entries = Object.entries(vars).filter(
    (entry): entry is [string, string] => entry[1] !== undefined,
  );
  if (entries.length === 0) return style;

  if (typeof style === 'string') {
    const base = style.trim();
    const declarations = entries.map(([key, value]) => `${key}: ${value}`).join('; ');
    return base ? `${base.replace(/;$/, '')}; ${declarations}` : declarations;
  }

  return { ...style, ...Object.fromEntries(entries) };
};
