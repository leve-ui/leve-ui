import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { dataAttr } from '@leve-ui/utils';
import { accordionContextId, accordionItemContextId } from './accordion-context';

export type AccordionContentProps = PropsOf<'div'>;

/**
 * アコーディオンの展開・折りたたみ対象となるコンテンツ領域です。
 *
 * APG Accordion パターンに準拠し、`role="region"` と Trigger を指す `aria-labelledby` を持ちます。
 * 閉じている間は `hidden` 属性で非表示になり、DOM 上に留まることで Trigger の `aria-controls` 参照先を維持します。
 */
export const AccordionContent = component$<AccordionContentProps>((props) => {
  const rootContext = useContext(accordionContextId);
  const itemContext = useContext(accordionItemContextId);

  return (
    // biome-ignore lint/a11y/useSemanticElements: APG Accordion パターンに従い div に role="region" を付与するため
    <div
      {...props}
      role="region"
      id={itemContext.ids.content}
      aria-labelledby={itemContext.ids.trigger}
      hidden={!itemContext.open.value}
      data-leve-accordion-content=""
      data-state={itemContext.open.value ? 'open' : 'closed'}
      data-disabled={dataAttr(itemContext.disabled.value)}
      data-orientation={rootContext.orientation.value}
    >
      <Slot />
    </div>
  );
});
