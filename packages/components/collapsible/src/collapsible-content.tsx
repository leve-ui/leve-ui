import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { collapsibleContextId } from './collapsible-context';

export type CollapsibleContentProps = PropsOf<'div'>;

/**
 * 折りたたみ対象のコンテンツ領域要素です。
 *
 * 閉じている間は `hidden` 属性で非表示になり、常に DOM 上に描画されることで
 * Trigger の `aria-controls` 参照先を維持します。
 */
export const CollapsibleContent = component$<CollapsibleContentProps>((props) => {
  const context = useContext(collapsibleContextId);

  return (
    <div
      {...props}
      id={context.ids.content}
      hidden={!context.open.value}
      data-leve-collapsible-content=""
      data-state={context.open.value ? 'open' : 'closed'}
      data-disabled={dataAttr(context.disabled.value)}
    >
      <Slot />
    </div>
  );
});
