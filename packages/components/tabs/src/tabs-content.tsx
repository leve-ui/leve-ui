import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { getContentId, getTriggerId, tabsContextId } from './tabs-context';

export type TabsContentProps = Omit<PropsOf<'div'>, 'value'> & {
  /**
   * 対応するタブ（Trigger）の `value` と一致させる値。
   */
  value: string;
};

/**
 * 各タブに対応するコンテンツ領域（タブパネル）を表すコンポーネントです。
 *
 * `role="tabpanel"` を持ち、対応する Trigger とアクセシビリティ属性（`id` / `aria-labelledby`）で相互に関連付けられます。
 * 非アクティブ時は `hidden` 属性で非表示になり、常に描画されます。
 * キーボードフォーカスを受け取れるよう、`tabIndex={0}` が設定されています。
 */
export const TabsContent = component$<TabsContentProps>((props) => {
  const context = useContext(tabsContextId);
  const isSelected = context.selectedVal.value === props.value;

  return (
    <div
      {...props}
      role="tabpanel"
      id={getContentId(context.baseId, props.value)}
      aria-labelledby={getTriggerId(context.baseId, props.value)}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: WAI-ARIA APG の Tabs パターンに従い tabpanel をキーボードフォーカス可能にする
      tabIndex={0}
      hidden={!isSelected}
      data-leve-tabs-content=""
      data-state={isSelected ? 'active' : 'inactive'}
      data-orientation={context.orientation.value}
    >
      <Slot />
    </div>
  );
});
