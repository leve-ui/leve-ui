import { component$, type PropsOf } from '@builder.io/qwik';

export type SeparatorOrientation = 'horizontal' | 'vertical';

export type SeparatorRootProps = PropsOf<'div'> & {
  /** 区切りの向き。既定値は `horizontal` */
  orientation?: SeparatorOrientation;
  /**
   * 見た目だけの区切りとして、支援技術から隠します（`role="none"`）。
   * 意味のある区切りでなければ `true` にしてください。
   */
  decorative?: boolean;
};

/**
 * コンテンツを区切る線です。
 *
 * 該当する APG パターンはないため、`role="separator"` を使います。
 * `decorative` のときは `role="none"` にして支援技術から隠します。
 * `<hr>` は子要素を持てず向きも表現できないため、`<div>` に role を付けています。
 */
export const SeparatorRoot = component$<SeparatorRootProps>(
  ({ orientation = 'horizontal', decorative = false, ...props }) => {
    return (
      // biome-ignore lint/a11y/useAriaPropsSupportedByRole: aria-orientation は role="separator" のときだけ出力している
      <div
        {...props}
        role={decorative ? 'none' : 'separator'}
        // separator の aria-orientation は既定値が horizontal なので、vertical のときだけ出力する
        aria-orientation={!decorative && orientation === 'vertical' ? 'vertical' : undefined}
        data-leve-separator=""
        data-orientation={orientation}
      />
    );
  },
);
