import { component$, type PropsOf, Slot } from '@builder.io/qwik';

export type MenuArrowProps = PropsOf<'div'>;

/**
 * Content の中に置く矢印です。見た目（SVG や回転した四角など）は利用者が描きます。
 * ライブラリは辺に沿った位置（インラインスタイル）と `data-side` だけを設定します（`adr/0030`）。
 * 装飾なので `aria-hidden="true"` を出力します。
 */
export const MenuArrow = component$<MenuArrowProps>((props) => {
  return (
    <div {...props} aria-hidden="true" data-leve-menu-arrow="">
      <Slot />
    </div>
  );
});
