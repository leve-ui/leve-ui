import {
  $,
  component$,
  getPlatform,
  type PropsOf,
  Slot,
  sync$,
  useContext,
  useTask$,
} from '@builder.io/qwik';
import { dataAttr, moveRovingFocus } from '@leve-ui/utils';
import { getContentId, getTriggerId, tabsContextId } from './tabs-context';

export type TabsTriggerProps = Omit<PropsOf<'button'>, 'value'> & {
  /** A unique value that identifies the tab. Must match the `value` of its Content. */
  value: string;
  /**
   * Disables the tab.
   * @default false
   */
  disabled?: boolean;
};

/**
 * キーボードイベントによるスクロール等のブラウザ既定挙動を同期的に抑止します。
 */
export const syncKeyDown$ = sync$((event: KeyboardEvent, target: HTMLElement) => {
  const el = target || (event.currentTarget as HTMLElement);
  const orientation = el?.getAttribute('data-orientation');
  const isHorizontal = orientation !== 'vertical';
  const key = event.key;
  const isHorizontalKey = isHorizontal && (key === 'ArrowRight' || key === 'ArrowLeft');
  const isVerticalKey = !isHorizontal && (key === 'ArrowDown' || key === 'ArrowUp');
  if (isHorizontalKey || isVerticalKey || key === 'Home' || key === 'End') {
    event.preventDefault();
  }
});

/**
 * 個々のタブボタンを表すコンポーネントです。
 *
 * `role="tab"` を持ち、対応する `Content`（`role="tabpanel"`）の表示状態を切り替えます。
 * APG に従ったロービングタブインデックスとキーボード操作（矢印キー、Home、End）をサポートします。
 */
export const TabsTrigger = component$<TabsTriggerProps>((props) => {
  const context = useContext(tabsContextId);

  useTask$(({ track, cleanup }) => {
    const disabled = track(() => Boolean(props.disabled));
    const val = track(() => props.value);
    const existing = context.triggers.find((t) => t.value === val);
    if (existing) {
      existing.disabled = disabled;
    } else {
      context.triggers.push({ value: val, disabled });
    }
    // Qwik 1.x の SSR ではシリアライズ前にコンテナの pause で各タスクの cleanup が実行され
    // registry が空になってしまうため、cleanup はクライアントでのみ登録する（SSR 描画された Trigger の登録を維持する）。
    // なお、ビルド時定数の isServer は Vitest / Node の createDOM() 環境下でも true になってしまい
    // テスト環境で cleanup が登録されなくなるため、実行時プラットフォーム判定の getPlatform().isServer を使用する。
    if (!getPlatform().isServer) {
      cleanup(() => {
        const index = context.triggers.findIndex((t) => t.value === val);
        if (index !== -1) {
          context.triggers.splice(index, 1);
        }
      });
    }
  });

  const isSelected = context.selectedVal.value === props.value;
  const selectedTrigger = context.triggers.find(
    (t) => t.value === context.selectedVal.value && !t.disabled,
  );
  const tabStopValue = selectedTrigger?.value ?? context.triggers.find((t) => !t.disabled)?.value;
  const isTabStop = tabStopValue === props.value && !props.disabled;
  const tabIndex = isTabStop ? 0 : -1;

  const handleClick$ = $(async () => {
    if (props.disabled) return;
    await context.setSelectedVal$(props.value);
  });

  const handleKeyDown$ = $(async (event: KeyboardEvent, currentTarget: HTMLElement) => {
    const target = currentTarget || (event.currentTarget as HTMLElement);
    if (!target) return;
    const root = target.closest('[data-leve-tabs]');
    if (!root) return;

    const allTriggers = Array.from(
      root.querySelectorAll<HTMLButtonElement>('[data-leve-tabs-trigger]'),
    );
    const items = allTriggers.filter((el) => el.closest('[data-leve-tabs]') === root);

    const nextItem = moveRovingFocus(event, items, {
      orientation: context.orientation.value,
      loop: context.loop.value,
    });

    if (nextItem && context.activationMode.value === 'automatic') {
      const nextValue = (nextItem as HTMLButtonElement).value;
      if (nextValue) {
        await context.setSelectedVal$(nextValue);
      }
    }
  });

  return (
    <button
      {...props}
      type="button"
      role="tab"
      id={getTriggerId(context.baseId, props.value)}
      aria-selected={isSelected ? 'true' : 'false'}
      aria-controls={getContentId(context.baseId, props.value)}
      tabIndex={tabIndex}
      disabled={props.disabled}
      data-leve-tabs-trigger=""
      data-state={isSelected ? 'active' : 'inactive'}
      data-disabled={dataAttr(props.disabled)}
      data-orientation={context.orientation.value}
      value={props.value}
      onClick$={[handleClick$, props.onClick$]}
      onKeyDown$={[syncKeyDown$, handleKeyDown$, props.onKeyDown$]}
    >
      <Slot />
    </button>
  );
});
