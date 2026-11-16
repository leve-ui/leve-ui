import { component$, type PropsOf, useComputed$, useContext } from '@builder.io/qwik';
import { toolbarContextId } from '@leve-ui/utils';

export type ToolbarSeparatorProps = PropsOf<'div'>;

/**
 * ツールバーの項目を区切る線です。`role="separator"` を出力します。
 * 向きはツールバーと直交します（横並びのツールバーでは縦線で、`aria-orientation="vertical"`）。
 */
export const ToolbarSeparator = component$<ToolbarSeparatorProps>((props) => {
  const toolbar = useContext(toolbarContextId);
  const orientation = useComputed$(() =>
    toolbar.orientation.value === 'horizontal' ? 'vertical' : 'horizontal',
  );

  return (
    // biome-ignore lint/a11y/useSemanticElements: <hr> is a horizontal rule; a toolbar separator is usually vertical and needs aria-orientation (APG Toolbar example)
    <div
      {...props}
      role="separator"
      aria-orientation={orientation.value}
      data-leve-toolbar-separator=""
      data-orientation={orientation.value}
    />
  );
});
