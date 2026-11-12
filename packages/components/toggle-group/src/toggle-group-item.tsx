import {
  $,
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
import { toggleGroupContextId } from './toggle-group-context';

export type ToggleGroupItemProps = Omit<PropsOf<'button'>, 'value'> & {
  /**
   * この項目の値（必須）。
   */
  value: string;
  /**
   * この項目を無効化するかどうか。
   */
  disabled?: boolean;
};

/**
 * キーボードイベントによるスクロール等のブラウザ既定挙動を同期的に抑止します。
 */
export const syncKeyDown$ = sync$((event: KeyboardEvent, target: HTMLElement) => {
  const current = target || (event.currentTarget as HTMLElement);
  const item = current?.closest?.('[data-leve-toggle-group-item]') || current;
  const orientation = item?.getAttribute('data-orientation');
  const isHorizontal = orientation !== 'vertical';
  const key = event.key;
  const isHorizontalKey = isHorizontal && (key === 'ArrowRight' || key === 'ArrowLeft');
  const isVerticalKey = !isHorizontal && (key === 'ArrowDown' || key === 'ArrowUp');
  if (isHorizontalKey || isVerticalKey || key === 'Home' || key === 'End') {
    event.preventDefault();
  }
});

/**
 * トグルグループ内の個別の切り替えボタン要素です。
 *
 * ネイティブの `<button type="button">` を使用し、`aria-pressed` 属性でオン/オフ状態を表します。
 * `rovingFocus` が有効な場合は、ロービングタブインデックスと矢印キーによるフォーカス移動をサポートします。
 */
export const ToggleGroupItem = component$<ToggleGroupItemProps>((props) => {
  const {
    value: _value,
    disabled: _disabled,
    onClick$,
    onKeyDown$,
    onFocus$,
    ...restProps
  } = props;
  const context = useContext(toggleGroupContextId);

  const isDisabledSignal = useComputed$(
    () => Boolean(props.disabled) || Boolean(context.disabled.value),
  );
  const isPressedSignal = useComputed$(() => context.value.value.includes(props.value));

  useTask$(({ track, cleanup }) => {
    const disabled = track(() => isDisabledSignal.value);
    const val = track(() => props.value);
    const existing = context.items.find((t) => t.value === val);
    if (existing) {
      existing.disabled = disabled;
    } else {
      context.items.push({ value: val, disabled });
    }
    if (!getPlatform().isServer) {
      cleanup(() => {
        const index = context.items.findIndex((t) => t.value === val);
        if (index !== -1) {
          context.items.splice(index, 1);
        }
      });
    }
  });

  const tabIndexSignal = useComputed$(() => {
    if (!context.rovingFocus.value) return undefined;
    if (isDisabledSignal.value) return -1;

    // 1. If focusedValue is set to an enabled registered item:
    const focused = context.focusedValue.value;
    if (focused !== null) {
      const isFocusedEnabled = context.items.some(
        (item) => item.value === focused && !item.disabled,
      );
      if (isFocusedEnabled) {
        return focused === props.value ? 0 : -1;
      }
    }

    // 2. If this item is pressed and enabled:
    if (isPressedSignal.value) {
      const earlierPressed = context.items.find(
        (item) => !item.disabled && context.value.value.includes(item.value),
      );
      if (earlierPressed && earlierPressed.value !== props.value) {
        return -1;
      }
      return 0;
    }

    // 3. This item is not pressed.
    // If another registered item is enabled and pressed, this item cannot be the tab stop.
    const hasOtherEnabledPressed = context.items.some(
      (item) => !item.disabled && context.value.value.includes(item.value),
    );
    if (hasOtherEnabledPressed) {
      return -1;
    }

    // 4. Check if all pressed values in context.value are known to be disabled.
    const allPressedKnownDisabled =
      context.value.value.length > 0 &&
      context.value.value.every((val) => {
        const item = context.items.find((i) => i.value === val);
        return item ? item.disabled : false;
      });

    // If context.value is empty, or all pressed items are known to be disabled:
    if (context.value.value.length === 0 || allPressedKnownDisabled) {
      const firstEnabled = context.items.find((item) => !item.disabled)?.value ?? props.value;
      return firstEnabled === props.value ? 0 : -1;
    }

    // 5. If there are pressed values that are not registered in context.items yet:
    const matchingRegistered = context.items.some((item) =>
      context.value.value.includes(item.value),
    );
    if (!matchingRegistered) {
      const currentIndex = context.items.findIndex((item) => item.value === props.value);
      const hasItemsAfter = currentIndex !== -1 && currentIndex < context.items.length - 1;
      if (hasItemsAfter) {
        const firstEnabled = context.items.find((item) => !item.disabled)?.value ?? props.value;
        return firstEnabled === props.value ? 0 : -1;
      }
    }

    return -1;
  });

  const handleClick$ = $(async () => {
    if (isDisabledSignal.value) return;
    await context.toggleItem$(props.value);
  });

  const handleFocus$ = $(() => {
    context.focusedValue.value = props.value;
  });

  const handleKeyDown$ = $(async (event: KeyboardEvent, currentTarget: HTMLElement) => {
    const target = currentTarget || (event.currentTarget as HTMLElement);
    if (!target) return;
    const root = target.closest('[data-leve-toggle-group]');
    if (!root) return;

    const allItems = Array.from(
      root.querySelectorAll<HTMLButtonElement>('[data-leve-toggle-group-item]'),
    );
    const items = allItems.filter((el) => el.closest('[data-leve-toggle-group]') === root);

    moveRovingFocus(event, items, {
      orientation: context.orientation.value,
      loop: context.loop.value,
    });
  });

  return (
    <button
      {...restProps}
      type="button"
      aria-pressed={isPressedSignal.value ? 'true' : 'false'}
      disabled={isDisabledSignal.value}
      tabIndex={tabIndexSignal.value}
      data-leve-toggle-group-item=""
      data-state={isPressedSignal.value ? 'on' : 'off'}
      data-disabled={dataAttr(isDisabledSignal.value)}
      data-orientation={context.orientation.value}
      value={props.value}
      onClick$={[handleClick$, onClick$]}
      onKeyDown$={
        context.rovingFocus.value ? [syncKeyDown$, handleKeyDown$, onKeyDown$] : onKeyDown$
      }
      onFocus$={[handleFocus$, onFocus$]}
    >
      <Slot />
    </button>
  );
});
