import { component$, type PropsOf } from '@builder.io/qwik';

export type MenuSeparatorProps = PropsOf<'div'>;

/** 項目の間の区切り線です。`role="separator"` を出力します。 */
export const MenuSeparator = component$<MenuSeparatorProps>((props) => {
  // biome-ignore lint/a11y/useSemanticElements: an <hr> is not allowed as a child of role="menu" content in all screen readers; the APG Menu example uses role="separator"
  return <div {...props} role="separator" data-leve-menu-separator="" />;
});
