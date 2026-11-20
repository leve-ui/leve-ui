import {
  $,
  type Component,
  component$,
  getPlatform,
  type PropsOf,
  Slot,
  sync$,
  useComputed$,
  useContext,
  useTask$,
} from '@builder.io/qwik';
import { dataAttr, moveRovingFocus } from '@leve-ui/utils';
import { getContentId, getTriggerId, tabsContextId } from './tabs-context';

export type TabsTriggerProps = Omit<PropsOf<'button'>, 'value'> & {
  /**
   * The element or component to render instead of `<button>`. A component must spread the props it receives onto one element.
   * @default 'button'
   */
  // biome-ignore lint/suspicious/noExplicitAny: Component props are contravariant, so only any accepts every component (adr/0038)
  as?: keyof HTMLElementTagNameMap | Component<any>;
  /** A unique value that identifies the tab. Must match the `value` of its Content. */
  value: string;
  /**
   * Disables the tab.
   * @default false
   */
  disabled?: boolean;
  [key: string]: unknown;
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
  const isNonButtonSpace = key === ' ' && el?.tagName !== 'BUTTON';
  if (isHorizontalKey || isVerticalKey || key === 'Home' || key === 'End' || isNonButtonSpace) {
    event.preventDefault();
  }
});

/**
 * 個々のタブボタンを表すコンポーネントです。
 *
 * `role="tab"` を持ち、対応する `Content`（`role="tabpanel"`）の表示状態を切り替えます。
 * APG に従ったロービングタブインデックスとキーボード操作（矢印キー、Home、End）をサポートします。
 * 既定では `<button type="button">` を描画し、`as` でほかの要素やコンポーネントに差し替えられます。
 */
export const TabsTrigger = component$<TabsTriggerProps>((props) => {
  const { as: Component = 'button', type, disabled: _disabled, ...restProps } = props;
  const context = useContext(tabsContextId);
  const Element = Component as 'button';
  const isHostElement = typeof Component === 'string';

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

  const isSelected = useComputed$(() => context.selectedVal.value === props.value);
  const tabIndex = useComputed$(() => {
    const selectedTrigger = context.triggers.find(
      (t) => t.value === context.selectedVal.value && !t.disabled,
    );
    const tabStopValue = selectedTrigger?.value ?? context.triggers.find((t) => !t.disabled)?.value;
    const isTabStop = tabStopValue === props.value && !props.disabled;
    return isTabStop ? 0 : -1;
  });
  const triggerId = useComputed$(() => getTriggerId(context.baseId, props.value));
  const contentId = useComputed$(() => getContentId(context.baseId, props.value));
  const triggerValue = useComputed$(() => props.value);
  const disabledAttr = useComputed$(() => dataAttr(props.disabled));
  const buttonDisabled = useComputed$(() =>
    (props.as ?? 'button') === 'button' ? props.disabled : undefined,
  );
  const ariaDisabled = useComputed$(() =>
    (props.as ?? 'button') !== 'button' && props.disabled ? 'true' : undefined,
  );

  const handleClick$ = $(async () => {
    if (props.disabled) return;
    await context.setSelectedVal$(props.value);
  });

  const handleKeyDown$ = $(async (event: KeyboardEvent, currentTarget: HTMLElement) => {
    const target = currentTarget || (event.currentTarget as HTMLElement);
    if (!target) return;

    if (
      !props.disabled &&
      target.tagName !== 'BUTTON' &&
      (event.key === ' ' ||
        (event.key === 'Enter' && !(target.tagName === 'A' && target.hasAttribute('href'))))
    ) {
      target.click();
      return;
    }

    const root = target.closest('[data-leve-tabs]');
    if (!root) return;

    const allTriggers = Array.from(root.querySelectorAll<HTMLElement>('[data-leve-tabs-trigger]'));
    const items = allTriggers.filter((el) => el.closest('[data-leve-tabs]') === root);

    const nextItem = moveRovingFocus(event, items, {
      orientation: context.orientation.value,
      loop: context.loop.value,
    });

    if (nextItem && context.activationMode.value === 'automatic') {
      const nextValue = nextItem.getAttribute('value');
      if (nextValue) {
        await context.setSelectedVal$(nextValue);
      }
    }
  });

  return (
    <Element
      {...restProps}
      type={Component === 'button' ? (type ?? 'button') : type}
      role="tab"
      id={triggerId.value}
      aria-selected={isSelected.value ? 'true' : 'false'}
      aria-controls={contentId.value}
      aria-disabled={ariaDisabled.value}
      tabIndex={tabIndex.value}
      disabled={buttonDisabled.value}
      data-leve-tabs-trigger=""
      data-state={isSelected.value ? 'active' : 'inactive'}
      data-disabled={disabledAttr.value}
      data-orientation={context.orientation.value}
      value={triggerValue.value}
      onClick$={[handleClick$, props.onClick$]}
      onKeyDown$={[isHostElement ? syncKeyDown$ : undefined, handleKeyDown$, props.onKeyDown$]}
    >
      <Slot />
    </Element>
  );
});
