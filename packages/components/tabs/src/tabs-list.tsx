import { component$, type PropsOf, Slot, sync$, useContext } from '@builder.io/qwik';
import { tabsContextId } from './tabs-context';

export type TabsListProps = PropsOf<'div'>;

/**
 * タブ（Trigger）のリストをグループ化するコンポーネントです。
 *
 * `role="tablist"` を持ち、WAI-ARIA APG に準拠したキーボードナビゲーションの親要素として機能します。
 * アクセシブルネームを提供するため、利用者は `aria-label` または `aria-labelledby` を指定してください。
 */
export const TabsList = component$<TabsListProps>(({ onKeyDown$, ...props }) => {
  const context = useContext(tabsContextId);

  // Stop page scrolling asynchronously-dispatched arrow/Home/End/Space keys, even when Trigger renders via `as={Component}`
  const preventScroll$ = sync$((event: KeyboardEvent) => {
    const trigger = (event.target as Element | null)?.closest?.('[data-leve-tabs-trigger]');
    if (!trigger) return;
    const orientation = trigger.getAttribute('data-orientation');
    const isHorizontal = orientation !== 'vertical';
    const key = event.key;
    const isHorizontalKey = isHorizontal && (key === 'ArrowRight' || key === 'ArrowLeft');
    const isVerticalKey = !isHorizontal && (key === 'ArrowDown' || key === 'ArrowUp');
    if (
      isHorizontalKey ||
      isVerticalKey ||
      key === 'Home' ||
      key === 'End' ||
      (key === ' ' && trigger.tagName !== 'BUTTON')
    ) {
      event.preventDefault();
    }
  });

  return (
    <div
      {...props}
      role="tablist"
      aria-orientation={context.orientation.value}
      onKeyDown$={[preventScroll$, onKeyDown$]}
      data-leve-tabs-list=""
      data-orientation={context.orientation.value}
    >
      <Slot />
    </div>
  );
});
