import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { tabsContextId } from './tabs-context';

export type TabsListProps = PropsOf<'div'>;

/**
 * タブ（Trigger）のリストをグループ化するコンポーネントです。
 *
 * `role="tablist"` を持ち、WAI-ARIA APG に準拠したキーボードナビゲーションの親要素として機能します。
 * アクセシブルネームを提供するため、利用者は `aria-label` または `aria-labelledby` を指定してください。
 */
export const TabsList = component$<TabsListProps>((props) => {
  const context = useContext(tabsContextId);

  return (
    <div
      {...props}
      role="tablist"
      aria-orientation={context.orientation.value}
      data-leve-tabs-list=""
      data-orientation={context.orientation.value}
    >
      <Slot />
    </div>
  );
});
